import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Grid, Dialog } from "@mui/material";
import { Project } from "models/project";
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading3 from "components/common/text/Heading3";
import ParagraphBody from "components/common/text/ParagraphBody"
import TextBtnSmall from "components/common/text/TextBtnSmall";
import Button, { BtnType } from "components/common/buttons/Button";
import ButtonCLose from "components/common/buttons/ButtonClose";
import classes from "./styles.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputTextfield from "components/common/inputs/InputTextfield";
import { useTranslation } from "react-i18next";
import { BrandAsset, brandAssetTypes, EBRAND_ASSET_TYPE } from "models/brand_asset";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import InputSelect from "components/common/inputs/InputSelect";
import InputTextareaAutosize from "components/InputTextareaAutosize";
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import { useDropzone } from "react-dropzone";
import { VideoService } from "services/video";
import { setErrorMess } from "redux/reducers/Status/actionTypes";
import { useDispatch } from "react-redux";
import useIsMountedRef from "hooks/useIsMountedRef";
import { OptionItem } from "models/general";
import { MusicNote, Error, Title } from "@mui/icons-material";
import IconImagesMode from "components/icons/IconImagesMode";
import { convertFileToBase64 } from "utils/file";
import ErrorMessage from "components/Inputs/components/ErrorMessage";
import clsx from "clsx";

const MAX_CHARACTER_OF_SLOGAN = 100;
const MAX_CHARACTER_OF_DESCRIPTION = 200;
const IMAGE_SIZE = 5 * 1000000; // bytes
const IMAGE_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];
const SOUND_FORMAT = ["audio/3gpp", "audio/aac", "audio/flac", "audio/mpeg", "audio/mp3", "audio/ogg", "audio/wav", "audio/webm"];
const SOUND_DURATION = 30;

interface BrandAssetForm {
  brand: string;
  description?: string;
  typeId: OptionItem;
  slogan?: string;
  asset?: string | File;
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
  onSubmit: (data: FormData) => void;
  brandAsset?: BrandAsset;
}

const PopupAddOrEditBrandAsset = (props: Props) => {
  const { isOpen, project, brandAsset, onClose, onSubmit } = props;

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch()
  
  const [imageReview, setImageReview] = useState<string>(null);
  const [soundReview, setSoundReview] = useState<string>(null);
  const [isError, setIsError] = useState<string>('');
  const isMountedRef = useIsMountedRef();

  const schema = useMemo(() => {
    return yup.object().shape({
      brand: yup.string().required(t("brand_track_field_brand_asset_name_vali_required")),
      description: yup.string(),
      typeId: yup.object().required(t("brand_track_field_brand_asset_type_vali_required")),
      slogan: yup.string().when("typeId", {
        is: (value: OptionItem) => value.id === EBRAND_ASSET_TYPE.SLOGAN,
        then: yup.string().required(t("brand_track_field_brand_asset_type_slogan_vali_require")),
        otherwise: yup.string().nullable()
      }),
      asset: yup.mixed().when("typeId", {
        is: (value: OptionItem) => value.id !== EBRAND_ASSET_TYPE.SLOGAN,
        then: yup.mixed().required(t("brand_track_field_brand_asset_vali_require")),
        otherwise: yup.mixed().nullable()
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    control,
    register,
    watch,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BrandAssetForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const watchBrandAssetTypeId = watch("typeId")
  const watchAsset = watch("asset")
  const watchDescription = watch("description")
  const watchSlogan = watch("slogan")

  const _onSubmit = async (data: BrandAssetForm) => {
    const form = new FormData()
    form.append('brand', data.brand)
    form.append('description', data?.description)
    form.append('typeId', data?.typeId?.id.toString())
    form.append('slogan', data?.typeId?.id === EBRAND_ASSET_TYPE.SLOGAN ? data?.slogan : "")
    if (data.asset && typeof data.asset === 'object') form.append('asset', data.asset)
    if (data?.typeId?.id === EBRAND_ASSET_TYPE.SOUND) {
      if(typeof data.asset === 'object') {
        const duration = await getDuration(data.asset as File)
        form.append('duration', Math.floor(duration).toString())
      } else {
        form.append('duration', brandAsset?.duration.toString())
      }
    }
    onSubmit(form)
  };

  const _onClose = () => {
    onClose()
  }
  
  useEffect(()=>{
    if(watchAsset) {
      if(watchBrandAssetTypeId?.id === EBRAND_ASSET_TYPE.IMAGE) {
        if (typeof watchAsset === "object") {
          convertFileToBase64(watchAsset).then((res) => {
            setImageReview(res as string)
          })
        } else {
          setImageReview(watchAsset as string)
        }
        clearErrors("asset")
      } else if(watchBrandAssetTypeId?.id === EBRAND_ASSET_TYPE.SOUND) {
        if (typeof watchAsset === "object") {
          setSoundReview(URL.createObjectURL(watchAsset))
        } else {
          setSoundReview(watchAsset as string)
        }
        clearErrors("asset")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchAsset])

  useEffect(() => {
    if(brandAsset) {
      reset({
        brand: brandAsset.brand,
        description: brandAsset.description,
        typeId: brandAssetTypes.filter(item => item?.id === brandAsset?.typeId)[0],
        slogan: brandAsset.slogan || "",
        asset: brandAsset.asset,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandAsset])

  useEffect(() => {
    if(imageReview || soundReview) {
      setValue('asset', null)
      setImageReview(null)
      setSoundReview(null)
      setIsError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchBrandAssetTypeId])

  const getDuration = async (file: File) => {
    const duration = await VideoService.getVideoDuration(file)
      .catch(err => {
        dispatch(setErrorMess(err))
        return 0
      })
    return duration
  }
  const handleDrop = useCallback(
    async (acceptedFiles) => {
      if(watchBrandAssetTypeId?.id === EBRAND_ASSET_TYPE.IMAGE) {
        let file = acceptedFiles[0] as File
        const checkSize = file.size < IMAGE_SIZE;
        const checkType = IMAGE_FORMATS.includes(file.type);
        if (!checkSize) {
          setIsError(t("brand_track_field_brand_asset_type_image_size_error"))
          setValue('asset', null)
          return
        }
        if (!checkType) {
          setIsError(t("brand_track_field_brand_asset_type_image_type_error"))
          setValue('asset', null)
          return
        }
        setValue('asset', file)
        setIsError('');
      } else {
        let file = acceptedFiles[0] as File
        const checkType = SOUND_FORMAT.includes(file.type);
        if (!checkType) {
          setIsError(t("brand_track_field_brand_asset_type_song_type_error"));
          setValue('asset', null)
          return
        }
        const duration = await getDuration(file)
        const isValidDuration = duration <= SOUND_DURATION
        if (!isValidDuration) {
          setIsError(t("brand_track_field_brand_asset_type_song_duration_error"));
          setValue('asset', null)
          return
        }
        setIsError('');
        setValue('asset', file)
        clearErrors("asset")
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMountedRef, watchBrandAssetTypeId]
  );
  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
  });

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={() => _onClose()}
      classes={{ paper: classes.paper }}
    >
      <form className={classes.form} onSubmit={handleSubmit(_onSubmit)}>
        <DialogTitle $backgroundColor="--white">
          {brandAsset ? (
            <Heading3 $colorName="--gray-90" translation-key="brand_track_setup_popup_edit_brand_asset">
              {t("brand_track_setup_popup_edit_brand_asset")}
            </Heading3>
          ) : (
            <Heading3 $colorName="--gray-90" translation-key="brand_track_setup_popup_add_brand_asset">
              {t("brand_track_setup_popup_add_brand_asset")}
            </Heading3>
          )}
          <ButtonCLose
            $backgroundColor="--eerie-black-5"
            $colorName="--eerie-black-40"
            onClick={() => _onClose()}>
          </ButtonCLose>
        </DialogTitle>
        <DialogContent dividers>
          <ParagraphBody $colorName="--eerie-black" $fontWeight={600} translation-key="brand_track_setup_popup_brand_asset_title">
            {t("brand_track_setup_popup_brand_asset_title")}
          </ParagraphBody>
          <ParagraphSmall $colorName="--eerie-black" mb={1} translation-key="brand_track_setup_popup_brand_asset_sub_title">
            {t("brand_track_setup_popup_brand_asset_sub_title")}
          </ParagraphSmall>
          <Grid container rowSpacing={3} columnSpacing={3}>
            <Grid item xs={12}>
              <ParagraphSmall $colorName="--gray-80" translation-key="brand_track_field_brand_asset_type">
                {t("brand_track_field_brand_asset_type")}
              </ParagraphSmall>
              <InputSelect
                translation-key="brand_track_field_brand_asset_type_placeholder"
                bindLabel="translation"
                className={classes.assetTypeSelect}
                fullWidth
                name="typeId"
                control={control}
                errorMessage={(errors.typeId as any)?.message}
                selectProps={{
                  options: brandAssetTypes,
                  placeholder: t("brand_track_field_brand_asset_type_placeholder")
                }}
              />
            </Grid>
            {/* ========image======= */}
            {watchBrandAssetTypeId?.id === EBRAND_ASSET_TYPE.IMAGE && (
              <Grid item xs={12} className={classes.assetContentWrapper}>
                <ParagraphBody $colorName="--eerie-black" $fontWeight={600} className={classes.assetContentTitle} translation-key="brand_track_field_brand_asset_type_image_title">
                  <IconImagesMode sx={{fontSize: "16px", color: "var(--gray-80)"}}/>
                  {t("brand_track_field_brand_asset_type_image_title")}
                </ParagraphBody>
                <ParagraphSmall $colorName="--eerie-black" translation-key="brand_track_field_brand_asset_type_image_sub_title">
                  {t("brand_track_field_brand_asset_type_image_sub_title")}
                </ParagraphSmall>
                <input {...getInputProps()} />
                {imageReview && !isError && (
                  <img src={imageReview} className={classes.imgPreview} alt="preview" />
                )}
                <Grid className={classes.btnUploadWrapper}>
                  <Button
                    btnType={BtnType.Outlined}
                    children={<TextBtnSmall sx={{display: "flex", alignItems: "center", gap: "8px"}} translation-key="common_upload_asset"><BackupOutlinedIcon sx={{ color: 'var(--cimigo-blue-light-1)' }} />{imageReview ? t("common_change_asset") : t("common_upload_asset")}</TextBtnSmall>}
                    className={classes.btnSave}
                    {...getRootProps()}
                  />
                  <ParagraphSmall $colorName="--cimigo-theme-light-on-surface" translation-key="brand_track_field_brand_asset_type_image_condition">
                    {t("brand_track_field_brand_asset_type_image_condition")}
                  </ParagraphSmall>
                </Grid>
                {isError && (
                  <ParagraphSmall mt={1} $colorName="--red-error" sx={{display: "flex", alignItems: "center", gap: "8px"}}><Error sx={{fontSize: "20px"}}/>{isError}</ParagraphSmall>
                )}
                {errors.asset?.message && <ErrorMessage>{errors.asset?.message}</ErrorMessage>}
              </Grid>
            )}
            {/* ========slogan======= */}
            {watchBrandAssetTypeId?.id === EBRAND_ASSET_TYPE.SLOGAN && (
              <Grid item xs={12} className={classes.assetContentWrapper}>
                <ParagraphBody $colorName="--eerie-black" $fontWeight={600} className={classes.assetContentTitle} translation-key="brand_track_field_brand_asset_type_slogan_title">
                  <Title sx={{fontSize: "20px", color: "var(--gray-80)"}}/>
                  {t("brand_track_field_brand_asset_type_slogan_title")}
                </ParagraphBody>
                <ParagraphSmall $colorName="--eerie-black" translation-key="brand_track_field_brand_asset_type_slogan_sub_title">
                  {t("brand_track_field_brand_asset_type_slogan_sub_title")} 
                </ParagraphSmall>
                <InputTextareaAutosize
                  translation-key="brand_track_field_brand_asset_type_slogan_placeholder"
                  className={clsx(classes.inputField, classes.inputTextarea)}
                  id="slogan"
                  name="slogan"
                  placeholder={t("brand_track_field_brand_asset_type_slogan_placeholder")}
                  autoComplete="off"
                  inputRef={register("slogan")}
                  errorMessage={errors.slogan?.message}
                  maxLength={MAX_CHARACTER_OF_SLOGAN}
                />
                <ParagraphSmall sx={{textAlign: "end", mt: "-15px"}}>{watchSlogan?.length}/{MAX_CHARACTER_OF_SLOGAN}</ParagraphSmall>
              </Grid>
            )}
            {/* ========song========= */}
            {watchBrandAssetTypeId?.id === EBRAND_ASSET_TYPE.SOUND && (
              <Grid item xs={12} className={classes.assetContentWrapper}>
                <ParagraphBody $colorName="--eerie-black" $fontWeight={600} className={classes.assetContentTitle} translation-key="brand_track_field_brand_asset_type_song_title">
                  <MusicNote sx={{fontSize: "19px", color: "var(--gray-80)"}}/>
                  {t("brand_track_field_brand_asset_type_song_title")}
                </ParagraphBody>
                <ParagraphSmall $colorName="--eerie-black" translation-key="brand_track_field_brand_asset_type_song_sub_title">
                  {t("brand_track_field_brand_asset_type_song_sub_title")}
                </ParagraphSmall>
                <input {...getInputProps()} />
                {soundReview && !isError && (
                  <audio controls>
                    <source src={soundReview} />
                  </audio>
                )}
                <Grid className={classes.btnUploadWrapper}>
                  <Button
                    btnType={BtnType.Outlined}
                    children={<TextBtnSmall sx={{display: "flex", alignItems: "center", gap: "8px"}} translation-key="common_upload_asset"><BackupOutlinedIcon sx={{ color: 'var(--cimigo-blue-light-1)' }} />{soundReview ? t("common_change_asset") : t("common_upload_asset")}</TextBtnSmall>}
                    className={classes.btnSave}
                    {...getRootProps()}
                  />
                  <ParagraphSmall $colorName="--cimigo-theme-light-on-surface" translation-key="brand_track_field_brand_asset_type_song_condition">
                    {t("brand_track_field_brand_asset_type_song_condition")}
                  </ParagraphSmall>
                </Grid>
                {isError && (
                  <ParagraphSmall mt={1} $colorName="--red-error" sx={{display: "flex", alignItems: "center", gap: "8px"}}><Error sx={{fontSize: "20px"}}/>{isError}</ParagraphSmall>
                )}
                {errors.asset?.message && <ErrorMessage>{errors.asset?.message}</ErrorMessage>}
              </Grid>
            )}
            <Grid item xs={12}>
              <ParagraphBody $colorName="--eerie-black" $fontWeight={600} translation-key="brand_track_field_brand_asset_name_title">
                {t("brand_track_field_brand_asset_name_title")}
              </ParagraphBody>
              <ParagraphSmall $colorName="--eerie-black" mb={1} translation-key="brand_track_field_brand_asset_name_sub_title">
                {t("brand_track_field_brand_asset_name_sub_title")}
              </ParagraphSmall>
              <InputTextfield
                translation-key="brand_track_field_brand_asset_name_placeholder"
                className={classes.inputField}
                placeholder={t("brand_track_field_brand_asset_name_placeholder")}
                type="text"
                autoComplete="off"
                inputRef={register("brand")}
                errorMessage={errors.brand?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <ParagraphBody $colorName="--eerie-black" $fontWeight={600} translation-key="brand_track_field_brand_asset_description_sub_title">
                {t("brand_track_field_brand_asset_description_title")}
              </ParagraphBody>
              <ParagraphSmall $colorName="--eerie-black" mb={1} translation-key="brand_track_field_brand_asset_description_sub_title">
                {t("brand_track_field_brand_asset_description_sub_title")}
              </ParagraphSmall>
              <InputTextareaAutosize
                translation-key="brand_track_field_brand_asset_description_placeholder"
                className={clsx(classes.inputField, classes.inputTextarea)}
                id="description"
                name="description"
                placeholder={t("brand_track_field_brand_asset_description_placeholder")}
                autoComplete="off"
                inputRef={register("description")}
                errorMessage={errors.description?.message}
                maxLength={MAX_CHARACTER_OF_DESCRIPTION}
              />
              <ParagraphSmall sx={{textAlign: "end", mt: "-15px"}}>{watchDescription?.length}/{MAX_CHARACTER_OF_DESCRIPTION}</ParagraphSmall>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.footer}>
          <Button
            btnType={BtnType.Secondary}
            translation-key="common_cancel"
            children={<TextBtnSmall>{t("common_cancel")}</TextBtnSmall>}
            onClick={onClose}
          />
          <Button
            btnType={BtnType.Raised}
            type="submit"
            translation-key="common_save"
            children={<TextBtnSmall>{t("common_save")}</TextBtnSmall>}
            className={classes.btnSave}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PopupAddOrEditBrandAsset;
