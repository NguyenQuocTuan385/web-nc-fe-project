import { Box, Divider } from "@mui/material"
import classes from "./styles.module.scss";
import Heading3 from "components/common/text/Heading3"
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import { TotalPrice } from "helpers/price"
import { Project } from "models/project"
import { memo, useMemo } from "react"
import { useSelector } from "react-redux"
import { ReducerType } from "redux/reducers"
import { useTranslation } from "react-i18next"
import Heading4 from "components/common/text/Heading4"
import { ArrowDropDown } from "@mui/icons-material"
import ProjectHelper from "helpers/project";

interface CostSummaryBrandTrackProps {
  price: TotalPrice,
  project: Project
}

const CostSummaryBrandTrack = memo(({ project, price }: CostSummaryBrandTrackProps) => {

  const { t } = useTranslation()

  const { configs } = useSelector((state: ReducerType) => state.user)

  const _project = useMemo(() => ProjectHelper.getProject(project), [project])
  const _configs = useMemo(() => ProjectHelper.getConfig(project, configs), [project, configs])

  return (
    <>
      <Heading4 $colorName="--eerie-black" $fontWeight={"500"} mb={1} sx={{display: "flex", alignItems: "center", gap: "8px"}} translation-key="brand_track_right_panel_cost_summary_monthly_cost">
        {t("brand_track_right_panel_cost_summary_monthly_cost")}
      </Heading4>
      <Divider sx={{ mb: 2, borderColor: 'var(--gray-20)' }} />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box>
          <ParagraphSmall $colorName="--eerie-black" $fontWeight={"500"} translation-key="brand_track_right_panel_cost_summary_brand_track">{t("brand_track_right_panel_cost_summary_brand_track")}</ParagraphSmall>
          <ParagraphExtraSmall 
            $colorName="--gray-60" 
            className={classes.itemSubTitle}
            translation-key="brand_track_right_panel_cost_summary_sample_size"
            dangerouslySetInnerHTML={{
              __html: t("brand_track_right_panel_cost_summary_sample_size", {number: project?.sampleSize}),
            }}
          ></ParagraphExtraSmall>
        </Box>
        <ParagraphSmall variant="tabular_nums" $colorName="--eerie-black" $fontWeight={"500"}>{price?.sampleSizeCost?.show}</ParagraphSmall>
      </Box>
      {project?.enableCustomQuestion && (
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box>
            <ParagraphSmall $colorName="--eerie-black" $fontWeight={"500"} translation-key="common_custom_question">{t("common_custom_question")}</ParagraphSmall>
            <ParagraphExtraSmall 
              $colorName="--gray-60" 
              className={classes.itemSubTitle}
              translation-key="brand_track_right_panel_cost_summary_question"
              dangerouslySetInnerHTML={{
                __html: t("brand_track_right_panel_cost_summary_question", {number: project?.customQuestions?.length || 0}),
              }}
            ></ParagraphExtraSmall>
          </Box>
          <ParagraphSmall variant="tabular_nums" $colorName="--eerie-black" $fontWeight={"500"}>{price?.customQuestionCost?.show}</ParagraphSmall>
        </Box>
      )}
      <Divider sx={{ mt: 4, mb: 2, borderColor: 'var(--gray-20)' }} />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <ParagraphSmall $colorName="--gray-80" translation-key="common_sub_total">{t('common_sub_total')}</ParagraphSmall>
        <ParagraphSmall variant="tabular_nums" $colorName="--eerie-black" $fontWeight={"500"}>{price?.amountCost?.show}</ParagraphSmall>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <ParagraphSmall $colorName="--gray-80" translation-key="common_vat">{t('common_vat', { percent: (_configs?.vat || 0) * 100 })}</ParagraphSmall>
        <ParagraphSmall variant="tabular_nums" $colorName="--eerie-black" $fontWeight={"500"}>{price?.vatCost?.show}</ParagraphSmall>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Heading4 $fontWeight={"500"} $colorName="--eerie-black" translation-key="common_total_2">{t('common_total_2')}</Heading4>
        <Heading3 variant="tabular_nums" $fontWeight={500} $colorName="--eerie-black" align="right">{price?.totalAmountCost?.show}</Heading3>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <ParagraphSmall 
          $colorName="--gray-80" 
          align="right"
          translation-key="brand_track_right_panel_cost_summary_billing_cycle"
          dangerouslySetInnerHTML={{
            __html: t("brand_track_right_panel_cost_summary_billing_cycle", {number: _project?.solution?.paymentMonthSchedule}),
          }}
        ></ParagraphSmall>
      </Box>
    </>
  )
})

export default CostSummaryBrandTrack