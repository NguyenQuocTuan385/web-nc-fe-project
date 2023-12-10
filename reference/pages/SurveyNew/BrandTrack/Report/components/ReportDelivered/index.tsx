import { Box, Grid } from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import { memo } from "react";
import classes from "../../styles.module.scss";
import images from "config/images";
import Heading2 from "components/common/text/Heading2";
import ParagraphBody from "components/common/text/ParagraphBody";
import Heading4 from "components/common/text/Heading4";
import { DashboardOutlined } from "@mui/icons-material";
import { IconDownload } from "components/icons";
import { useTranslation } from "react-i18next";
import { IResult } from "../.."
interface Props {
  onOpenDashboard?: () => void;
  onDownLoad?: () => void;
  result: IResult;
  date: string;
}

const ReportDelivered = memo(({ onOpenDashboard, onDownLoad, result, date }: Props) => {
  const { t } = useTranslation();

  return (
    <Grid className={classes.descriptionWrapper}>
      <Box className={classes.imageDescription}>
        <img src={images.imgDashboardReady} alt="" />
      </Box>
      <Box className={classes.description}>
        <Heading2 mb={1} translation-key="brand_track_results_tab_report_delivered_title">
          {t("brand_track_results_tab_report_delivered_title", {
            date: date
          })}
        </Heading2>
        <ParagraphBody $colorName="--eerie-black" mb={4} translation-key="brand_track_results_tab_report_delivered_subtitle">
          {t("brand_track_results_tab_report_delivered_subtitle")}
        </ParagraphBody>
        <Box className={classes.actionWrapper}>
          {
            result?.dataStudio &&
            <Button
              btnType={BtnType.Primary}
              children={
                <Heading4 $colorName="--white" $fontWeight={500} translation-key="brand_track_results_tab_report_delivered_access">
                  {t("brand_track_results_tab_report_delivered_access")}
                </Heading4>
              }
              startIcon={<DashboardOutlined sx={{ fontSize: "22.5px !important" }} />}
              sx={{ width: { xs: "100%", sm: "auto" } }}
              onClick={onOpenDashboard}
            />
          }
          {result?.report && (
            <Button
              btnType={BtnType.Outlined}
              children={
                <Heading4 $colorName="--cimigo-blue" $fontWeight={500} translation-key="brand_track_results_tab_report_delivered_dowload">
                  {t("brand_track_results_tab_report_delivered_dowload")}
                </Heading4>
              }
              startIcon={<IconDownload sx={{ fontSize: "16.5px !important" }} />}
              sx={{ width: { xs: "100%", sm: "auto" } }}
              onClick={onDownLoad}
            />
          )}
        </Box>
      </Box>
    </Grid>
  );
});

export default ReportDelivered;
