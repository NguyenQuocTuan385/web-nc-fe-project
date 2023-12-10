import { Accordion, AccordionSummary, Box, Grid, IconButton, ListItem, ListItemButton, ListItemText, MenuItem } from "@mui/material"
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import { editableProject } from "helpers/project"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { ProjectAttribute } from "models/project_attribute"
import { AttributeContentType, UserAttribute } from "models/user_attribute"
import PopupManatoryAttributes from "pages/SurveyNew/components/PopupManatoryAttributes"
import { MaxChip, Tip } from "pages/SurveyNew/components"
import { memo, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import classes from "./styles.module.scss"
import { Edit as EditIcon, DeleteForever as DeleteForeverIcon, KeyboardArrowDown, ExpandMore, LightbulbOutlined } from "@mui/icons-material"
import CloseIcon from '@mui/icons-material/Close';
import Button, { BtnType } from "components/common/buttons/Button"
import TextBtnSmall from "components/common/text/TextBtnSmall"
import { Menu } from "components/common/memu/Menu"
import PopupPreDefinedList from "pages/SurveyNew/components/PopupPre-definedList"
import PopupAddOrEditAttribute, { UserAttributeFormData } from "pages/SurveyNew/components/PopupAddOrEditAttribute"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { ProjectAttributeService } from "services/project_attribute"
import { getProjectAttributesRequest, getUserAttributesRequest } from "redux/reducers/Project/actionTypes"
import { UserAttributeService } from "services/user_attribute"
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import PopupConfirmDelete from "components/PopupConfirmDelete"
import ArrowBreak from "components/icons/IconArrowBreak"
import EditSquare from "components/icons/IconEditSquare"
import CheckList from "components/icons/IconCheckList"
import ParagraphBodyUnderline from "components/common/text/ParagraphBodyUnderline"
import clsx from "clsx"

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

interface AdditionalAttributesProps {
  project: Project;
}


const AdditionalAttributes = memo(({ project }: AdditionalAttributesProps) => {

  const { t } = useTranslation()
  const dispatch = useDispatch()


  const [openPopupMandatory, setOpenPopupMandatory] = useState(false)
  const [openPopupPreDefined, setOpenPopupPreDefined] = useState(false)

  const [openPopupAddAttributes, setOpenPopupAddAttributes] = useState(false)
  const [userAttributeEdit, setUserAttributeEdit] = useState<UserAttribute>()
  const [userAttributeDelete, setUserAttributeDelete] = useState<UserAttribute>()
  const [projectAttributeDelete, setProjectAttributeDelete] = useState<ProjectAttribute>()
  const [anchorElMenuAttributes, setAnchorElMenuAttributes] = useState<null | HTMLElement>(null);
  const [showMoreAttributes, setShowMoreAttributes] = useState<boolean>(false);

  const editable = useMemo(() => editableProject(project), [project])

  const maxAdditionalAttribute = useMemo(() => project?.solution?.maxAdditionalAttribute || 0, [project])

  const enableAdditionalAttributes = useMemo(() => {
    return maxAdditionalAttribute > ((project?.projectAttributes?.length || 0) + (project?.userAttributes?.length || 0))
  }, [maxAdditionalAttribute, project])

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

  const onEditUserAttribute = (item: UserAttribute) => {
    setUserAttributeEdit(item)
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
  const onShowMoreAttributes = () => {
    setShowMoreAttributes(!showMoreAttributes)
  }

  return (
    <Grid id={SETUP_SURVEY_SECTION.additional_attributes} mt={4}>
      <Heading4
        $fontSizeMobile={"16px"}
        $colorName="--eerie-black"
        translation-key="setup_survey_add_att_title"
        sx={{ display: "inline-block", verticalAlign: "middle" }}
      >
        {t('setup_survey_add_att_title', { step: 4 })}
      </Heading4>
      <MaxChip sx={{ ml: 1 }} label={<ParagraphSmall $colorName="--eerie-black">{t('common_max')} {maxAdditionalAttribute}</ParagraphSmall>} />
      <ParagraphBody
        $colorName="--gray-80"
        mt={1}
        translation-key="setup_survey_add_att_sub_title_1,setup_survey_add_att_sub_title_2,setup_survey_add_att_sub_title_3"
      >
        {t('setup_survey_add_att_sub_title_1')} <span className={classes.subtitleLink} onClick={() => setOpenPopupMandatory(true)}>{t('setup_survey_add_att_sub_title_2')}</span>. {t('setup_survey_add_att_sub_title_3')}
      </ParagraphBody>
      {/* =======start desktop===== */}
      <Grid className={classes.rootList} mt={2}>
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
          <ParagraphBodyUnderline sx={{ margin: "8px 0 0 16px" }} onClick={onShowMoreAttributes}>
            {showMoreAttributes ? "- 1 less attribute" : "+ 1 more attribute"}
          </ParagraphBodyUnderline>
        )}
      </Grid>
      {/* =======end desktop===== */}
      {/* =======start mobile===== */}
      <Grid className={classes.rootListMobile} mt={3}>
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
          <ParagraphBodyUnderline sx={{ margin: "8px 0 0 16px" }} onClick={onShowMoreAttributes}>
            {showMoreAttributes ? "- 1 less attribute" : "+ 1 more attribute"}
          </ParagraphBodyUnderline>
        )}
      </Grid>
      {/* =======end mobile===== */}
      <Button
        sx={{ mt: 3, width: { xs: "100%", sm: "auto" } }}
        onClick={handleClickMenuAttributes}
        disabled={!enableAdditionalAttributes || !editable}
        btnType={BtnType.Outlined}
        translation-key="setup_survey_add_att_menu_action_placeholder"
        children={<TextBtnSmall>{t('setup_survey_add_att_menu_action_placeholder')}</TextBtnSmall>}
        endIcon={<KeyboardArrowDown sx={{ fontSize: "16px !important" }} />}
      />
      <Menu
        $minWidth={"unset"}
        anchorEl={anchorElMenuAttributes}
        open={Boolean(anchorElMenuAttributes)}
        onClose={handleCloseMenuAttributes}
      >
        <MenuItem onClick={onOpenPopupPreDefined} className={classes.itemItemAddAttributeWrapper}>
          <ParagraphBody translation-key="setup_survey_add_att_menu_action_from_pre_defined_list" className={classes.itemAddAttribute}>
            <CheckList sx={{ color: "var(--gray-80)", width: "16px", height: "16px", marginRight: "12px", verticalAlign: "middle" }} />
            {t('setup_survey_add_att_menu_action_from_pre_defined_list')}
          </ParagraphBody>
        </MenuItem>
        <MenuItem onClick={onOpenPopupAddAttributes} className={classes.itemItemAddAttributeWrapper}>
          <ParagraphBody translation-key="setup_survey_add_att_menu_action_your_own_attribute" className={classes.itemAddAttribute}>
            <EditSquare sx={{ color: "var(--gray-80)", width: "16px", height: "16px", marginRight: "12px", verticalAlign: "middle" }} />
            {t('setup_survey_add_att_menu_action_your_own_attribute')}
          </ParagraphBody>
        </MenuItem>
      </Menu>
      {!enableAdditionalAttributes && (
        <ParagraphSmall mt={1} translation-key="setup_survey_add_att_error_max" $colorName="--red-error">{t('setup_survey_add_att_error_max', { max: maxAdditionalAttribute })}</ParagraphSmall>
      )}
      <Tip sx={{ mt: { sm: 3, xs: 1 } }}>
        <LightbulbOutlined />
        <ParagraphSmall translation-key="setup_survey_add_att_tip" dangerouslySetInnerHTML={{ __html: t('setup_survey_add_att_tip') }} />
      </Tip>
      <PopupManatoryAttributes
        isOpen={openPopupMandatory}
        project={project}
        onClose={() => setOpenPopupMandatory(false)}
      />
      <PopupPreDefinedList
        isOpen={openPopupPreDefined}
        project={project}
        projectAttributes={project?.projectAttributes}
        maxSelect={(project?.solution?.maxAdditionalAttribute || 0) - ((project?.projectAttributes?.length || 0) + (project?.userAttributes?.length || 0))}
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
    </Grid>
  )
})

export default AdditionalAttributes