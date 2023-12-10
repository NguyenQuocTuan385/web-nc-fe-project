import { Box,  Grid, } from "@mui/material";
import Heading4 from "components/common/text/Heading4";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { Project, SETUP_SURVEY_SECTION } from "models/project";
import { PriceChip } from "pages/SurveyNew/components";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.scss"
import clsx from "clsx"
import Switch from "components/common/inputs/Switch";
import { TotalPrice } from "helpers/price";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { setProjectReducer } from "redux/reducers/Project/actionTypes";
import { ProjectService } from "services/project";


interface EmotionMeasurementProps {
  price: TotalPrice;
  project: Project;
  step: number;
}

export const EmotionMeasurement = memo(({ price, project, step }: EmotionMeasurementProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch()

    const onToggleEyeTracking = () => {
      const enableEyeTracking = !project?.enableEyeTracking;
      dispatch(setLoading(true))
      ProjectService.updateEnableEyeTracking(project.id, { enableEyeTracking: enableEyeTracking })
        .then((res) => {
          const eyeTrackingSampleSize = (res.data as Project).eyeTrackingSampleSize
          dispatch(setProjectReducer({ ...project, enableEyeTracking: enableEyeTracking, eyeTrackingSampleSize}));
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }

  return (
    <Grid id={SETUP_SURVEY_SECTION.emotion_measurement} mt={4}>
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Box mr={1}>
            <Switch
              checked={project?.enableEyeTracking}
              onChange={() => onToggleEyeTracking()}
            />
          <Heading4
            $fontSizeMobile={"16px"}
            $colorName="--eerie-black"
            translation-key="setup_video_choice_add_video_emotion_measurement"
            sx={{ display: "inline-block", verticalAlign: "middle" }}
            className={clsx({ [classes.titleDisabled]: !project?.enableEyeTracking })}
          >
             {t("setup_video_choice_add_video_emotion_measurement", {number: step})}
          </Heading4>
        </Box>
        <Box>
          <PriceChip
            className={clsx({ 'disabled': !project?.enableEyeTracking })}
            label={<ParagraphSmall translation-key="common_samples, setup_survey_custom_question_cost_description">
              {project?.enableEyeTracking ? `${price?.eyeTrackingSampleSizeCost?.show} ( ${project?.eyeTrackingSampleSize || 0} ${t("common_samples")})` : `${t("setup_survey_custom_question_cost_description")}`}
            </ParagraphSmall>}
          />
        </Box>
      </Box>
      <ParagraphBody
        $colorName="--gray-80"
        mt={1}
        translation-key="setup_video_choice_add_video_emotion_measurement_sub_title"
        className={clsx({ [classes.titleSubDisabled]: !project?.enableEyeTracking })}
        dangerouslySetInnerHTML={{ __html: t("setup_video_choice_add_video_emotion_measurement_sub_title")}}
      >
      </ParagraphBody>
    </Grid >
  )
})

export default EmotionMeasurement;