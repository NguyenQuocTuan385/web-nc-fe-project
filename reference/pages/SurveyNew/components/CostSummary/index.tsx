import { Box, Divider } from "@mui/material"
import Heading3 from "components/common/text/Heading3"
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import { TotalPrice } from "helpers/price"
import { Project } from "models/project"
import { memo, useMemo } from "react"
import { useSelector } from "react-redux"
import { ReducerType } from "redux/reducers"
import { useTranslation } from "react-i18next"
import { ESOLUTION_TYPE } from "models/solution";
import { ProjectHelper } from "helpers/project";

interface CostSummaryProps {
  price: TotalPrice,
  project: Project
}

const CostSummary = memo(({ project, price }: CostSummaryProps) => {

  const { t } = useTranslation()

  const { configs } = useSelector((state: ReducerType) => state.user)
  const _configs = useMemo(() => ProjectHelper.getConfig(project, configs), [project, configs])

  const renderETTranslateKey = () => {
    switch (project?.solution?.typeId) {
      case ESOLUTION_TYPE.PACK:
        return (
          <ParagraphSmall $colorName="--eerie-black" translation-key="project_right_panel_cost_summary_eye_tracking">{t("project_right_panel_cost_summary_eye_tracking")} ({project?.eyeTrackingSampleSize || 0})</ParagraphSmall>
        )
      case ESOLUTION_TYPE.VIDEO_CHOICE:
        return (
          <ParagraphSmall $colorName="--eerie-black" translation-key="project_right_panel_cost_summary_eye_tracking_video">{t("project_right_panel_cost_summary_eye_tracking_video")} ({project?.eyeTrackingSampleSize || 0})</ParagraphSmall>  
        )
    }
  }

  return (
    <>
      <ParagraphExtraSmall $colorName="--eerie-black" mb={2}>
        {t('setup_survey_cost_summary_title')}
      </ParagraphExtraSmall>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <ParagraphSmall $colorName="--eerie-black" translation-key="common_sample_size">{t('common_sample_size')} ({project?.sampleSize || 0})</ParagraphSmall>
        <ParagraphSmall variant="tabular_nums" $colorName="--eerie-black">{price?.sampleSizeCost?.show}</ParagraphSmall>
      </Box>
      {project?.enableCustomQuestion && (
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
          <ParagraphSmall $colorName="--eerie-black" translation-key="common_custom_question">{t("common_custom_question")} ({project?.customQuestions?.length || 0})</ParagraphSmall>
          <ParagraphSmall variant="tabular_nums" $colorName="--eerie-black">{price?.customQuestionCost?.show}</ParagraphSmall>
        </Box>
      )}
      {project.enableEyeTracking && (
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
          {renderETTranslateKey()} 
          <ParagraphSmall variant="tabular_nums" $colorName="--eerie-black">{price?.eyeTrackingSampleSizeCost?.show}</ParagraphSmall>
        </Box>
      )}
      <Divider sx={{ my: 2, borderColor: 'var(--gray-20)' }} />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <ParagraphSmall $colorName="--eerie-black" translation-key="common_sub_total">{t('common_sub_total')}</ParagraphSmall>
        <ParagraphSmall variant="tabular_nums" $colorName="--eerie-black">{price?.amountCost?.show}</ParagraphSmall>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
        <ParagraphSmall $colorName="--eerie-black" translation-key="common_vat">{t('common_vat', { percent: (_configs?.vat || 0) * 100 })}</ParagraphSmall>
        <ParagraphSmall variant="tabular_nums" $colorName="--eerie-black">{price?.vatCost?.show}</ParagraphSmall>
      </Box>
      <Divider sx={{ my: 2, borderColor: 'var(--gray-20)' }} />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <ParagraphSmall $fontWeight={"bold"} $colorName="--eerie-black" translation-key="common_total_2">{t('common_total_2')}</ParagraphSmall>
        <Heading3 variant="tabular_nums" $fontWeight={500} $colorName="--eerie-black" align="right">{price?.totalAmountCost?.show}</Heading3>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <ParagraphSmall variant="tabular_nums" $fontWeight={500} $colorName="--eerie-black" align="right">({price?.totalAmountCost?.equivalent})</ParagraphSmall>
      </Box>
    </>
  )
})

export default CostSummary