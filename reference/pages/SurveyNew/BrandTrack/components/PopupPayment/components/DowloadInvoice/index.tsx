/* eslint-disable jsx-a11y/anchor-is-valid */
import { memo, useMemo } from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import FileSaver from "file-saver";
import moment from "moment";
import { ReducerType } from "redux/reducers";
import { PaymentService } from "services/payment";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { getPayment } from "pages/SurveyNew/Pay/models";
import ParagraphBodyUnderline from "components/common/text/ParagraphBodyUnderline";
import images from "config/images";
import { ImageSecond } from "../PopupImage";

interface Props {
  onDownloadInvoice?: () => void;
}

const DowloadInvoice = memo(({onDownloadInvoice} : Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { project } = useSelector((state: ReducerType) => state.project);
  const payment = useMemo(() => getPayment(project?.payments), [project]);

  const getInvoice = () => {
    if (onDownloadInvoice) {
      onDownloadInvoice();
      return;
    }
    if (!project || !payment) return;
    dispatch(setLoading(true));
    PaymentService.getInvoiceDemo(project.id, payment.id)
      .then((res) => {
        FileSaver.saveAs(res.data, `invoice-${moment().format("MM-DD-YYYY-hh-mm-ss")}.pdf`);
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  return (
    <>
      <Box display={"flex"} alignItems={"center"} mt={3} mb={0.5}>
        <ImageSecond src={images.icInvoice} alt="" />
        <ParagraphBodyUnderline
          onClick={getInvoice}
          ml={1}
          $textDecoration="none"
          translation-key="brand_track_popup_paynow_pay_order_download_invoice"
          dangerouslySetInnerHTML={{ __html: t("brand_track_popup_paynow_pay_order_download_invoice") }}
        />
      </Box>
      <Typography color={"var(--gray-60)"} translation-key="brand_track_popup_paynow_red_invoice_title">
        {t("brand_track_popup_paynow_red_invoice_title")}
      </Typography>
    </>
  );
});

export default DowloadInvoice;
