import { Box } from "@mui/system";
import { memo } from "react";
import classes from "./styles.module.scss";
import { Done } from "@mui/icons-material";
import clsx from "clsx";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import moment from "moment";
import ParagraphBody from "components/common/text/ParagraphBody";
import { ETimelineType, ITimeLineItem } from "../..";
import { useTranslation } from "react-i18next";
import useDateTime from "hooks/useDateTime"

interface Props {
  timeLineItem: ITimeLineItem;
  isFirstWave: boolean;
  isLastWave: boolean;
  onSelect?: () => void;
}

const TimeLineItem = memo(({ timeLineItem, isFirstWave, isLastWave, onSelect }: Props) => {
  const { t } = useTranslation();
  const { formatMonth, formatYear } = useDateTime()

  return (
    <Box className={classes.root}>
      {timeLineItem.state === ETimelineType.DELIVERED ? (
        <>
          <ParagraphBody $colorName="--cimigo-blue" $fontWeight={600} translation-key="brand_track_results_tab_result_delivered">
            {t("brand_track_results_tab_result_delivered")}
          </ParagraphBody>
          <Box className={classes.lineWrapper}>
            <Box className={clsx(classes.line, classes.deliveredLine)}></Box>
            <Box className={clsx(classes.circle, classes.circleDelivered)} onClick={onSelect}>
              <Done sx={{ fontSize: "14px", color: "var(--white)" }} />
            </Box>
            <Box className={clsx(classes.line, classes.deliveredLine)}></Box>
          </Box>
          <ParagraphBody $colorName="--cimigo-blue" $fontWeight={600}>
            {formatMonth(timeLineItem.date).toUpperCase()}
          </ParagraphBody>
          <ParagraphExtraSmall $colorName="--cimigo-blue" $fontWeight={400}>
            {formatYear(timeLineItem.date)}
          </ParagraphExtraSmall>
          {isFirstWave && (
            <ParagraphExtraSmall $colorName="--cimigo-blue" $fontWeight={400} translation-key="brand_track_results_tab_result_first_wave">
              {t("brand_track_results_tab_result_first_wave")}
            </ParagraphExtraSmall>
          )}
          {isLastWave && (
            <ParagraphExtraSmall $colorName="--cimigo-blue" $fontWeight={400} translation-key="brand_track_results_tab_result_last_wave">
              {t("brand_track_results_tab_result_last_wave")}
            </ParagraphExtraSmall>
          )}
        </>
      ) : timeLineItem.state === ETimelineType.IN_PROGRESS ? (
        <>
          <ParagraphBody $colorName="--warning-dark" $fontWeight={600} translation-key="brand_track_results_tab_result_inprogress">
            {t("brand_track_results_tab_result_inprogress")}
          </ParagraphBody>
          <Box className={classes.lineWrapper}>
            <Box className={clsx(classes.line, classes.inProgressLine)}></Box>
            <Box className={classes.circleInProgress}>
              <Box className={classes.circle}></Box>
            </Box>
            <Box className={classes.line}></Box>
          </Box>
          <ParagraphBody $colorName="--warning-dark" $fontWeight={600}>
            {formatMonth(timeLineItem.date).toUpperCase()}
          </ParagraphBody>
          <ParagraphExtraSmall $colorName="--warning-dark" $fontWeight={400}>
            {formatYear(timeLineItem.date)}
          </ParagraphExtraSmall>
          {isFirstWave && (
            <ParagraphExtraSmall $colorName="--warning-dark" $fontWeight={400} translation-key="brand_track_results_tab_result_first_wave">
              {t("brand_track_results_tab_result_first_wave")}
            </ParagraphExtraSmall>
          )}
          {isLastWave && (
            <ParagraphExtraSmall $colorName="--warning-dark" $fontWeight={400} translation-key="brand_track_results_tab_result_last_wave">
              {t("brand_track_results_tab_result_last_wave")}
            </ParagraphExtraSmall>
          )}
        </>
      ) : (
        <>
          <Box sx={{ height: "24px" }}></Box>
          <Box className={classes.lineWrapper}>
            <Box className={classes.line}></Box>
            <Box className={classes.circle}></Box>
            <Box className={classes.line}></Box>
          </Box>
          <ParagraphBody $colorName="--gray-40" $fontWeight={600}>
            {formatMonth(timeLineItem.date).toUpperCase()}
          </ParagraphBody>
          <ParagraphExtraSmall $colorName="--gray-40" $fontWeight={400}>
            {formatYear(timeLineItem.date)}
          </ParagraphExtraSmall>
          {isFirstWave && (
            <ParagraphExtraSmall $colorName="--gray-40" $fontWeight={400} translation-key="brand_track_results_tab_result_first_wave">
              {t("brand_track_results_tab_result_first_wave")}
            </ParagraphExtraSmall>
          )}
          {isLastWave && (
            <ParagraphExtraSmall $colorName="--gray-40" $fontWeight={400} translation-key="brand_track_results_tab_result_last_wave">
              {t("brand_track_results_tab_result_last_wave")}
            </ParagraphExtraSmall>
          )}
        </>
      )}
    </Box>
  );
});

export default TimeLineItem;
