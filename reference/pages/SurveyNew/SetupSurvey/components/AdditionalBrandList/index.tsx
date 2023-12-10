import { AddCircle, MoreHoriz, Save as SaveIcon, Edit as EditIcon, DeleteForever as DeleteForeverIcon, MoreVert} from "@mui/icons-material"
import { Grid, IconButton, ListItemIcon, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import Button, { BtnType } from "components/common/buttons/Button"
import ButtonClose from "components/common/buttons/ButtonClose"
import InputLineTextField from "components/common/inputs/InputLineTextfield"
import { Menu } from "components/common/memu/Menu"
import { SetupTable } from "components/common/table/SetupTable"
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody"
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import SubTitle from "components/common/text/SubTitle"
import TextBtnSmall from "components/common/text/TextBtnSmall"
import PopupConfirmDelete from "components/PopupConfirmDelete"
import { editableProject } from "helpers/project"
import { AdditionalBrand } from "models/additional_brand"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { MaxChip } from "pages/SurveyNew/components"
import PopupAddOrEditBrand, { BrandFormData } from "pages/SurveyNew/components/PopupAddOrEditBrand"
import { memo, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { getAdditionalBrandsRequest } from "redux/reducers/Project/actionTypes"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { AdditionalBrandService } from "services/additional_brand"
import classes from "./styles.module.scss"
import ProjectHelper from "helpers/project";
import NoteWarning from "components/common/warnings/NoteWarning";

interface AdditionalBrandListProps {
  project: Project
}

const AdditionalBrandList = memo(({ project }: AdditionalBrandListProps) => {

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [anchorElADB, setAnchorElADB] = useState<null | HTMLElement>(null);
  const [anchorElADBMobile, setAnchorElADBMobile] = useState<null | HTMLElement>(null);
  const [addBrandMobile, setAddBrandMobile] = useState<boolean>(false);
  const [brandEditMobile, setBrandEditMobile] = useState<AdditionalBrand>();
  const [brandDelete, setBrandDelete] = useState<AdditionalBrand>();

  const [addRow, setAddRow] = useState(false)
  const [brandFormData, setBrandFormData] = useState<{ brand: string; manufacturer: string; variant: string }>()
  const [additionalBrandAction, setAdditionalBrandAction] = useState<AdditionalBrand>();
  const [additionalBrandEdit, setAdditionalBrandEdit] = useState<AdditionalBrand>();

  const editable = useMemo(() => editableProject(project), [project])

  const maxAdditionalBrand = useMemo(() => project?.solution?.maxAdditionalBrand || 0, [project])

  const additionalBrandNeedMore = useMemo(() => ProjectHelper.additionalBrandNeedMore(project), [project])

  const enableAdditionalBrand = useMemo(() => {
    return maxAdditionalBrand > project?.additionalBrands?.length && editable
  }, [maxAdditionalBrand, project, editable])

  const enableAddBrand = useMemo(() => {
    return !!brandFormData?.brand && !!brandFormData?.manufacturer && !!brandFormData?.variant
  }, [brandFormData])

  const onAddOrEditBrand = () => {
    if (!enableAddBrand) return
    if (additionalBrandEdit) {
      dispatch(setLoading(true))
      AdditionalBrandService.update(additionalBrandEdit.id, {
        brand: brandFormData.brand,
        manufacturer: brandFormData.manufacturer,
        variant: brandFormData.variant,
      })
        .then(() => {
          dispatch(getAdditionalBrandsRequest(project.id))
          onCancelAddOrEditBrand()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      AdditionalBrandService.create({
        projectId: project.id,
        brand: brandFormData.brand,
        manufacturer: brandFormData.manufacturer,
        variant: brandFormData.variant,
      })
        .then(() => {
          dispatch(getAdditionalBrandsRequest(project.id))
          onCancelAddOrEditBrand()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onAddOrEditBrandMobile = (data: BrandFormData) => {
    if (brandEditMobile) {
      dispatch(setLoading(true))
      AdditionalBrandService.update(brandEditMobile.id, {
        brand: data.brand,
        manufacturer: data.manufacturer,
        variant: data.variant,
      })
        .then(() => {
          dispatch(getAdditionalBrandsRequest(project.id))
          onClosePopupAddOrEditBrand()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      AdditionalBrandService.create({
        projectId: project.id,
        brand: data.brand,
        manufacturer: data.manufacturer,
        variant: data.variant,
      })
        .then(() => {
          dispatch(getAdditionalBrandsRequest(project.id))
          onClosePopupAddOrEditBrand()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onCancelAddOrEditBrand = () => {
    setAddRow(false)
    setBrandFormData(null)
    setAdditionalBrandEdit(null)
  }

  const onEditBrand = () => {
    if (!additionalBrandAction) return
    setAdditionalBrandEdit(additionalBrandAction)
    setBrandFormData({
      brand: additionalBrandAction.brand,
      manufacturer: additionalBrandAction.manufacturer,
      variant: additionalBrandAction.variant
    })
    onCloseActionADB()
  }

  const onDeleteBrand = () => {
    if (!brandDelete) return
    dispatch(setLoading(true))
    AdditionalBrandService.delete(brandDelete.id)
      .then(() => {
        dispatch(getAdditionalBrandsRequest(project.id))
        onCloseConfirmDeleteBrand()
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onShowConfirmDeleteBrand = () => {
    if (!additionalBrandAction) return
    setBrandDelete(additionalBrandAction)
    onCloseActionADB()
  }

  const onCloseConfirmDeleteBrand = () => {
    setBrandDelete(null)
  }

  const onClosePopupAddOrEditBrand = () => {
    setAddBrandMobile(false)
    setBrandEditMobile(null)
  }

  const onCloseActionADB = () => {
    setAnchorElADB(null)
    setAnchorElADBMobile(null)
    setAdditionalBrandAction(null)
  }

  const onShowBrandEditMobile = () => {
    if (!additionalBrandAction) return
    setBrandEditMobile(additionalBrandAction)
    onCloseActionADB()
  }

  const onShowAddRow = () => {
    setBrandFormData(null)
    setAdditionalBrandEdit(null)
    setAddRow(true)
  }

  return (
    <Grid id={SETUP_SURVEY_SECTION.additional_brand_list} mt={4}>
      <Heading4
        $fontSizeMobile={"16px"}
        $colorName="--eerie-black"
        translation-key="setup_survey_add_brand_title"
        sx={{ display: "inline-block", verticalAlign: "middle" }}
      >
        {t('setup_survey_add_brand_title', { step: 3 })}
      </Heading4>
      <MaxChip sx={{ ml: 1 }} label={<ParagraphSmall $colorName="--eerie-black">{t('common_max')} {maxAdditionalBrand}</ParagraphSmall>} />
      <ParagraphBody
        $colorName="--gray-80"
        mt={1}
        mb={{ xs: 3, sm: 2 }}
        translation-key="setup_survey_add_brand_sub_title"
        dangerouslySetInnerHTML={{ __html: t('setup_survey_add_brand_sub_title') }}
      />
      { !!additionalBrandNeedMore && (
        <NoteWarning>
            <ParagraphSmall translation-key="setup_survey_add_brand_note_warning" 
            $colorName="--warning-dark" 
            sx={{"& > span": {fontWeight: 600}, mb: 2}}
            dangerouslySetInnerHTML={{
            __html: t("setup_survey_add_brand_note_warning", {
            number: additionalBrandNeedMore,}),
            }}>
          </ParagraphSmall>
        </NoteWarning>
        )}
      {/* ===================start brand list desktop====================== */}
      <SetupTable className={classes.desktopTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell translation-key="project_brand">
                <SubTitle>{t('project_brand')}</SubTitle>
              </TableCell>
              <TableCell translation-key="project_variant">
                <SubTitle>{t('project_variant')}</SubTitle>
              </TableCell>
              <TableCell translation-key="project_manufacturer">
                <SubTitle>{t('project_manufacturer')}</SubTitle>
              </TableCell>
              <TableCell align="center" translation-key="common_action">
                <SubTitle>{t('common_action')}</SubTitle>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {project?.packs?.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  <ParagraphBody>{item.brand}</ParagraphBody>
                </TableCell>
                <TableCell>
                  <ParagraphBody>{item.variant}</ParagraphBody>
                </TableCell>
                <TableCell>
                  <ParagraphBody>{item.manufacturer}</ParagraphBody>
                </TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            ))}
            {project?.additionalBrands?.map(item => (
              additionalBrandEdit?.id === item.id ? (
                <TableRow key={item.id} className="edit-row">
                  <TableCell>
                    <InputLineTextField
                      name=""
                      placeholder={t('setup_survey_add_brand_brand_placeholder')}
                      translation-key-placeholder="setup_survey_add_brand_brand_placeholder"
                      value={brandFormData?.brand || ''}
                      onChange={(e) => {
                        setBrandFormData({
                          ...brandFormData,
                          brand: e.target.value || ''
                        })
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <InputLineTextField
                      name=""
                      placeholder={t('setup_survey_add_brand_variant_placeholder')}
                      translation-key-placeholder="setup_survey_add_brand_variant_placeholder"
                      value={brandFormData?.variant || ''}
                      onChange={(e) => {
                        setBrandFormData({
                          ...brandFormData,
                          variant: e.target.value || ''
                        })
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <InputLineTextField
                      name=""
                      placeholder={t('setup_survey_add_brand_manufacturer_placeholder')}
                      translation-key-placeholder="setup_survey_add_brand_manufacturer_placeholder"
                      value={brandFormData?.manufacturer || ''}
                      onChange={(e) => {
                        setBrandFormData({
                          ...brandFormData,
                          manufacturer: e.target.value || ''
                        })
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Button
                        btnType={BtnType.Outlined}
                        translation-key="common_save"
                        children={<TextBtnSmall>{t('common_save')}</TextBtnSmall>}
                        startIcon={<SaveIcon sx={{ fontSize: "16px !important" }} />}
                        disabled={!enableAddBrand}
                        onClick={onAddOrEditBrand}
                      />
                      <ButtonClose className={classes.btnDeleteRow}
                        $backgroundColor="--ghost-white"
                        $colorName="--eerie-black-40"
                        onClick={() => onCancelAddOrEditBrand()}
                      />
                    </Grid>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={item.id}>
                  <TableCell>
                    <ParagraphBody>{item.brand}</ParagraphBody>
                  </TableCell>
                  <TableCell>
                    <ParagraphBody>{item.variant}</ParagraphBody>
                  </TableCell>
                  <TableCell>
                    <ParagraphBody>{item.manufacturer}</ParagraphBody>
                  </TableCell>
                  <TableCell align="center">
                    {editable && (
                      <IconButton
                        sx={{ padding: "6px" }}
                        onClick={(e) => {
                          setAnchorElADB(e.currentTarget)
                          setAdditionalBrandAction(item)
                        }}
                      >
                        <MoreHoriz sx={{ fontSize: "20px" }} />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              )
            ))}
            {(addRow && !additionalBrandEdit) && (
              <TableRow className="edit-row">
                <TableCell>
                  <InputLineTextField
                    name=""
                    placeholder={t('setup_survey_add_brand_brand_placeholder')}
                    translation-key-placeholder="setup_survey_add_brand_brand_placeholder"
                    value={brandFormData?.brand || ''}
                    onChange={(e) => {
                      setBrandFormData({
                        ...brandFormData,
                        brand: e.target.value || ''
                      })
                    }}
                  />
                </TableCell>
                <TableCell>
                  <InputLineTextField
                    name=""
                    placeholder={t('setup_survey_add_brand_variant_placeholder')}
                    translation-key-placeholder="setup_survey_add_brand_variant_placeholder"
                    value={brandFormData?.variant || ''}
                    onChange={(e) => {
                      setBrandFormData({
                        ...brandFormData,
                        variant: e.target.value || ''
                      })
                    }}
                  />
                </TableCell>
                <TableCell>
                  <InputLineTextField
                    name=""
                    placeholder={t('setup_survey_add_brand_manufacturer_placeholder')}
                    translation-key-placeholder="setup_survey_add_brand_manufacturer_placeholder"
                    value={brandFormData?.manufacturer || ''}
                    onChange={(e) => {
                      setBrandFormData({
                        ...brandFormData,
                        manufacturer: e.target.value || ''
                      })
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                      btnType={BtnType.Outlined}
                      translation-key="common_save"
                      children={<TextBtnSmall>{t('common_save')}</TextBtnSmall>}
                      startIcon={<SaveIcon sx={{ fontSize: "16px !important" }} />}
                      disabled={!enableAddBrand}
                      onClick={onAddOrEditBrand}
                      className={classes.btnAddRow}
                    />
                    <ButtonClose className={classes.btnDeleteRow}
                      $backgroundColor="--ghost-white"
                      $colorName="--eerie-black-40"
                      onClick={() => onCancelAddOrEditBrand()}
                    />
                  </Grid>
                </TableCell>
              </TableRow>
            )}
            {(enableAdditionalBrand && !addRow) && (
              <TableRow onClick={onShowAddRow} className="action-row" sx={{ cursor: "pointer" }}>
                <TableCell colSpan={4} variant="footer" align="center" scope="row">
                  <Button
                    btnType={BtnType.Text}
                    translation-key="setup_survey_add_brand_btn_add"
                    children={<TextBtnSmall>{t('setup_survey_add_brand_btn_add')}</TextBtnSmall>}
                    startIcon={<AddCircle sx={{ fontSize: "16px !important" }} />}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </SetupTable>
      <Menu
        anchorEl={anchorElADB}
        open={Boolean(anchorElADB)}
        onClose={onCloseActionADB}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => onEditBrand()}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ParagraphBody translation-key="common_edit">{t('common_edit')}</ParagraphBody>
        </MenuItem>
        <MenuItem onClick={() => onShowConfirmDeleteBrand()}>
          <ListItemIcon>
            <DeleteForeverIcon sx={{ color: "var(--red-error) !important" }} fontSize="small" />
          </ListItemIcon>
          <ParagraphBody translation-key="common_delete">{t('common_delete')}</ParagraphBody>
        </MenuItem>
      </Menu>
      {/* ===================end brand list desktop====================== */}
      {/* ===================start brand list mobile====================== */}
      <Grid className={classes.mobileTable}>
        {project?.packs?.map(item => (
          <Grid key={item.id} className={classes.itemBrandMobile}>
            <Grid>
              <ParagraphExtraSmall $fontWeight={500} $colorName="--eerie-black" translation-key="project_brand">{t('project_brand')}: {item.brand}</ParagraphExtraSmall>
              <ParagraphExtraSmall $colorName="--eerie-black" translation-key="project_variant">{t('project_variant')}: {item.variant}</ParagraphExtraSmall>
              <ParagraphExtraSmall $colorName="--eerie-black" translation-key="project_manufacturer">{t('project_manufacturer')}: {item.manufacturer}</ParagraphExtraSmall>
            </Grid>
          </Grid>
        ))}
        {project?.additionalBrands?.map(item => (
          <Grid key={item.id} className={classes.itemBrandMobile}>
            <Grid>
              <ParagraphExtraSmall $fontWeight={500} $colorName="--eerie-black" translation-key="project_brand">{t('project_brand')}: {item.brand}</ParagraphExtraSmall>
              <ParagraphExtraSmall $colorName="--eerie-black" translation-key="project_variant">{t('project_variant')}: {item.variant}</ParagraphExtraSmall>
              <ParagraphExtraSmall $colorName="--eerie-black" translation-key="project_manufacturer">{t('project_manufacturer')}: {item.manufacturer}</ParagraphExtraSmall>
            </Grid>
            {editable && (
              <IconButton
                sx={{ p: 0 }}
                onClick={(e) => {
                  setAnchorElADBMobile(e.currentTarget)
                  setAdditionalBrandAction(item)
                }}
              >
                <MoreVert sx={{ fontSize: "24px" }} />
              </IconButton>
            )}
          </Grid>
        ))}
        {enableAdditionalBrand && (
          <Button
            sx={{ mt: 3, width: { xs: "100%", sm: "auto" } }}
            btnType={BtnType.Outlined}
            translation-key="setup_survey_add_brand_btn_add"
            children={<TextBtnSmall>{t('setup_survey_add_brand_btn_add')}</TextBtnSmall>}
            startIcon={<AddCircle sx={{ fontSize: "16px !important" }} />}
            onClick={() => setAddBrandMobile(true)}
          />
        )}
      </Grid>
      <Menu
        anchorEl={anchorElADBMobile}
        open={Boolean(anchorElADBMobile)}
        onClose={onCloseActionADB}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => onShowBrandEditMobile()}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ParagraphBody translation-key="common_edit">{t('common_edit')}</ParagraphBody>
        </MenuItem>
        <MenuItem onClick={() => onShowConfirmDeleteBrand()}>
          <ListItemIcon>
            <DeleteForeverIcon sx={{ color: "var(--red-error) !important" }} fontSize="small" />
          </ListItemIcon>
          <ParagraphBody translation-key="common_delete">{t('common_delete')}</ParagraphBody>
        </MenuItem>
      </Menu>
      {/* ===================end brand list mobile====================== */}

      <PopupAddOrEditBrand
        isAdd={addBrandMobile}
        itemEdit={brandEditMobile}
        onCancel={onClosePopupAddOrEditBrand}
        onSubmit={onAddOrEditBrandMobile}
      />
      <PopupConfirmDelete
        isOpen={!!brandDelete}
        title={t('setup_survey_add_brand_confirm_delete_title')}
        description={t('setup_survey_add_brand_confirm_delete_sub_title')}
        onCancel={() => onCloseConfirmDeleteBrand()}
        onDelete={onDeleteBrand}
      />
    </Grid >
  )
})

export default AdditionalBrandList