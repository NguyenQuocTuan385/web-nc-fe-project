import { useMemo } from "react";
import {
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./styles.module.scss";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import Button, { BtnType } from "components/common/buttons/Button"
import Heading4 from "components/common/text/Heading4";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import Heading5 from "components/common/text/Heading5";
import InputTextfield from "components/common/inputs/InputTextfield";
import GoogleApisService from "services/googoleapis";
import { VIDEO_YOUTUBE_STEP } from "models/video";
import moment from "moment";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { useDispatch } from "react-redux";
import { VideoService } from "services/video";

const VIDEO_DURATION = 120
export interface VideoYoutubeFormData {
  linkVideo: string;
}

interface Props {
  projectId: number;
  onSubmit: (data: VIDEO_YOUTUBE_STEP) => void;
}

const UploadVideoFromYoutube = ({ projectId, onSubmit }: Props) => {
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch()

  const schema = useMemo(() => {
    return yup.object().shape({
      linkVideo: yup.string()
        .matches(/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/, {
          excludeEmptyString: true,
          message: t('setup_video_choice_popup_video_upload_youtube_invalid')
        })
        .required(t('setup_video_choice_popup_video_upload_youtube_required')),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    reset,
    register,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<VideoYoutubeFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onClearData = () => {
    reset({
      linkVideo: ''
    })
  }

  const _onSubmit = (data: VideoYoutubeFormData) => {
    dispatch(setLoading(true))
    GoogleApisService.getVideosYoutube({
      urls: [data.linkVideo],
      part: ['contentDetails', 'status']
    })
      .then(async ({ data }) => {
        const id = data.items[0].id
        const _duration = data.items[0].contentDetails.duration
        const duration = moment.duration(_duration).asSeconds()
        const privacyStatus = data.items[0].status.privacyStatus
        const embeddable = data.items[0].status.embeddable

        if (privacyStatus !== "public" || !embeddable) {
          setError('linkVideo', {
            message: t('setup_video_choice_popup_video_upload_youtube_public_mode_invalid')
          })
          return
        }
        if (duration > VIDEO_DURATION) {
          setError('linkVideo', {
            message: t('setup_video_choice_popup_video_upload_youtube_max_duration')
          })
          return
        }

        const checkYoutubeLink = await VideoService.checkYoutubeLink({
          projectId,
          youtubeVideoId: id,
        })
          .catch(e => {
            dispatch(setErrorMess(e))
            return false
          })
        if (checkYoutubeLink) {
          onSubmit({
            id: id,
            duration: duration
          })
          onClearData()
        } else {
          setError('linkVideo', {
            message: t('setup_video_choice_popup_video_upload_youtube_link_existed')
          })
        }
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <Grid component="form" onSubmit={handleSubmit(_onSubmit)}>
        <ParagraphSmall sx={{paddingTop: '16px'}}$colorName="--eerie-black" translation-key="setup_video_choice_popup_video_upload_youtube_title">{t("setup_video_choice_popup_video_upload_youtube_title")}</ParagraphSmall>
        <Grid
          className={classes.videoUp}
        >
          <Grid className={classes.boxUploading}>
            <Grid className={classes.boxUploadingTitle}>
              <Heading4 $colorName="--gray-90" className={classes.titleUploadFile} translation-key="setup_video_choice_popup_video_upload_youtube_select_video">{t("setup_video_choice_popup_video_upload_youtube_select_video")}</Heading4>
              <ParagraphSmall $colorName="--gray-60" translation-key="setup_video_choice_popup_video_upload_youtube_enter_link">{t("setup_video_choice_popup_video_upload_youtube_enter_link")}</ParagraphSmall>
            </Grid>
            <Grid className={classes.boxUploadingFile}>
              <Grid className={classes.boxInput}>
                <InputTextfield
                  fullWidth
                  translation-key-placeholder="setup_video_choice_popup_video_upload_youtube_placeholder"
                  placeholder={t("setup_video_choice_popup_video_upload_youtube_placeholder")}
                  inputRef={register("linkVideo")}
                  autoFocus
                  autoComplete="off"
                  type="text"
                  errorMessage={errors.linkVideo?.message}
                />
              </Grid>
              <Button btnType={BtnType.Primary} className={classes.btnUpload} type="submit" translation-key="setup_video_choice_popup_video_upload_youtube_btn_load">{t("setup_video_choice_popup_video_upload_youtube_btn_load")}</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ mt: 2 }}>
          <Heading5 className={classes.textTitleFooter} translation-key="setup_video_choice_popup_video_upload_youtube_requirements">{t("setup_video_choice_popup_video_upload_youtube_requirements")}</Heading5>
          <div className={classes.textInfo}>
            <ParagraphSmall $colorName="--eerie-black" translation-key="setup_video_choice_popup_video_upload_youtube_requirements_public"
              dangerouslySetInnerHTML={{ __html: t("setup_video_choice_popup_video_upload_youtube_requirements_public") }}
            >
            </ParagraphSmall>
          </div>
          <div className={classes.textInfo}>
            <ParagraphSmall $colorName="--eerie-black" translation-key="setup_video_choice_popup_video_upload_youtube_requirements_duration"
              dangerouslySetInnerHTML={{ __html: t("setup_video_choice_popup_video_upload_youtube_requirements_duration") }}
            ></ParagraphSmall>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default UploadVideoFromYoutube;
