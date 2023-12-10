import { useEffect, useMemo } from "react";
import {
  Grid,
  Box,
  RadioGroup, Radio,
  FormControlLabel
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./styles.module.scss";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import Button, { BtnType } from "components/common/buttons/Button"
import Heading4 from "components/common/text/Heading4";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import Heading5 from "components/common/text/Heading5";
import InputTextfield from "components/common/inputs/InputTextfield";
import BasicTooltip from "components/common/tooltip/BasicTooltip";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Heading6 from "components/common/text/Heading6";
import { EVIDEO_MARKETING_STAGE } from "models/general";
import { EVIDEO_TYPE, INFORMATION_STEP, VIDEO_UPLOAD_STEP, VIDEO_YOUTUBE_STEP } from "models/video";

const CHARACTER_LIMIT = 200;

export interface InformationForm {
  name: string;
  brand: string;
  product: string;
  keyMessage: string;
  marketingStageId: number;
}

const defaultValues: Partial<InformationForm> = {
  name: '',
  brand: '',
  product: '',
  keyMessage: '',
  marketingStageId: EVIDEO_MARKETING_STAGE.PRE_LAUNCH,
}

interface Props {
  type: EVIDEO_TYPE,
  videoFromDevice?: VIDEO_UPLOAD_STEP,
  videoFromYoutube?: VIDEO_YOUTUBE_STEP,
  data?: INFORMATION_STEP,
  onSubmit: (data: INFORMATION_STEP) => void;
}

const Information = ({ type, videoFromDevice, videoFromYoutube, data, onSubmit }: Props) => {
  const { t, i18n } = useTranslation();

  const schema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required(t("setup_video_choice_popup_video_information_video_name_validate")),
      brand: yup.string().required(t("setup_video_choice_popup_video_information_brand_name_validate")),
      product: yup.string().required(t("setup_video_choice_popup_video_information_product_name_validate")),
      keyMessage: yup.string().required(t("setup_video_choice_popup_video_information_key_message_validate")),
      marketingStageId: yup.number(),
    })
  }, [i18n.language]);

  const {
    reset,
    control,
    formState: { errors },
    handleSubmit,
    register,
    watch
  } = useForm<InformationForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const keyMessage = watch('keyMessage')

  const onClear = () => {
    reset({ ...defaultValues })
  }

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        brand: data.brand,
        product: data.product,
        keyMessage: data.keyMessage,
        marketingStageId: data.marketingStageId,
      })
    }
  }, [data, reset])

  const _onSubmit = (data: InformationForm) => {
    onSubmit(data)
    onClear()
  }

  return (
    <>
      <Grid component="form" onSubmit={handleSubmit(_onSubmit)} className={classes.form}>
        <Grid className={classes.root}>
          <Grid className={classes.containerInformation}>
            <Box sx={{ mb: 3 }}>
              <Heading4 $colorName="--eerie-black" translation-key="setup_video_choice_popup_video_information_title">{t("setup_video_choice_popup_video_information_title")}</Heading4>
              <ParagraphSmall $colorName="--gray-80" translation-key="setup_video_choice_popup_video_information_sub_title">{t("setup_video_choice_popup_video_information_sub_title")}</ParagraphSmall>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Heading5 $colorName="--eerie-black" translation-key="setup_video_choice_popup_video_information_video_name">{t("setup_video_choice_popup_video_information_video_name")}</Heading5>
              <ParagraphSmall $colorName="--gray-80" sx={{ mb: 1 }} translation-key="setup_video_choice_popup_video_information_video_name_sub">{t("setup_video_choice_popup_video_information_video_name_sub")}</ParagraphSmall>
              <InputTextfield
                translation-key-placeholder="setup_video_choice_popup_video_information_video_name_placeholder"
                placeholder={t("setup_video_choice_popup_video_information_video_name_placeholder")}
                type="text"
                autoFocus
                autoComplete="off"
                inputRef={register("name")}
                errorMessage={errors.name?.message}
              />
            </Box>
            <Box>
              <Box className={classes.boxMarketingStage}>
                <Heading5 $colorName="--eerie-black" translation-key="setup_video_choice_popup_video_information_marketing_stage">{t("setup_video_choice_popup_video_information_marketing_stage")}</Heading5>
                <BasicTooltip arrow title={
                  <div>
                    <Heading6 translation-key="setup_video_choice_popup_video_information_question_marketing_stage">{t("setup_video_choice_popup_video_information_question_marketing_stage")}</Heading6>
                    <ParagraphExtraSmall translation-key="setup_video_choice_popup_video_information_question_marketing_stage_sub">{t("setup_video_choice_popup_video_information_question_marketing_stage_sub")}</ParagraphExtraSmall>
                  </div>
                }>
                  <HelpOutlineIcon sx={{ ml: 1, fontSize: "16px", color: "var(--gray-40)" }}></HelpOutlineIcon>
                </BasicTooltip>
              </Box>
              <ParagraphSmall $colorName="--gray-80" translation-key="setup_video_choice_popup_video_information_question_launch">{t("setup_video_choice_popup_video_information_question_launch")}</ParagraphSmall>
              <Box sx={{ mt: 1 }}>
                <Controller
                  name="marketingStageId"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      classes={{ root: classes.radioGroup }}
                    >
                      <FormControlLabel
                        className={classes.boxRadio}
                        control={
                          <Radio
                            value={EVIDEO_MARKETING_STAGE.POST_LAUNCH}
                            classes={{
                              root: classes.rootRadio,
                              checked: classes.checkRadio,
                            }}
                          />
                        }
                        label={<ParagraphSmall $colorName="--eerie-black" translation-key="setup_video_choice_popup_video_information_post_launch">{t("setup_video_choice_popup_video_information_post_launch")}</ParagraphSmall>}
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            value={EVIDEO_MARKETING_STAGE.PRE_LAUNCH}
                            classes={{
                              root: classes.rootRadio,
                              checked: classes.checkRadio,
                            }}
                          />
                        }
                        label={<ParagraphSmall $colorName="--eerie-black" translation-key="setup_video_choice_popup_video_information_pre_launch">{t("setup_video_choice_popup_video_information_pre_launch")}</ParagraphSmall>}
                      />
                    </RadioGroup>
                  )}
                />
              </Box>
              <Box sx={{ mt: 3 }}>
                <Heading5 $colorName="--eerie-black" translation-key="setup_video_choice_popup_video_information_brand_related">{t("setup_video_choice_popup_video_information_brand_related")}</Heading5>
                <ParagraphSmall $colorName="--eerie-black" translation-key="setup_video_choice_popup_video_information_brand_related_sub">{t("setup_video_choice_popup_video_information_brand_related_sub")}</ParagraphSmall>
                <Grid container columnSpacing={{ xs: 0, sm: 2 }} rowSpacing={2} className={classes.containerInput}>
                  <Grid item xs={12} sm={6}>
                    <InputTextfield
                      translation-key="setup_video_choice_popup_video_information_brand_name"
                      translation-key-placeholder="setup_video_choice_popup_video_information_brand_name_placeholder"
                      title={t("setup_video_choice_popup_video_information_brand_name")}
                      placeholder={t("setup_video_choice_popup_video_information_brand_name_placeholder")}
                      type="text"
                      autoComplete="off"
                      inputRef={register("brand")}
                      errorMessage={errors.brand?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputTextfield
                      translation-key="setup_video_choice_popup_video_information_product_name"
                      translation-key-placeholder="setup_video_choice_popup_video_information_product_name_placeholder"                    
                      title={t("setup_video_choice_popup_video_information_product_name")}
                      placeholder={t("setup_video_choice_popup_video_information_product_name_placeholder")}
                      type="text"
                      autoComplete="off"
                      inputRef={register("product")}
                      errorMessage={errors.product?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box className={classes.boxKeyMessage}>
                      <ParagraphSmall $colorName="--eerie-black" translation-key="setup_video_choice_popup_video_information_key_message">{t("setup_video_choice_popup_video_information_key_message")}</ParagraphSmall>
                      <BasicTooltip arrow title={
                        <div>
                          <Heading6 translation-key="setup_video_choice_popup_video_information_question_key_message">{t("setup_video_choice_popup_video_information_question_key_message")}</Heading6>
                          <ParagraphExtraSmall translation-key="setup_video_choice_popup_video_information_question_key_message_sub">{t("setup_video_choice_popup_video_information_question_key_message_sub")}</ParagraphExtraSmall>
                        </div>
                      }>
                        <HelpOutlineIcon sx={{ ml: 1, fontSize: "16px", color: "var(--gray-40)" }}></HelpOutlineIcon>
                      </BasicTooltip>
                    </Box>
                    <Grid className={classes.boxInputTextArea}>
                      <InputTextfield
                        translation-key-placeholder="setup_video_choice_popup_video_information_key_message_text"  
                        placeholder={t("setup_video_choice_popup_video_information_key_message_text")}
                        multiline
                        rows={3}
                        infor={`${keyMessage?.length}/${CHARACTER_LIMIT}`}
                        inputRef={register("keyMessage")}
                        inputProps={{
                          maxLength: CHARACTER_LIMIT,
                        }}
                        errorMessage={errors.keyMessage?.message}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
          <Grid>
            {(type === EVIDEO_TYPE.UPLOAD && !!videoFromDevice) && (
              <video
                width="300"
                height="168.75"
                className={classes.iframeVideo}
                title="Video from device"
                controls
                src={videoFromDevice?.attachment.url}
              >
              </video>
            )}
            {(type === EVIDEO_TYPE.YOUTUBE && !!videoFromYoutube) && (
              <iframe
                width="300"
                height="168.75"
                className={classes.iframeVideo}
                src={`https://www.youtube.com/embed/${videoFromYoutube.id}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
              </iframe>
            )}
          </Grid>
        </Grid>
        <Grid className={classes.boxAction}>
          <Button btnType={BtnType.Primary} type="submit" className={classes.btnNext} translation-key="common_next">
            {t("common_next")}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Information;
