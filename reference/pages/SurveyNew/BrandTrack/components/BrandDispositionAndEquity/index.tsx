import { KeyboardArrowDown, PlayArrow, Edit as EditIcon, Help, ExpandMore } from "@mui/icons-material"
import {  Accordion, AccordionSummary, Box, Chip, Grid, IconButton, ListItem, ListItemButton, MenuItem, Tooltip } from "@mui/material"
import Button, { BtnType } from "components/common/buttons/Button"
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody"
import ParagraphBodyUnderline from "components/common/text/ParagraphBodyUnderline"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import TextBtnSmall from "components/common/text/TextBtnSmall"
import NoteWarning from "components/common/warnings/NoteWarning"
import ProjectHelper, { editableProject } from "helpers/project"
import { AdditionalBrand, EBrandType } from "models/additional_brand"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { memo, useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { getAdditionalBrandsRequest, getProjectAttributesRequest, getProjectBrandsRequest, getUserAttributesRequest } from "redux/reducers/Project/actionTypes"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { ProjectAttributeService } from "services/project_attribute"
import { ProjectBrandService } from "services/project_brand"
import classes from "./styles.module.scss"
import { Menu } from "components/common/memu/Menu"
import { useTranslation } from "react-i18next"
import PopupPreDefinedList from "pages/SurveyNew/components/PopupPre-definedList"
import PopupAddOrEditAttribute, { UserAttributeFormData } from "pages/SurveyNew/components/PopupAddOrEditAttribute"
import { AttributeContentType, UserAttribute } from "models/user_attribute"
import { UserAttributeService } from "services/user_attribute"
import clsx from "clsx"
import InputCheckbox from "components/common/inputs/InputCheckbox"
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import { ProjectAttribute } from "models/project_attribute"
import CloseIcon from '@mui/icons-material/Close';
import EditSquare from "components/icons/IconEditSquare"
import ArrowBreak from "components/icons/IconArrowBreak"
import PopupConfirmDelete from "components/PopupConfirmDelete"
import PopupManatoryAttributes from "pages/SurveyNew/components/PopupManatoryAttributes"
import IconTagLoyalty from "components/icons/IconTagLoyalty"
import WarningIcon from "@mui/icons-material/Warning"
import PopupAddOrEditAdditionalBrand from "pages/SurveyNew/components/PopupAddOrEditAdditionalBrand"
import { AdditionalBrandService } from "services/additional_brand"
import { AttributeType } from "models/Admin/attribute"
import { AdditionalAttributeService } from "services/additional_attribute"
import { BrandForm } from "../BrandList"
import CheckList from "components/icons/IconCheckList"

interface BrandDispositionAndEquityProps {
  project: Project
}
enum AttributeShowType {
  Project = 1,
  User
}
interface AttributeShow {
  id: number,
  start: string,
  end: string,
  data: ProjectAttribute | UserAttribute,
  type: AttributeShowType,
  content: string,
  contentTypeId: number
}

const BrandDispositionAndEquity = memo(({ project }: BrandDispositionAndEquityProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [isOpenAddOrEditBrandModal, setIsOpenAddOrEditBrandModal] = useState<boolean>(false)
  const [competingBrandsSelected, setCompetingBrandsSelected] = useState<number[]>([])
  const [anchorElMenuAttributes, setAnchorElMenuAttributes] = useState<null | HTMLElement>(null);
  const [anchorElMenuChooseBrand, setAnchorElMenuChooseBrand] = useState<null | HTMLElement>(null);

  const [numberOfMandatoryAttributes, setNumberOfMandatoryAttributes] = useState<number>(0)
  const [openPopupMandatory, setOpenPopupMandatory] = useState(false)
  const [openPopupPreDefined, setOpenPopupPreDefined] = useState(false)
  const [openPopupAddAttributes, setOpenPopupAddAttributes] = useState(false)
  const [userAttributeEdit, setUserAttributeEdit] = useState<UserAttribute>()
  const [showMoreAttributes, setShowMoreAttributes] = useState<boolean>(false);
  const [userAttributeDelete, setUserAttributeDelete] = useState<UserAttribute>()
  const [projectAttributeDelete, setProjectAttributeDelete] = useState<ProjectAttribute>()
  
  const editable = useMemo(() => editableProject(project), [project])
  const competingBrandDatas = useMemo(() => project?.additionalBrands?.filter((item) => item?.typeId === EBrandType.COMPETING) || [], [project])
  const maxCompetitiveBrand = useMemo(() => ProjectHelper.maxCompetitiveBrand(project) || 0, [project])
  const maxEquityAttributes = useMemo(() => ProjectHelper.maxEquityAttributes(project) || 0, [project])
  const enableAddCompetitiveBrand = useMemo(() => {
    return maxCompetitiveBrand > (project?.projectBrands?.length || 0)
  }, [maxCompetitiveBrand, project])
  const enableAdditionalAttributes = useMemo(() => {
    return maxEquityAttributes > ((project?.projectAttributes?.length || 0) + (project?.userAttributes?.length || 0))
  }, [maxEquityAttributes, project])
  const attributes: AttributeShow[] = useMemo(() => {
    return [
      ...(project?.projectAttributes?.map(it => ({
        id: it.id,
        start: it.attribute.start,
        end: it.attribute.end,
        type: AttributeShowType.Project,
        data: it,
        content: it.attribute.content,
        contentTypeId: it.attribute.contentTypeId,
      })) || []),
      ...(project?.userAttributes?.map(it => ({
        id: it.id,
        start: it.start,
        end: it.end,
        type: AttributeShowType.User,
        data: it,
        content: it.content,
        contentTypeId: it.contentTypeId,
      })) || [])
    ].sort((a, b) => a?.contentTypeId - b?.contentTypeId)
  }, [project])
  const competitiveBrandNeedMore = useMemo(() => ProjectHelper.competitiveBrandNeedMore(project) || 0, [project])
  const brandEquityAttributesNeedMore = useMemo(() => ProjectHelper.brandEquityAttributesNeedMore(project) || 0, [project])

  useEffect(() => {
    const _competingBrandsSelected = []
    project?.projectBrands?.forEach(item => {
      _competingBrandsSelected.push(item.brandId)
    })
    setCompetingBrandsSelected(_competingBrandsSelected)
  }, [project, anchorElMenuChooseBrand])
  
  useEffect(() => {
    if (project?.solutionId) {
      AdditionalAttributeService.getAdditionalAttributes({ take: 9999, typeId: AttributeType.MANATORY, solutionId: project.solutionId })
        .then((mandatoryRes) => {
          setNumberOfMandatoryAttributes(mandatoryRes.data?.length || 0)
        })        
    }
  }, [project?.solutionId])

  const handleClickMenuChooseBrand = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenuChooseBrand(event.currentTarget)
  }
  const handleCloseMenuChooseBrand = () => {
    setCompetingBrandsSelected([])
    setAnchorElMenuChooseBrand(null);
  }
  
  const isDisabled = (item: AdditionalBrand) => {
    return !competingBrandsSelected.includes(item.id) && maxCompetitiveBrand <= competingBrandsSelected.length
  }
  
  const onOpenPopupAddOrEditBrand = () => {
    setIsOpenAddOrEditBrandModal(true)
  }
  
  const onClosePopupAddOrEditBrand = () => {
    setIsOpenAddOrEditBrandModal(false)
  }

  const handleAddCompetingBrand = (data: BrandForm) => {
    dispatch(setLoading(true))
    AdditionalBrandService.create({
      projectId: project.id,
      typeId: EBrandType.COMPETING,
      ...data
    })
      .then(() => {
        dispatch(getAdditionalBrandsRequest(project.id))
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onChangeChooseCompetingBrand = (item: AdditionalBrand) => {
    if (isDisabled(item)) return
    let _competingBrandsSelected = [...competingBrandsSelected]
    if (_competingBrandsSelected.includes(item.id)) {
      _competingBrandsSelected = _competingBrandsSelected.filter(it => it !== item.id)
    } else {
      _competingBrandsSelected.push(item.id)
    }
    setCompetingBrandsSelected(_competingBrandsSelected)
  }
  
  const onSubmitChooseProjectBrand = () => {
    dispatch(setLoading(true))
    // Delete project brand
    const projectBrandsNeedDelete = project?.projectBrands?.filter(item => !competingBrandsSelected.includes(item.brandId))
    const requestSubmit = []
    if(projectBrandsNeedDelete?.length > 0) {
      projectBrandsNeedDelete.forEach(item => {
        requestSubmit.push(ProjectBrandService.delete(item.id))
      })
    }
    
    // Add new project brand
    const projectBrandIds = project?.projectBrands?.map(item => item.brandId)
    const projectBrandsNew = competingBrandsSelected.filter(item => !projectBrandIds.includes(item))
    if(projectBrandsNew?.length > 0) {
      requestSubmit.push(
        ProjectBrandService.create({
          projectId: project.id,
          brandIds: projectBrandsNew
        })
      )
    }

    Promise.all([...requestSubmit])
      .then(() => {
        dispatch(getProjectBrandsRequest(project.id))
        handleCloseMenuChooseBrand()
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onDeleteProjectBrand = (id) => {
    dispatch(setLoading(true))
    ProjectBrandService.delete(id)
      .then(() => {
        dispatch(getProjectBrandsRequest(project.id))
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  // Attributes
  const handleClickMenuAttributes = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenuAttributes(event.currentTarget)
  }
  const handleCloseMenuAttributes = () => {
    setAnchorElMenuAttributes(null);
  }

  const onOpenPopupPreDefined = () => {
    setOpenPopupPreDefined(true)
    handleCloseMenuAttributes()
  }

  const onOpenPopupAddAttributes = () => {
    setOpenPopupAddAttributes(true)
    handleCloseMenuAttributes()
  }
  const onClosePopupAttribute = () => {
    setOpenPopupAddAttributes(false)
    setUserAttributeEdit(null)
  }

  const onAddProjectAttribute = (attributeIds: number[]) => {
    if (!attributeIds?.length) {
      setOpenPopupPreDefined(false)
      return
    }
    dispatch(setLoading(true))
    ProjectAttributeService.create({
      projectId: project.id,
      attributeIds: attributeIds
    })
      .then(() => {
        dispatch(getProjectAttributesRequest(project.id))
        setOpenPopupPreDefined(false)
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onAddOrEditUserAttribute = (data: UserAttributeFormData) => {
    if (userAttributeEdit) {
      dispatch(setLoading(true))
      UserAttributeService.update(userAttributeEdit.id, {
        content: data.content,
        contentTypeId: AttributeContentType.SINGLE,
      })
        .then(() => {
          dispatch(getUserAttributesRequest(project.id))
          onClosePopupAttribute()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      UserAttributeService.create({
        projectId: project.id,
        content: data.content,
        contentTypeId: AttributeContentType.SINGLE,
      })
        .then(() => {
          dispatch(getUserAttributesRequest(project.id))
          onClosePopupAttribute()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }
  
  const onEditUserAttribute = (item: UserAttribute) => {
    setUserAttributeEdit(item)
  }
  const onShowMoreAttributes = () => {
    setShowMoreAttributes(!showMoreAttributes)
  }  
  const onShowConfirmDeleteAttribute = (item: AttributeShow) => {
    switch (item.type) {
      case AttributeShowType.User:
        setUserAttributeDelete(item.data as UserAttribute)
        break;
      case AttributeShowType.Project:
        setProjectAttributeDelete(item.data as ProjectAttribute)
        break;
    }
  }
  const onCloseConfirmDeleteAttribute = () => {
    setUserAttributeDelete(null)
    setProjectAttributeDelete(null)
  }
  const onDeleteAttribute = () => {
    if (userAttributeDelete) {
      dispatch(setLoading(true))
      UserAttributeService.delete(userAttributeDelete.id)
        .then(() => {
          dispatch(getUserAttributesRequest(project.id))
          onCloseConfirmDeleteAttribute()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
    if (projectAttributeDelete) {
      dispatch(setLoading(true))
      ProjectAttributeService.delete(projectAttributeDelete.id)
        .then(() => {
          dispatch(getProjectAttributesRequest(project.id))
          onCloseConfirmDeleteAttribute()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  return (
    <>
      <Grid id={SETUP_SURVEY_SECTION.brand_disposition_and_equity} mt={4}>
        <Grid sx={{display: "flex", alignItems: "center", gap: "4px"}}>
          <Heading4
            $fontSizeMobile={"16px"}
            $colorName="--eerie-black"
            sx={{ display: "inline-block", verticalAlign: "middle" }}
            translation-key="brand_track_setup_brand_disposition_and_equity_title"
          >
            {t("brand_track_setup_brand_disposition_and_equity_title", {step: 3})}
          </Heading4>
          <Tooltip
            placement="right"
            arrow
            classes={{ popper: clsx(classes.tooltipPopper) }}
            title={(
              <Grid>
                <ParagraphExtraSmall 
                  $colorName={"var(--eerie-black)"} 
                  className={classes.tooltipContent}
                  translation-key="brand_track_setup_brand_disposition_and_equity_tooltip_content_1"
                  dangerouslySetInnerHTML={{
                    __html: t("brand_track_setup_brand_disposition_and_equity_tooltip_content_1"),
                  }}
                ></ParagraphExtraSmall>
                <ParagraphExtraSmall 
                  $colorName={"var(--eerie-black)"} 
                  className={classes.tooltipContent} 
                  mt={2}
                  translation-key="brand_track_setup_brand_disposition_and_equity_tooltip_content_2"
                  dangerouslySetInnerHTML={{
                    __html: t("brand_track_setup_brand_disposition_and_equity_tooltip_content_2"),
                  }}
                ></ParagraphExtraSmall>
              </Grid>
            )}
          >
            <Help sx={{ fontSize: "16px", color: "var(--gray-60)" }} className={classes.helpIcon} />
          </Tooltip>
        </Grid>
        <ParagraphBody $colorName="--eerie-black" mb={ 3 } mt={ 1 } translation-key="brand_track_setup_brand_disposition_and_equity_sub_title"
          dangerouslySetInnerHTML={{
            __html: t("brand_track_setup_brand_disposition_and_equity_sub_title"),
        }} 
        />
        <Grid>
          <div className={classes.competitiveBrandTitle}>
            <PlayArrow sx={{height: "18px"}}/>
            <ParagraphBody $fontWeight={600} $colorName="--eerie-black" translation-key="brand_track_setup_brand_disposition_and_equity_competitive_brand_title">
              {t("brand_track_setup_brand_disposition_and_equity_competitive_brand_title")}
            </ParagraphBody>
          </div>
          <ParagraphBody $colorName="--eerie-black" ml={ 3 } translation-key="brand_track_setup_brand_disposition_and_equity_competitive_brand_sub_title_1">
            {t("brand_track_setup_brand_disposition_and_equity_competitive_brand_sub_title_1")}
          </ParagraphBody>
          <ParagraphBody $colorName="--eerie-black" mb={ 2 } ml={ 3 } translation-key="brand_track_setup_brand_disposition_and_equity_competitive_brand_sub_title_2">
            {t("brand_track_setup_brand_disposition_and_equity_competitive_brand_sub_title_2")}
          </ParagraphBody> 
          {!!competingBrandDatas?.length ? (
            <>
              {!!competitiveBrandNeedMore && (
                <NoteWarning mb={ 3 } ml={ 3 }>
                  <ParagraphSmall $colorName="--warning-dark" className={classes.warning} translation-key="brand_track_setup_brand_disposition_and_equity_competitive_brand_need_more">
                    {t("brand_track_setup_brand_disposition_and_equity_competitive_brand_need_more", {number: competitiveBrandNeedMore})}
                  </ParagraphSmall>
                </NoteWarning>
                )}
              <Grid className={classes.competingBrandListWrapper}>
                {project?.projectBrands?.map(item => (
                  <Chip
                    key={item?.id}
                    classes={{ root: classes.rootChip }}
                    label={`${item?.brand?.brand} (${item?.brand?.variant})`}
                    onDelete={()=>onDeleteProjectBrand(item?.id)}
                    deleteIcon={<div><CloseIcon sx={{ fontSize: "20px", color: "var(--cimigo-blue)" }} /></div>}
                    disabled={!editable}
                  />
                ))}
                {
                  enableAddCompetitiveBrand && editable && (
                    <Button
                      sx={{ width: { xs: "100%", sm: "auto" }, maxHeight: "36px" }}
                      className={classes.selectBrandBtn}
                      onClick={handleClickMenuChooseBrand}
                      children={<TextBtnSmall $colorName="--gray-80" translation-key="brand_track_setup_brand_disposition_and_equity_competitive_brand_btn_select">{t("brand_track_setup_brand_disposition_and_equity_competitive_brand_btn_select")}</TextBtnSmall>}
                      startIcon={<IconTagLoyalty sx={{ fontSize: "16px !important", color: "var(--gray-80)" }} />}
                      endIcon={<KeyboardArrowDown sx={{ fontSize: "16px !important", color: "var(--gray-80)" }} />}
                    />
                  )
                }
                
              </Grid>
            </>
          ) : (
            <NoteWarning Icon={WarningIcon} className={classes.warningWrapper}>
              <ParagraphBody $colorName="--gray-80" className={classes.warning} translation-key="brand_track_setup_brand_disposition_and_equity_competitive_brand_no_brand_chose">
                {t("brand_track_setup_brand_disposition_and_equity_competitive_brand_no_brand_chose")}
                <span 
                  onClick={onOpenPopupAddOrEditBrand}
                  translation-key="brand_track_setup_brand_disposition_and_equity_competitive_brand_btn_add"
                >
                  {t("brand_track_setup_brand_disposition_and_equity_competitive_brand_btn_add")} +
                </span>
              </ParagraphBody>
            </NoteWarning>
          )}
          <Menu
            $minWidth={"354px"}
            anchorEl={anchorElMenuChooseBrand}
            open={Boolean(anchorElMenuChooseBrand)}
            onClose={handleCloseMenuChooseBrand}
            sx={{mt: 1}}
          >
            <Grid className={classes.menuChooseBrand}>
              {competingBrandDatas?.map(item => (
                <MenuItem key={item?.id} classes={{ root: clsx(classes.rootMenuItemChooseBrand, { [classes.disabled]: isDisabled(item) }) }} onClick={() => onChangeChooseCompetingBrand(item)}>
                  <Grid className={clsx(classes.menuItemFlex, { [classes.listFlexChecked]: competingBrandsSelected.includes(item?.id) })}>
                    <Grid>
                      <InputCheckbox
                        disabled={isDisabled(item)}
                        checkboxColorType={"blue"}
                        checked={competingBrandsSelected.includes(item?.id)}
                        classes={{ root: classes.rootMenuCheckbox }}
                        />
                    </Grid>
                    <Grid item className={classes.listTextLeft}>
                      <ParagraphBody $colorName="--gray-80">{item.brand} ({item.variant})</ParagraphBody>
                    </Grid>
                  </Grid>
                </MenuItem>
              ))}
            </Grid>
            <Grid className={classes.menuChooseBrandAction}>
              <Box sx={{padding: "8px 0"}}>
                <ParagraphBody translation-key="brand_track_setup_brand_selected" $colorName="--cimigo-blue">{competingBrandsSelected?.length}/{maxCompetitiveBrand} {t("brand_track_setup_brand_selected")}</ParagraphBody>
              </Box>
              <Button
                btnType={BtnType.Raised}
                translation-key="common_save"
                children={<TextBtnSmall>{t("common_save")}</TextBtnSmall>}
                className={classes.btnSave}
                onClick={onSubmitChooseProjectBrand}
              />
            </Grid>
          </Menu>
          {project?.projectBrands?.length >= maxCompetitiveBrand && (
            <ParagraphSmall $colorName="--gray-60" sx={{mt: 1, ml: 3}} translation-key="brand_track_setup_brand_disposition_and_equity_competitive_brand_reach_limit">
              {t("brand_track_setup_brand_disposition_and_equity_competitive_brand_reach_limit", {number: maxCompetitiveBrand})}
            </ParagraphSmall>
          )}
          <ParagraphBody 
            $colorName="--gray-80" 
            className={classes.note}
            translation-key="brand_track_setup_brand_disposition_and_equity_competitive_brand_note"
            dangerouslySetInnerHTML={{
              __html: t("brand_track_setup_brand_disposition_and_equity_competitive_brand_note"),
            }}
          ></ParagraphBody>
        </Grid>
        <Grid>
          <div className={classes.brandEquity}>
            <PlayArrow sx={{height: "18px"}}/>
            <ParagraphBody $fontWeight={600} $colorName="--eerie-black" translation-key="brand_track_setup_brand_disposition_and_equity_attributes_title">
              {t("brand_track_setup_brand_disposition_and_equity_attributes_title")}
            </ParagraphBody>
          </div>
          <ParagraphBody $colorName="--eerie-black" mb={ 2 } ml={ 3 } className={classes.brandEquitySubTitle} translation-key="brand_track_setup_brand_disposition_and_equity_attributes_sub_title_1">
            {t("brand_track_setup_brand_disposition_and_equity_attributes_sub_title_1")}{" "}
            <span onClick={() => setOpenPopupMandatory(true)} translation-key="brand_track_setup_brand_disposition_and_equity_attributes_sub_title_2">
              {t("brand_track_setup_brand_disposition_and_equity_attributes_sub_title_2", {number: numberOfMandatoryAttributes})}
            </span>{" "}
            {t("brand_track_setup_brand_disposition_and_equity_attributes_sub_title_3", {number: project?.solution?.maxEquityAttributes ?? 0})}
          </ParagraphBody>
          {!!brandEquityAttributesNeedMore && (
            <NoteWarning mt={0} mb={2} ml={3}>
              <ParagraphSmall $colorName="--warning-dark" translation-key="brand_track_setup_brand_disposition_and_equity_attributes_need_more">
                {t("brand_track_setup_brand_disposition_and_equity_attributes_need_more", {number: brandEquityAttributesNeedMore})}
              </ParagraphSmall>
            </NoteWarning>
          )}
          {/* =======start desktop===== */}
          <Grid className={classes.rootList}>
            {attributes?.map((item, index) => (
              <ListItem
                alignItems="center"
                component="div"
                key={index}
                className={clsx(classes.rootListItem, { [classes.notDisplayed]: index > 4 && !showMoreAttributes })}
                secondaryAction={
                  <div className={classes.btnAction}>
                    {editable && (
                      <>
                        {item.type === AttributeShowType.User && item.contentTypeId === AttributeContentType.SINGLE && (
                          <IconButton onClick={() => onEditUserAttribute(item.data as any)} className={classes.iconAction} edge="end" aria-label="Edit">
                            <EditIcon sx={{ fontSize: "20px", color: "var(--gray-60)" }} />
                          </IconButton>
                        )}
                        <IconButton onClick={() => onShowConfirmDeleteAttribute(item)} className={classes.iconAction} edge="end" aria-label="Delete">
                          <CloseIcon sx={{ fontSize: "20px", color: "var(--gray-60)" }} />
                        </IconButton>
                      </>
                    )}
                  </div>
                }
                disablePadding
              >
                {item?.contentTypeId === AttributeContentType.SINGLE ? (
                  <ListItemButton className={classes.listItem}>
                    <Grid display="flex" alignItems="center">
                      <Grid className={classes.iconEditSquareWrapper}>
                        {editable && item.type === AttributeShowType.User && (
                          <EditSquare sx={{ color: "var(--gray-40)", width: "16px", height: "16px" }} />
                        )}
                      </Grid>
                      <Grid item>
                        <ParagraphSmall $colorName="--cimigo-theme-light-on-surface">{item.content}</ParagraphSmall>
                      </Grid>
                    </Grid>
                  </ListItemButton>
                ) : (
                  <ListItemButton className={classes.listItem}>
                    <Grid display="flex" alignItems="center" justifyContent="center">
                      <Grid className={classes.iconEditSquareWrapper}>
                        {editable && item.type === AttributeShowType.User && item.contentTypeId === AttributeContentType.SINGLE && (
                          <EditSquare sx={{ color: "var(--gray-40)", width: "16px", height: "16px" }} />
                        )}
                      </Grid>
                      <Grid className={classes.listTextLeft}>
                        <ParagraphSmall $colorName="--cimigo-theme-light-on-surface">{item.start}</ParagraphSmall>
                      </Grid>
                      <Grid className={classes.listNumber}>
                        <ArrowBreak sx={{ color: "var(--gray-20)", width: "40px" }} />
                      </Grid>
                      <Grid className={classes.listTextRight}>
                        <ParagraphSmall $colorName="--cimigo-theme-light-on-surface">{item.end}</ParagraphSmall>
                      </Grid>
                    </Grid>
                  </ListItemButton>
                )}
              </ListItem>
            ))}
            {attributes.length > 5 && (
              showMoreAttributes ? (
                <ParagraphBodyUnderline sx={{ margin: "8px 0 0 16px" }} onClick={onShowMoreAttributes} translation-key="common_less_attributes_text">
                  {t("common_less_attributes_text", {number: attributes.length - 5})}
                </ParagraphBodyUnderline>
                ) : (
                <ParagraphBodyUnderline sx={{ margin: "8px 0 0 16px" }} onClick={onShowMoreAttributes} translation-key="common_more_attributes_text">
                  {t("common_more_attributes_text", {number: attributes.length - 5})}
                </ParagraphBodyUnderline>)
            )}
          </Grid>
          {/* =======end desktop===== */}
          {/* =======start mobile===== */}
          <Grid className={classes.rootListMobile}>
            {attributes?.map((item, index) => (
              <Accordion key={index} className={clsx(classes.itemListMobile, { [classes.notDisplayed]: index > 4 && !showMoreAttributes })}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                >
                  <Box>
                    {item?.contentTypeId === AttributeContentType.SINGLE ? (
                      <>
                        <ParagraphSmall className={classes.listMobileTitle} >{item.content}</ParagraphSmall>
                        <Box className={classes.listMobileContent}>
                          <ParagraphExtraSmall className={classes.listMobileText}>
                            {item.content}
                          </ParagraphExtraSmall>
                        </Box>
                      </>
                    ) : (
                      <>
                        <ParagraphSmall className={classes.listMobileTitle} >{item.start}</ParagraphSmall>
                        <Box className={classes.listMobileContent}>
                          <ParagraphExtraSmall className={classes.listMobileText}>
                            <span translation-key="setup_survey_add_att_start_label">{t("setup_survey_add_att_start_label")}: </span>{item.start}
                          </ParagraphExtraSmall>
                          <ParagraphExtraSmall mt={1} className={classes.listMobileText}>
                            <span translation-key="setup_survey_add_att_end_label">{t("setup_survey_add_att_end_label")}: </span>{item.end}
                          </ParagraphExtraSmall>
                        </Box>
                      </>
                    )}
                    {editable && (
                      <Box className={classes.listMobileAction}>
                        {item.type === AttributeShowType.User && item.contentTypeId === AttributeContentType.SINGLE && (
                          <Button
                            onClick={(e) => { e.stopPropagation(); onEditUserAttribute(item.data as any) }}
                            btnType={BtnType.Text}
                            translation-key="common_edit"
                            children={<ParagraphExtraSmall>{t('common_edit')}</ParagraphExtraSmall>}
                          />
                        )}
                        <Button
                          onClick={(e) => { e.stopPropagation(); onShowConfirmDeleteAttribute(item) }}
                          className={classes.listMobileActionDelete}
                          btnType={BtnType.Text}
                          translation-key="common_delete"
                          children={<ParagraphExtraSmall>{t('common_delete')}</ParagraphExtraSmall>}
                        />
                      </Box>
                    )}
                  </Box>
                </AccordionSummary>
              </Accordion>
            ))}
            {attributes.length > 5 && (
              showMoreAttributes ? (
                <ParagraphBodyUnderline sx={{ margin: "8px 0 0 16px" }} onClick={onShowMoreAttributes} translation-key="common_less_attributes_text">
                  {t("common_less_attributes_text", {number: attributes.length - 5})}
                </ParagraphBodyUnderline>
                ) : (
                <ParagraphBodyUnderline sx={{ margin: "8px 0 0 16px" }} onClick={onShowMoreAttributes} translation-key="common_more_attributes_text">
                  {t("common_more_attributes_text", {number: attributes.length - 5})}
                </ParagraphBodyUnderline>)
            )}
          </Grid>
          {/* =======end mobile===== */}
          <Button
            sx={{ mt: attributes?.length > 0 ? 3 : 1, ml: 3, width: { xs: "calc(100% - 24px)", sm: "auto" } }}
            disableRipple
            onClick={handleClickMenuAttributes}
            disabled={!enableAdditionalAttributes || !editable}
            btnType={BtnType.Outlined}
            translation-key="brand_track_setup_brand_disposition_and_equity_attributes_btn_add"
            children={<TextBtnSmall>{t('brand_track_setup_brand_disposition_and_equity_attributes_btn_add')}</TextBtnSmall>}
            endIcon={<KeyboardArrowDown sx={{ fontSize: "16px !important" }} />}
          />
          <Menu
            $minWidth={"unset"}
            anchorEl={anchorElMenuAttributes}
            open={Boolean(anchorElMenuAttributes)}
            onClose={handleCloseMenuAttributes}
          >
            <MenuItem onClick={onOpenPopupPreDefined}>
              <CheckList sx={{ color: "var(--gray-80)", width: "16px", height: "16px", marginRight: "12px", verticalAlign: "middle" }} />
              <ParagraphBody translation-key="setup_survey_add_att_menu_action_from_pre_defined_list" className={classes.itemAddAttribute}>{t('setup_survey_add_att_menu_action_from_pre_defined_list')}</ParagraphBody>
            </MenuItem>
            <MenuItem onClick={onOpenPopupAddAttributes}>
              <EditSquare sx={{ color: "var(--gray-80)", width: "16px", height: "16px", marginRight: "12px", verticalAlign: "middle" }} />
              <ParagraphBody translation-key="setup_survey_add_att_menu_action_your_own_attribute" className={classes.itemAddAttribute}>{t('setup_survey_add_att_menu_action_your_own_attribute')}</ParagraphBody>
            </MenuItem>
          </Menu>
          {attributes?.length >= maxEquityAttributes && (
            <ParagraphSmall $colorName="--gray-60" mt={1} ml={3} translation-key="brand_track_setup_brand_disposition_and_equity_attributes_reach_limit">
              {t("brand_track_setup_brand_disposition_and_equity_attributes_reach_limit", {number: maxEquityAttributes})}
            </ParagraphSmall>
          )}
        </Grid>
      </Grid >
      <PopupAddOrEditAdditionalBrand
        isOpen={isOpenAddOrEditBrandModal}
        onClose={onClosePopupAddOrEditBrand}
        brand={null}
        project={project}
        onSubmit={handleAddCompetingBrand}
        brandType={EBrandType.COMPETING}
      />
      <PopupManatoryAttributes
        isOpen={openPopupMandatory}
        project={project}
        onClose={() => setOpenPopupMandatory(false)}
      />
      <PopupPreDefinedList
        isOpen={openPopupPreDefined}
        project={project}
        projectAttributes={project?.projectAttributes}
        maxSelect={(project?.solution?.maxEquityAttributes || 0) - ((project?.projectAttributes?.length || 0) + (project?.userAttributes?.length || 0))}
        onClose={() => setOpenPopupPreDefined(false)}
        onSubmit={onAddProjectAttribute}
      />
      <PopupAddOrEditAttribute
        isAdd={openPopupAddAttributes}
        itemEdit={userAttributeEdit}
        project={project}
        onCancel={() => onClosePopupAttribute()}
        onSubmit={onAddOrEditUserAttribute}
      />
      <PopupConfirmDelete
        isOpen={!!userAttributeDelete || !!projectAttributeDelete}
        title={t('setup_survey_add_att_confirm_delete_title')}
        description={t('setup_survey_add_att_confirm_delete_sub')}
        onCancel={() => onCloseConfirmDeleteAttribute()}
        onDelete={onDeleteAttribute}
      />
    </>
  )
})

export default BrandDispositionAndEquity