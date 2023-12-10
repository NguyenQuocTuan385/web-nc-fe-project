import { memo, useMemo } from "react";
import { Box } from "@mui/material"
import classes from '../styles.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import { ReducerType } from "redux/reducers";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { setScrollToSectionReducer } from "redux/reducers/Project/actionTypes";
import ProjectHelper from "helpers/project";
import ParagraphBody from "components/common/text/ParagraphBody";
import Heading5 from "components/common/text/Heading5";
import { KeyboardArrowRight } from "@mui/icons-material";
import { Project, SETUP_SURVEY_SECTION } from "models/project";
import CustomQuestionsPreview from "../components/CustomQuestionsPreview";
import {
  ButtonGoTo,
  ItemContent,
  ItemHead,
  ItemSubBox,
  ItemSubLeft,
  ItemSubRight,
  ItemSubRightCustom,
  RowItemBox,
} from "../components";


interface ForVideoProps {
}

// eslint-disable-next-line
const ForVideo = memo(({ }: ForVideoProps) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const { project } = useSelector((state: ReducerType) => state.project)

  const gotoSetupSurvey = () => {
    dispatch(push(routes.project.detail.setupSurvey.replace(':id', `${project.id}`)))
  }

  const isValidBasic = useMemo(() => {
    return ProjectHelper.isValidBasic(project)
  }, [project])
  
  const isValidEyeTracking = useMemo(() => {
    return ProjectHelper.isValidEyeTracking(project)
  }, [project])

  const isValidVideos = useMemo(() => {
    return ProjectHelper.isValidVideos(project)
  }, [project])

  const videoNeedMore = useMemo(() => ProjectHelper.videoNeedMore(project), [project])

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)))
  }

  const onGotoVideos = () => {
    if (isValidVideos) return
    dispatch(setScrollToSectionReducer(SETUP_SURVEY_SECTION.add_video))
    onRedirect(routes.project.detail.setupSurvey)
  }

  const onGotoEmotionMeasurement = () => {
    if (isValidEyeTracking) return
    dispatch(setScrollToSectionReducer(SETUP_SURVEY_SECTION.eye_tracking))
    onRedirect(routes.project.detail.setupSurvey)
  }

  const onGotoBasicInfor = (field?: keyof Project) => {
    if (isValidBasic) return
    dispatch(setScrollToSectionReducer(`${SETUP_SURVEY_SECTION.basic_information}-${field || ''}`))
    onRedirect(routes.project.detail.setupSurvey)
  }

  return (
    <RowItemBox>
      <ItemHead>
        <Heading5 $colorName="--eerie-black" translation-key="payment_billing_sub_tab_preview_survey_detail_video">
          {t('payment_billing_sub_tab_preview_survey_detail_video')}
        </Heading5>
        <ButtonGoTo
          endIcon={<KeyboardArrowRight />}
          translation-key="payment_billing_sub_tab_preview_edit_setup_video"
          onClick={gotoSetupSurvey}
        >
          {t("payment_billing_sub_tab_preview_edit_setup_video")}
        </ButtonGoTo>
      </ItemHead>
      <ItemContent>
        <ItemSubBox>
          <ItemSubLeft>
            <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_billing_video_choice_sub_tab_preview_product_category">
              {t('payment_billing_video_choice_sub_tab_preview_product_category')}
            </ParagraphBody>
          </ItemSubLeft>
          <ItemSubRightCustom>
            <ParagraphBody $colorName="--eerie-black">
              <span
                onClick={() => onGotoBasicInfor("category")}
                className={clsx({ [clsx(classes.colorDanger, classes.pointer)]: !project?.category })}
                translation-key="payment_billing_video_choice_sub_tab_preview_product_category_undefined"
              >
                {project?.category || t('payment_billing_video_choice_sub_tab_preview_product_category_undefined')}
              </span>
            </ParagraphBody>
          </ItemSubRightCustom>
        </ItemSubBox>
        <ItemSubBox>
          <ItemSubLeft>
            <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_billing_sub_tab_preview_video">
              {t('payment_billing_sub_tab_preview_video')}
            </ParagraphBody>
          </ItemSubLeft>
          <ItemSubRight>
            <Box>
              <ParagraphBody
                $colorName="--eerie-black"
                translation-key="payment_billing_sub_tab_preview_videos"
                className={classes.numberOfItem}
                dangerouslySetInnerHTML={{
                  __html: t("payment_billing_sub_tab_preview_videos", {
                    number: project?.videos?.length || 0,
                  }),
                }} />

                {!isValidVideos && (
                  <ParagraphBody
                    className={clsx(classes.colorDanger, classes.pointer)}
                    translation-key="payment_billing_sub_tab_preview_more_videos"
                    onClick={onGotoVideos}
                  >
                    {t('payment_billing_sub_tab_preview_more_videos', {
                      number: videoNeedMore 
                    })}
                  </ParagraphBody>
                )}
            </Box>
          </ItemSubRight>
        </ItemSubBox>
        {!!project?.customQuestions?.length && (
          <CustomQuestionsPreview customQuestionLength={project?.customQuestions?.length} />
        )}
        {project?.enableEyeTracking && (
          <ItemSubBox>
            <ItemSubLeft>
              <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_project_review_eye_emotion_survey_detail_video">
                {t('payment_project_review_eye_emotion_survey_detail_video')}
              </ParagraphBody>
            </ItemSubLeft>
            <ItemSubRight>
              <ParagraphBody
                $colorName="--eerie-black"
                translation-key="payment_billing_sub_tab_preview_enable_video"
                className={clsx({ [classes.pointer]: !isValidEyeTracking })}
                onClick={onGotoEmotionMeasurement}
              >
                {t("payment_billing_sub_tab_preview_enable_video")}
              </ParagraphBody>
            </ItemSubRight>
          </ItemSubBox>
        )}
      </ItemContent>
    </RowItemBox>
  )
})

export default ForVideo;