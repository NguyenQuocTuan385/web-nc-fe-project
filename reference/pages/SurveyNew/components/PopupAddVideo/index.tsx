import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  Step,
  StepConnector,
  Stepper,
} from "@mui/material";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import Heading3 from "components/common/text/Heading3"
import ButtonCLose from "components/common/buttons/ButtonClose"
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import { IconInformation, IconScenesStep } from "components/icons";
import UploadVideoFromDevice from "./components/UploadVideoFromDevice";
import UploadVideoFromYoutube from "./components/UploadVideoFromYoutube";
import { EVIDEO_TYPE, INFORMATION_STEP, SCENES_STEP, Video, VIDEO_UPLOAD_STEP, VIDEO_YOUTUBE_STEP } from "models/video";
import { RPStepLabel, RPStepIconBox } from "pages/SurveyNew/components";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import { setLoading, setErrorMess, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { useDispatch } from "react-redux";
import { Project } from "models/project";
import Information, { InformationForm } from "./components/Information";
import Scenes from "./components/Scenes";
import { VideoService } from "services/video";
import clsx from "clsx";

export enum EStep {
  UPLOAD_VIDEO,
  INFORMATION,
  SCENES,
}


interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemEdit?: Video;
  onSuccess: () => void;
  type?: EVIDEO_TYPE;
  project: Project;
}

const PopupAddVideo = (props: Props) => {

  const { onClose, isOpen, type: _type, itemEdit, onSuccess, project } = props;

  const dispatch = useDispatch()

  const { t, i18n } = useTranslation();

  const steps = useMemo(() => {
    return [
      { id: EStep.UPLOAD_VIDEO, name: t("setup_video_choice_popup_add_video_upload_video"), icon: <SmartDisplayOutlinedIcon /> },
      { id: EStep.INFORMATION, name: t("setup_video_choice_popup_add_video_information"), icon: <IconInformation /> },
      { id: EStep.SCENES, name: t("setup_video_choice_popup_add_video_scenes"), icon: <IconScenesStep />, optional:t("setup_video_choice_popup_add_video_scenes_optional") },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const [activeStep, setActiveStep] = useState<EStep>(EStep.UPLOAD_VIDEO);
  const [videoFromDevice, setVideoFromDevice] = useState<VIDEO_UPLOAD_STEP>();
  const [videoFromYoutube, setVideoFromYoutube] = useState<VIDEO_YOUTUBE_STEP>();
  const [informationData, setInformationData] = useState<INFORMATION_STEP>();
  const [scenes, setScenes] = useState<SCENES_STEP>();

  const type = useMemo(() => {
    return itemEdit ? itemEdit.typeId : _type
  }, [_type, itemEdit])

  useEffect(() => {
    if (itemEdit) {
      switch (itemEdit.typeId) {
        case EVIDEO_TYPE.UPLOAD:
          setVideoFromDevice({
            duration: itemEdit.duration,
            attachment: itemEdit.uploadVideo
          })
          break;
        case EVIDEO_TYPE.YOUTUBE:
          setVideoFromYoutube({
            duration: itemEdit.duration,
            id: itemEdit.youtubeVideoId
          })
          break;
      }
      setInformationData({
        name: itemEdit.name,
        brand: itemEdit.brand,
        product: itemEdit.product,
        keyMessage: itemEdit.keyMessage,
        marketingStageId: itemEdit.marketingStageId,
      })
      setScenes({
        scenes: itemEdit.videoScenes.map(scene => ({
          id: scene.id,
          name: scene.name,
          startTime: scene.startTime,
          endTime: scene.endTime,
        })),
      })
      setActiveStep(EStep.INFORMATION);
    }
  }, [itemEdit])

  const onChangeStep = (step: EStep) => {
    if (activeStep === step) return
    setActiveStep(step);
  };

  const getUploadType = () => {
    switch (type) {
      case EVIDEO_TYPE.UPLOAD:
        return (
          <UploadVideoFromDevice
            onSubmit={onUploadVideoFromDevice}
          />
        )
      case EVIDEO_TYPE.YOUTUBE:
        return (
          <UploadVideoFromYoutube
            projectId={project.id}
            onSubmit={onUploadVideoFromYoutube}
          />
        )
    }
  }
  const onUploadVideoFromYoutube = (data: VIDEO_YOUTUBE_STEP) => {
    setVideoFromYoutube(data)
    onChangeStep(EStep.INFORMATION)
  }

  const onUploadVideoFromDevice = (data: VIDEO_UPLOAD_STEP) => {
    setVideoFromDevice(data)
    onChangeStep(EStep.INFORMATION)
  }

  const onSubmitInformation = (data: InformationForm) => {
    setInformationData(data)
    onChangeStep(EStep.SCENES)
  }

  const onSubmitScenes = (data: SCENES_STEP) => {
    dispatch(setLoading(true))
    if (itemEdit) {
      VideoService.update(itemEdit.id, {
        name: informationData.name,
        marketingStageId: informationData.marketingStageId,
        brand: informationData.brand,
        product: informationData.product,
        keyMessage: informationData.keyMessage,
        videoScenes: data.scenes.map(item => ({
          id: item.id,
          name: item.name,
          startTime: item.startTime,
          endTime: item.endTime,
        }))
      })
        .then((res) => {
          onSuccess()
          _onClose()
          dispatch(setSuccessMess(res.message))
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      VideoService.create({
        name: informationData.name,
        marketingStageId: informationData.marketingStageId,
        brand: informationData.brand,
        product: informationData.product,
        keyMessage: informationData.keyMessage,
        typeId: type,
        uploadVideoId: videoFromDevice?.attachment?.id,
        youtubeVideoId: videoFromYoutube?.id,
        duration: videoFromDevice?.duration || videoFromYoutube?.duration,
        projectId: project.id,
        videoScenes: data.scenes.map(item => ({
          name: item.name,
          startTime: item.startTime,
          endTime: item.endTime,
        }))
      })
        .then((res) => {
          onSuccess()
          _onClose()
          dispatch(setSuccessMess(res.message))
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const _onClose = () => {
    onChangeStep(EStep.UPLOAD_VIDEO)
    setVideoFromDevice(null)
    setVideoFromYoutube(null)
    onClose()
  }

  const renderTitle = () => {
    switch (type) {
      case EVIDEO_TYPE.UPLOAD:
        return (
          <Heading3 translation-key="setup_video_choice_popup_add_video">
          {t("setup_video_choice_popup_add_video")}
          </Heading3>
        )
      case EVIDEO_TYPE.YOUTUBE:
        return (
          <Heading3 translation-key="setup_video_choice_popup_add_video_youtube">
          {t("setup_video_choice_popup_add_video_youtube")}
          </Heading3>
        )
    }
  }

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={() => _onClose()}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle>
        {renderTitle()}
        <ButtonCLose
          onClick={() => _onClose()}>
        </ButtonCLose>
      </DialogTitle>
      <DialogContent dividers
      className={clsx({[classes.content]: activeStep === EStep.INFORMATION || activeStep === EStep.SCENES})}>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          className={clsx({[classes.rootStepperShadow]: activeStep === EStep.INFORMATION || activeStep === EStep.SCENES})}
          connector={
            <StepConnector
              classes={{
                root: classes.rootConnector,
                active: classes.activeConnector,
              }}
            />
          }
        >
          {steps.map((item, index) => {
            return (
              <Step key={index}>
                <RPStepLabel
                  icon={item.icon}
                  StepIconComponent={({ completed, active }) => <RPStepIconBox $active={completed || active}>{item.icon}</RPStepIconBox>}
                  classes={{
                    root: classes.rootStep,
                    completed: classes.rootStepLabelCompleted,
                    active: classes.rootStepLabelActive,
                    label: classes.rootStepLabel,
                  }}
                >
                  {item.name}{" "}
                  <ParagraphExtraSmall $colorName={"--gray-60"}>
                    {item.optional}
                  </ParagraphExtraSmall>
                </RPStepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === EStep.UPLOAD_VIDEO && getUploadType()}
        {activeStep === EStep.INFORMATION && (
          <Information
            type={type}
            videoFromDevice={videoFromDevice}
            videoFromYoutube={videoFromYoutube}
            data={informationData}
            onSubmit={onSubmitInformation}
          />
        )}
        {activeStep === EStep.SCENES && (
          <Scenes
            type={type}
            videoFromDevice={videoFromDevice}
            videoFromYoutube={videoFromYoutube}
            information={informationData}
            data={scenes}
            onSubmit={onSubmitScenes}
            onBack={() => onChangeStep(EStep.INFORMATION)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PopupAddVideo;
