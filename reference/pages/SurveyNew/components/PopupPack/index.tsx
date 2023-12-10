import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Dialog, Grid, IconButton } from '@mui/material';
import classes from './styles.module.scss';
import { useDropzone } from 'react-dropzone';
import Images from "config/images";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from 'react-hook-form';
import { OptionItem } from 'models/general';
import { Pack, PackPosition, PackType, packTypes } from 'models/pack';
import ErrorMessage from 'components/Inputs/components/ErrorMessage';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { fData } from 'utils/formatNumber';
import { CameraAlt } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import {DialogTitle} from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading3 from "components/common/text/Heading3";
import Heading5 from "components/common/text/Heading5";
import ButtonClose from "components/common/buttons/ButtonClose";
import Button, {BtnType} from "components/common/buttons/Button";
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import InputTextfield from "components/common/inputs/InputTextfield";
import InputSelect from "components/common/inputs/InputSelect";

const PHOTO_SIZE = 10 * 1000000; // bytes
const FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];


export interface PackFormData {
  image: string | File;
  name: string;
  packTypeId: OptionItem;
  brand: string;
  manufacturer: string;
  variant: string,
}

interface Props {
  isOpen: boolean,
  itemEdit?: Pack,
  positionId?: PackPosition,
  onCancel: () => void,
  onSubmit: (data: FormData) => void,
}


const PopupPack = memo((props: Props) => {
  const { onCancel, onSubmit, isOpen, itemEdit, positionId = PackPosition.Normal } = props;
  const { t, i18n } = useTranslation()

  const schema = useMemo(() => {
    return yup.object().shape({
      image: yup.mixed().required(t('setup_survey_packs_popup_image_required')),
      name: yup.string().required(t('setup_survey_packs_popup_pack_name_required')),
      packTypeId: positionId === PackPosition.Eye_Tracking ? yup.mixed().notRequired() : yup.object().shape({
        id: yup.number().required(t('setup_survey_packs_popup_pack_type_required')),
        name: yup.string().required()
      }).required(t('setup_survey_packs_popup_pack_type_required')).nullable(),
      brand: positionId === PackPosition.Eye_Tracking ? yup.string().notRequired() : yup.string().required(t('setup_survey_packs_popup_pack_brand_required')),
      manufacturer: positionId === PackPosition.Eye_Tracking ? yup.string().notRequired() : yup.string().required(t('setup_survey_packs_popup_pack_manufacturer_required')),
      variant: positionId === PackPosition.Eye_Tracking ? yup.string().notRequired() : yup.string().required(t('setup_survey_packs_popup_pack_variant_required')),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, positionId])

  const isMountedRef = useIsMountedRef();
  const [fileReview, setFileReview] = useState<string>('');

  const { register, handleSubmit, formState: { errors }, reset, control, setError, setValue, watch, clearErrors } = useForm<PackFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const isEyeTracking = useMemo(() => positionId === PackPosition.Eye_Tracking, [positionId])

  const _onSubmit = (data: PackFormData) => {
    const form = new FormData()
    form.append('positionId', `${positionId}`)
    form.append('name', data.name)
    form.append('brand', data.brand)
    form.append('manufacturer', data.manufacturer)
    form.append('variant', data.variant)
    if (positionId === PackPosition.Eye_Tracking) {
      form.append('packTypeId', `${PackType.Competitor_Pack}`)
    } else {
      form.append('packTypeId', `${data.packTypeId.id}`)
    }
    if (data.image && typeof data.image === 'object') form.append('image', data.image)
    onSubmit(form)
  }

  useEffect(() => {
    if (!isOpen && !itemEdit) reset({
      image: undefined,
      name: '',
      packTypeId: null,
      brand: '',
      manufacturer: '',
      variant: ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, itemEdit])

  const image = watch('image')

  useEffect(() => {
    if (image) {
      if (typeof image === "object") {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => setFileReview(reader.result as string);
      } else {
        setFileReview(image as string)
      }
      clearErrors("image")
    } else setFileReview('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  useEffect(() => {
    if (itemEdit) {
      reset({
        image: itemEdit.image,
        name: itemEdit.name,
        packTypeId: itemEdit.packType || null,
        brand: itemEdit.brand,
        manufacturer: itemEdit.manufacturer,
        variant: itemEdit.variant,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemEdit])

  const isValidSize = async (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        const image = new Image();
        image.src = e.target.result as string;
        image.onload = function () {
          const height = image.height;
          const width = image.width;
          resolve(height >= 200 && width >= 200)
        };
        image.onerror = function () {
          resolve(false)
        }
      }
      reader.onerror = function () {
        resolve(false)
      }
    })
  }

  const handleDrop = useCallback(async (acceptedFiles) => {
    let file = acceptedFiles[0];
    const checkSize = file.size < PHOTO_SIZE;
    const checkType = FILE_FORMATS.includes(file.type);
    const validSize = await isValidSize(file)
    if (!validSize) {
      setError('image', { message: t('setup_survey_packs_popup_image_size') })
      return
    }
    if (!checkSize) {
      setError('image', { message: t('setup_survey_packs_popup_image_file_size', { size: fData(PHOTO_SIZE) }) })
      return
    }
    if (!checkType) {
      setError('image', { message: t('setup_survey_packs_popup_image_type') })
      return
    }
    setValue('image', file)
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMountedRef]
  );

  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
  });

  const getPopupTitle = () => {
    switch (positionId) {
      case PackPosition.Normal:
        if (!itemEdit) return <Heading3 translation-key="setup_survey_packs_popup_add_title">{t('setup_survey_packs_popup_add_title')}</Heading3>
        return <Heading3 translation-key="setup_survey_packs_popup_edit_title">{t('setup_survey_packs_popup_edit_title')}</Heading3>
      case PackPosition.Eye_Tracking:
        if (!itemEdit) return <Heading3 translation-key="setup_survey_packs_popup_add_competitor_title">{t("setup_survey_packs_popup_add_competitor_title")}</Heading3>
        return <Heading3 translation-key="setup_survey_packs_popup_edit_competitor_title">{t("setup_survey_packs_popup_edit_competitor_title")}</Heading3>
    }
  }

  const getPopupSubTitle = () => {
    switch (positionId) {
      case PackPosition.Normal:
        if (!itemEdit) return <ParagraphSmall $colorName="--eerie-black" translation-key="setup_survey_packs_popup_add_sub_title">{t('setup_survey_packs_popup_add_sub_title')}</ParagraphSmall>
        return <ParagraphSmall $colorName="--eerie-black" translation-key="setup_survey_packs_popup_edit_sub_title">{t('setup_survey_packs_popup_edit_sub_title')}</ParagraphSmall>
      case PackPosition.Eye_Tracking:
        if (!itemEdit) return <ParagraphSmall $colorName="--eerie-black" translation-key="setup_survey_packs_popup_add_competitor_subtitle" 
        dangerouslySetInnerHTML={{ __html: t("setup_survey_packs_popup_add_competitor_subtitle")}}></ParagraphSmall>
        return <ParagraphSmall $colorName="--eerie-black" translation-key="setup_survey_packs_popup_edit_competitor_subtitle"
        dangerouslySetInnerHTML={{ __html: t("setup_survey_packs_popup_edit_competitor_subtitle")}}></ParagraphSmall>
    }
  }

  return (
    <Dialog
      scroll="paper"
      open={isOpen || !!itemEdit}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <form autoComplete="off" className={classes.form} noValidate onSubmit={handleSubmit(_onSubmit)}>
        <DialogTitle className={classes.header}>
          {getPopupTitle()}
          <ButtonClose  onClick={onCancel}>
          </ButtonClose>
        </DialogTitle>
        <DialogContent className={classes.body} dividers>
          {getPopupSubTitle()}
          <Grid className={classes.spacing}>
            <Grid>
              <Grid
                className={classes.imgUp}
                style={{
                  border: fileReview ? '1px solid rgba(28, 28, 28, 0.2)' : '1px dashed rgba(28, 28, 28, 0.2)',
                  minHeight: fileReview ? 200 : 'unset'
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {fileReview ? (
                  <>
                    <img src={fileReview} className={classes.imgPreview} alt="preview" />
                    <IconButton aria-label="upload" className={classes.btnUpload}>
                      <CameraAlt />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <img className={classes.imgAddPhoto} src={Images.icAddPhoto} alt="ic-add" />
                    <ParagraphSmall $colorName="--cimigo-blue" className={classes.selectImgTitle} translation-key="setup_survey_packs_popup_select_image">{t('setup_survey_packs_popup_select_image')}</ParagraphSmall>
                  </>
                )}
              </Grid>
            </Grid>
            <Grid>
            <Heading5 className={classes.textTitle} translation-key="setup_survey_packs_popup_image_instruction">{t('setup_survey_packs_popup_image_instruction')}:</Heading5>
              <div className={classes.textInfo}>
               <ParagraphSmall $colorName="--eerie-black" translation-key="setup_survey_packs_popup_image_instruction_1" dangerouslySetInnerHTML={{ __html: t('setup_survey_packs_popup_image_instruction_1') }}></ParagraphSmall>
              </div>
              <div className={classes.textInfo}>
                <ParagraphSmall $colorName="--eerie-black" translation-key="setup_survey_packs_popup_image_instruction_2" dangerouslySetInnerHTML={{ __html: t('setup_survey_packs_popup_image_instruction_2') }}></ParagraphSmall>
              </div>
              <div className={classes.textInfo}>
                <ParagraphSmall $colorName="--eerie-black" translation-key="setup_survey_packs_popup_image_instruction_3" dangerouslySetInnerHTML={{ __html: t('setup_survey_packs_popup_image_instruction_3') }}></ParagraphSmall>
              </div>
              <div className={classes.textInfo}>
                <ParagraphSmall $colorName="--eerie-black" translation-key="setup_survey_packs_popup_image_instruction_4" dangerouslySetInnerHTML={{ __html: t('setup_survey_packs_popup_image_instruction_4') }}></ParagraphSmall>
              </div>
              <Grid container className={classes.input} spacing={1}>
                <Grid item xs={isEyeTracking ? 12 : 6}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => <InputTextfield
                      title={t('setup_survey_packs_popup_pack_name')}
                      translation-key="setup_survey_packs_popup_pack_name"
                      placeholder={isEyeTracking ? t('setup_survey_packs_popup_competitor_pack_name_placeholder') : t('setup_survey_packs_popup_pack_name_placeholder')}
                      translation-key-placeholder={isEyeTracking ? "setup_survey_packs_popup_competitor_pack_name_placeholder" : "setup_survey_packs_popup_pack_name_placeholder"}
                      infor={isEyeTracking ? '' : t('setup_survey_packs_popup_pack_name_info')}
                      translation-key-infor={isEyeTracking ? '' : "setup_survey_packs_popup_pack_name_info"}
                      errorMessage={errors.name?.message}
                      name={field.name}
                      value={field.value || ''}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                    />}
                  />
                </Grid>
                {!isEyeTracking && (
                  <Grid item xs={6}>
                    <InputSelect
                      title={t('setup_survey_packs_popup_pack_type')}
                      name="packTypeId"
                      control={control}
                      bindLabel="translation"
                      selectProps={{
                        options: packTypes,
                        menuPosition: "fixed",
                        placeholder: t('setup_survey_packs_popup_pack_type_placeholder')
                      }}
                      errorMessage={(errors.packTypeId as any)?.message || errors.packTypeId?.id?.message}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
          {errors.image?.message && <ErrorMessage>{errors.image?.message}</ErrorMessage>}
          <Grid className={classes.inputMobile} container rowSpacing={3} columnSpacing={2}>
            <Grid item xs={12} sm={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <InputTextfield
                  title={t('setup_survey_packs_popup_pack_name')}
                  translation-key="setup_survey_packs_popup_pack_name"
                  placeholder={t('setup_survey_packs_popup_pack_name_placeholder')}
                  translation-key-placeholder="setup_survey_packs_popup_pack_name_placeholder"
                  infor={t('setup_survey_packs_popup_pack_name_info')}
                  translation-key-infor="setup_survey_packs_popup_pack_name_info"
                  errorMessage={errors.name?.message}
                  name={field.name}
                  value={field.value || ''}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                />}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              {!isEyeTracking && (
                <InputSelect
                  title={t('setup_survey_packs_popup_pack_type')}
                  name="packTypeId"
                  control={control}
                  selectProps={{
                    options: packTypes,
                    menuPosition: "fixed",
                    placeholder: t('setup_survey_packs_popup_pack_type_placeholder')
                  }}
                  errorMessage={(errors.packTypeId as any)?.message || errors.packTypeId?.id?.message}
                />
              )}
            </Grid>
          </Grid>
          <Grid className={classes.flex}>
            <Heading5 variantMapping={{body2: 'span'}} variant="body2" sx={{display: 'flex'}} translation-key="setup_survey_packs_popup_brand_related_title">{t('setup_survey_packs_popup_brand_related_title')} {isEyeTracking && <Heading5 variantMapping={{body2: 'span'}} variant="body2" $colorName="--cimigo-green-dark" translation-key="common_optional">&nbsp;({t("common_optional")})</Heading5>}</Heading5>
            <ParagraphSmall $colorName="--eerie-black" translation-key="setup_survey_packs_popup_brand_related_sub_title">{t('setup_survey_packs_popup_brand_related_sub_title')}</ParagraphSmall>
            <Grid container spacing={2}>
              <Grid item>
                <InputTextfield
                  title={t('setup_survey_packs_popup_pack_brand')}
                  translation-key="setup_survey_packs_popup_pack_brand"
                  name='brand'
                  placeholder={t('setup_survey_packs_popup_pack_brand_placeholder')}
                  translation-key-placeholder="setup_survey_packs_popup_pack_brand_placeholder"
                  inputRef={register('brand')}
                  errorMessage={errors.brand?.message}
                />
              </Grid>
              <Grid item>
                <InputTextfield
                  title={t('setup_survey_packs_popup_pack_variant')}
                  translation-key="setup_survey_packs_popup_pack_variant"
                  name='variant'
                  placeholder={t('setup_survey_packs_popup_pack_variant_placeholder')}
                  translation-key-placeholder="setup_survey_packs_popup_pack_variant_placeholder"
                  inputRef={register('variant')}
                  errorMessage={errors.variant?.message}
                />
              </Grid>
              <Grid item>
                <InputTextfield
                  title={t('setup_survey_packs_popup_pack_manufacturer')}
                  translation-key="setup_survey_packs_popup_pack_manufacturer"
                  name='manufacturer'
                  placeholder={t('setup_survey_packs_popup_pack_manufacturer_placeholder')}
                  translation-key-placeholder="setup_survey_packs_popup_pack_manufacturer_placeholder"
                  inputRef={register('manufacturer')}
                  errorMessage={errors.manufacturer?.message}
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.btn}>
        <Button btnType={BtnType.Secondary} onClick={onCancel} translation-key="common_cancel">{t('common_cancel')}</Button>
        <Button
            type="submit"
            children={!itemEdit ? t('setup_survey_packs_popup_add_btn') : t('setup_survey_packs_popup_edit_btn')}
            translation-key={!itemEdit ? "setup_survey_packs_popup_add_btn" : "setup_survey_packs_popup_edit_btn"}
            btnType={BtnType.Raised}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
});
export default PopupPack;



