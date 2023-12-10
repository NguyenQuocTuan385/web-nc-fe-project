import { Grid } from "@mui/material"
import clsx from "clsx";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import NoteWarning from "components/common/warnings/NoteWarning";
import HeartPlus from "components/icons/IconHeartPlus";
import PopupConfirmDeleteCommon from "components/PopupConfirmDeleteCommon";
import ProjectHelper, { editableProject } from "helpers/project";
import { BrandAsset } from "models/brand_asset";
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { MaxChip } from "pages/SurveyNew/components";
import BrandAssetItem from "pages/SurveyNew/components/BrandAssetItem";
import PopupAddOrEditBrandAsset from "pages/SurveyNew/components/PopupAddOrEditBrandAsset";
import { memo, useMemo, useState } from "react"
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getBrandAssetsRequest } from "redux/reducers/Project/actionTypes";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { BrandAssetService } from "services/brand_asset";
import classes from "./styles.module.scss"

interface BrandAssetRecognitionProps {
  project: Project;
}

const BrandAssetRecognition = memo(({ project }: BrandAssetRecognitionProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  
  const editable = useMemo(() => editableProject(project), [project])
  const maxBrandAssetRecognition = useMemo(() => ProjectHelper.maxBrandAssetRecognition(project) || 0, [project])
  const minBrandAssetRecognition = useMemo(() => ProjectHelper.minBrandAssetRecognition(project) || 0, [project])
  const brandAssetRecognitionNeedMore = useMemo(() => ProjectHelper.brandAssetRecognitionNeedMore(project) || 0, [project])
  
  const [openPopupAddOrEdit, setOpenPopupAddOrEdit] = useState<boolean>(false)
  const [openPopupConfirmDelete, setOpenPopupConfirmDelete] = useState<boolean>(false)
  const [brandAssetEdit, setBrandAssetEdit] = useState<BrandAsset>(null)
  const [brandAssetDelete, setBrandAssetDelete] = useState<BrandAsset>(null)

  const onOpenPopupAddOrEdit = () => {
    setOpenPopupAddOrEdit(true)
  }
  const onClosePopupAddOrEdit = () => {
    setBrandAssetEdit(null)
    setOpenPopupAddOrEdit(false)
  }
  const handleAddOrEdit = (data: FormData) => {
    data.append('projectId', `${project.id}`)
    if (brandAssetEdit) {
      dispatch(setLoading(true))
      BrandAssetService.update(brandAssetEdit.id, data)
        .then(() => {
          dispatch(getBrandAssetsRequest(project.id))
          onClosePopupAddOrEdit()
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      BrandAssetService.create(data)
        .then(() => {
          dispatch(getBrandAssetsRequest(project.id))
          onClosePopupAddOrEdit()
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const handleDelete = () => {
    if(brandAssetDelete) {
      BrandAssetService.delete(brandAssetDelete?.id)
        .then(() => {
          dispatch(getBrandAssetsRequest(project.id))
          onClosePopupConfirmDelete()
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }
  const onOpenPopupConfirmDelete = (brandAsset) => {
    setBrandAssetDelete(brandAsset)
    setOpenPopupConfirmDelete(true)
  }
  const onClosePopupConfirmDelete = () => {
    setBrandAssetDelete(null)
    setOpenPopupConfirmDelete(false)
  }
  return (
    <>
      <Grid id={SETUP_SURVEY_SECTION.brand_asset_recognition} mt={4}>
        {!!minBrandAssetRecognition ? (
          <Heading4
            $fontSizeMobile={"16px"}
            $colorName="--eerie-black"
            sx={{ display: "inline-block", verticalAlign: "middle" }}
            translation-key="brand_track_setup_brand_asset_recognition_title"
          >
            {t("brand_track_setup_brand_asset_recognition_title", {step: 4})}
          </Heading4>
          ) : (
          <Heading4
            $fontSizeMobile={"16px"}
            $colorName="--eerie-black"
            sx={{ display: "inline-block", verticalAlign: "middle" }}
            translation-key="brand_track_setup_brand_asset_recognition_title_optional"
          >
            {t("brand_track_setup_brand_asset_recognition_title_optional", {step: 4})}
          </Heading4>
        )}
        <MaxChip
          sx={{ ml: 1 }}
          label={<ParagraphSmall $colorName="--eerie-black">{t('common_max')} {maxBrandAssetRecognition}</ParagraphSmall>}
        />
        <ParagraphBody $colorName="--eerie-black" mb={ 3 } mt={ 1 } translation-key="brand_track_setup_brand_asset_recognition_sub_title_1" 
          dangerouslySetInnerHTML={{
            __html: t("brand_track_setup_brand_asset_recognition_sub_title_1"),
        }} 
        />
        <ParagraphBody $colorName="--eerie-black" translation-key="brand_track_setup_brand_asset_recognition_sub_title_2"
          dangerouslySetInnerHTML={{
              __html: t("brand_track_setup_brand_asset_recognition_sub_title_2"),
          }} 
        />
        {!!brandAssetRecognitionNeedMore && (
            <NoteWarning>
              <ParagraphSmall $colorName="--warning-dark" translation-key="brand_track_setup_brand_asset_recognition_need_more">{t("brand_track_setup_brand_asset_recognition_need_more", {number: brandAssetRecognitionNeedMore})}</ParagraphSmall>
            </NoteWarning>
          )}
        <Grid className={clsx({[classes.brandAssetsWrapper]: project?.brandAssets?.length > 0})}>
          {project?.brandAssets?.map(assetItem => (
            <BrandAssetItem 
              key={assetItem?.id}
              brandAsset={assetItem}
              editable={editable}
              onPopupEditBrandAsset={() => {
                setBrandAssetEdit(assetItem)
                onOpenPopupAddOrEdit()
              }}
              onOpenPopupConfirmDelete={() => onOpenPopupConfirmDelete(assetItem)}
            />
          ))}
        </Grid>
        <Button
          disabled={!editable || project?.brandAssets?.length >= maxBrandAssetRecognition}
          disableRipple
          className={classes.btnAddBrand}
          btnType={BtnType.Outlined}
          children={<TextBtnSmall translation-key="brand_track_setup_brand_asset_recognition_btn_add">{t("brand_track_setup_brand_asset_recognition_btn_add")}</TextBtnSmall>}
          startIcon={<HeartPlus sx={{ fontSize: "14px !important" }} />}
          onClick={onOpenPopupAddOrEdit}
          sx={{  width: { xs: "100%", sm: "auto" } }}
        />
        {project?.brandAssets?.length >= maxBrandAssetRecognition && (
            <ParagraphSmall $colorName="--gray-60" sx={{mt: 1}} translation-key="brand_track_setup_brand_asset_recognition_reach_limit">
              {t("brand_track_setup_brand_asset_recognition_reach_limit", {number: maxBrandAssetRecognition})}
            </ParagraphSmall>
          )}
      </Grid>
      {openPopupAddOrEdit && (
        <PopupAddOrEditBrandAsset
          isOpen={true}
          onClose={onClosePopupAddOrEdit}
          project={project}
          onSubmit={handleAddOrEdit}
          brandAsset={brandAssetEdit}
        />
      )}
      <PopupConfirmDeleteCommon
        isOpen={openPopupConfirmDelete}
        title={t("brand_track_setup_popup_delete_title")}
        description={t("brand_track_setup_popup_delete_description")}
        cancelText={t("brand_track_setup_popup_delete_btn_cancel")}
        deleteText={t("brand_track_setup_popup_delete_btn_delete")}
        onCancel={onClosePopupConfirmDelete}
        onDelete={handleDelete}
      />
    </>
  )
})

export default BrandAssetRecognition