import { useState, useCallback } from "react";
import {
  Grid,
} from "@mui/material";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import Button, { BtnType } from "components/common/buttons/Button"
import { fData } from 'utils/formatNumber';
import ErrorMessage from "components/common/text/ErrorMessage";
import Heading4 from "components/common/text/Heading4";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { IconPlayMini } from "components/icons";
import { useDropzone } from "react-dropzone";
import useIsMountedRef from "hooks/useIsMountedRef";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import Heading5 from "components/common/text/Heading5";
import { LinearProgressWithLabel } from "../LinearProgressWithLabel";
import { AttachmentObjectTypeId } from "models/attachment";
import { VIDEO_UPLOAD_STEP } from "models/video";
import { useDispatch } from "react-redux";
import { VideoService } from "services/video";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { AttachmentService } from "services/attachment";


const VIDEO_SIZE = 15 * 10000000;// bytes
const FILE_FORMAT = ["video/mp4", "video/avi", "video/webm", "video/x-ms-wmv", "video/x-flv", "video/mpeg", "video/quicktime", "video/x-m4v"];
const VIDEO_DURATION = 120 //seconds;

interface Props {
  onSubmit: (data: VIDEO_UPLOAD_STEP) => void;
}


const UploadVideoFromDevice = ({ onSubmit }: Props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch()

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string>('');
  const [fileReview, setFileReview] = useState<File>(null);
  const isMountedRef = useIsMountedRef();

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
      let file = acceptedFiles[0] as File
      const checkSize = file.size < VIDEO_SIZE;
      if (!checkSize) {
        setIsError('size-invalid');
        return
      }
      const checkType = FILE_FORMAT.includes(file.type);
      if (!checkType) {
        setIsError('type-invalid');
        return
      }
      const duration = await getDuration(file)
      const isValidDuration = duration <= VIDEO_DURATION
      if (!isValidDuration) {
        setIsError('duration-invalid');
        return
      }
      setIsError('');
      setFileReview(file)
      setIsLoading(true);
      const form = new FormData();
      form.append('file', file)
      form.append('objectTypeId', `${AttachmentObjectTypeId.VIDEO}`)
      
      const onUploadProgress = (percent: number) => {
        setProgress(percent)
      }
      dispatch(setLoading(true))
      AttachmentService.create(form, onUploadProgress)
        .then((res) => {
          onSubmit({
            attachment: res,
            duration
          });
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMountedRef]
  );

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
  });

  return (
    <>
      <form>
        <ParagraphSmall $colorName="--eerie-black" translation-key="setup_video_choice_popup_video_upload_device_title">{t("setup_video_choice_popup_video_upload_device_title")}</ParagraphSmall>
        <Grid
          className={classes.videoUp}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {isLoading && (
            <Grid className={classes.boxUploading}>
              <Grid className={classes.boxUploadingTitle}>
                <Heading4 $colorName="--gray-90" translation-key="setup_video_choice_popup_video_upload_device_title_uploading">{t("setup_video_choice_popup_video_upload_device_title_uploading")}</Heading4>
                <ParagraphSmall $colorName="--gray-60" translation-key="setup_video_choice_popup_video_upload_device_title_uploading_sub">{t("setup_video_choice_popup_video_upload_device_title_uploading_sub")}</ParagraphSmall>
              </Grid>
              <Grid className={classes.boxUploadingFile}>
                <IconPlayMini />
                <Grid sx={{ marginLeft: "8px" }}>
                  <Grid sx={{ display: "flex" }}>
                    <ParagraphExtraSmall $colorName="--gray-40">{fileReview?.name}</ParagraphExtraSmall>
                    <ParagraphExtraSmall $colorName="--gray-50" sx={{ ml: 1 }}>{fData(fileReview?.size)}</ParagraphExtraSmall>
                  </Grid>
                  <LinearProgressWithLabel value={progress} />
                </Grid>
              </Grid>
            </Grid>
          )}
          {!fileReview &&
            <Grid className={classes.contentUpload}>
              <CloudUploadOutlinedIcon />
              <ParagraphSmall $colorName="--gray-90" sx={{ mt: 2 }} translation-key="setup_video_choice_popup_video_upload_device_drag_drop">{t("setup_video_choice_popup_video_upload_device_drag_drop")}</ParagraphSmall>
              <ParagraphSmall $colorName="--gray-60" translation-key="setup_video_choice_popup_video_upload_device_drag_drop_sub">{t("setup_video_choice_popup_video_upload_device_drag_drop_sub")}</ParagraphSmall>
              {isError === 'size-invalid' &&
                <Grid className={classes.boxError}>
                  <ErrorTwoToneIcon />
                  <ErrorMessage translation-key="setup_video_choice_popup_video_upload_device_file_validate">{t("setup_video_choice_popup_video_upload_device_file_validate", {number: fData(VIDEO_SIZE)})}</ErrorMessage>
                </Grid>
              }
              {isError === 'type-invalid' &&
                <Grid className={classes.boxError}>
                  <ErrorTwoToneIcon />
                  <ErrorMessage translation-key="setup_video_choice_popup_video_upload_device_file_validate_format">{t("setup_video_choice_popup_video_upload_device_file_validate_format")}</ErrorMessage>
                </Grid>
              }
              {isError === 'duration-invalid' &&
                <Grid className={classes.boxError}>
                  <ErrorTwoToneIcon />
                  <ErrorMessage translation-key="setup_video_choice_popup_video_upload_device_file_validate_duration">{t("setup_video_choice_popup_video_upload_device_file_validate_duration")}</ErrorMessage>
                </Grid>
              }
              <Button btnType={BtnType.Primary} sx={{ mt: 2 }} translation-key="setup_video_choice_popup_video_upload_device_select_file">{t("setup_video_choice_popup_video_upload_device_select_file")}</Button>
            </Grid>
          }
        </Grid>
        <Grid sx={{ mt: 2 }}>
          <Heading5 className={classes.textTitleFooter} translation-key="setup_video_choice_popup_video_upload_device_instruction">{t("setup_video_choice_popup_video_upload_device_instruction")}</Heading5>
          <div className={classes.textInfo}>
            <ParagraphSmall $colorName="--eerie-black" translation-key="setup_video_choice_popup_video_upload_device_instruction_sub_format"
            dangerouslySetInnerHTML={{ __html: t("setup_video_choice_popup_video_upload_device_instruction_sub_format")}}
            >
            </ParagraphSmall>
          </div>
          <div className={classes.textInfo}>
            <ParagraphSmall $colorName="--eerie-black" translation-key="setup_video_choice_popup_video_upload_device_instruction_sub_size"
            dangerouslySetInnerHTML={{ __html: t("setup_video_choice_popup_video_upload_device_instruction_sub_size")}}
            ></ParagraphSmall>
          </div>
          <div className={classes.textInfo}>
            <ParagraphSmall $colorName="--eerie-black" translation-key="setup_video_choice_popup_video_upload_device_instruction_sub_duration"
            dangerouslySetInnerHTML={{ __html: t("setup_video_choice_popup_video_upload_device_instruction_sub_duration")}}
            >
            </ParagraphSmall>
          </div>
        </Grid>

      </form>
    </>
  );
};

export default UploadVideoFromDevice;
