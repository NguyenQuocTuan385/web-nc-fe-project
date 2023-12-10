import { Box, Grid } from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { memo } from "react";
import classes from "./styles.module.scss";
import { ArrowBack } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import moment from "moment";
import { IconDownload } from "components/icons";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { AttachmentService } from "services/attachment";
import FileSaver from "file-saver";
import { IResult } from "../..";
import { t } from "i18next";
import useDateTime from "hooks/useDateTime"

interface Props {
  isOpen: boolean;
  result: IResult;
  onClose: () => void;
}

const Dashboard = memo(({ isOpen, result, onClose }: Props) => {
  const dispatch = useDispatch();

  const onDownLoad = () => {
    dispatch(setLoading(true));
    AttachmentService.download(result?.report?.id)
      .then((res) => {
        FileSaver.saveAs(res.data, result?.report?.fileName);
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const { formatMonth, formatYear } = useDateTime()

  return (
    <Grid className={clsx(classes.root, { [classes.hidden]: !isOpen })}>
      <Grid sx={{ display: "flex", justifyContent: "space-between" }} className={classes.actionWrapper}>
        <Button
          btnType={BtnType.Text}
          children={
            <ParagraphSmall
              marginLeft={"20px"}
              $colorName="--cimigo-blue"
              $fontWeight={500}
              translation-key="brand_track_results_tab_dashboard_result"
            >
              {t("brand_track_results_tab_dashboard_result", {
                dueDate: `${formatMonth(result?.month).toUpperCase()} ${formatYear(result?.month)}`,
              })}
            </ParagraphSmall>
          }
          startIcon={<ArrowBack sx={{ fontSize: "22px !important" }} />}
          sx={{ width: { xs: "100%", sm: "auto" } }}
          onClick={onClose}
        />
        {result?.report && (
          <Button
            btnType={BtnType.Text}
            children={
              <ParagraphSmall
                $colorName="--cimigo-blue"
                marginLeft={"11px"}
                $fontWeight={500}
                translation-key="brand_track_results_tab_dashboard_dowload"
              >
                {t("brand_track_results_tab_dashboard_dowload")}
              </ParagraphSmall>
            }
            startIcon={<IconDownload sx={{ fontSize: "11px !important" }} />}
            sx={{ width: { xs: "100%", sm: "auto" } }}
            onClick={onDownLoad}
          />
        )}
      </Grid>
      <Grid className={classes.dashboard}>
        <Box sx={{ minHeight: "600px" }}>
          {!!result?.dataStudio && (
            <iframe
              width="100%"
              height="800"
              src={result?.dataStudio}
              allowFullScreen
              frameBorder={0}
              className={classes.iframe}
              title="data-studio"
            ></iframe>
          )}
        </Box>
      </Grid>
    </Grid>
  );
});

export default Dashboard;
