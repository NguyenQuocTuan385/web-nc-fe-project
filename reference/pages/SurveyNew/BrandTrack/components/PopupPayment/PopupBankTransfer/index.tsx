import { memo, useMemo, useState, useEffect } from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { IconMoneyCash } from "components/icons";
import images from "config/images";
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle";
import { DialogContentConfirm } from "components/common/dialogs/DialogContent";
import DowloadInvoice from "../components/DowloadInvoice";
import Ordersummary from "../components/Ordersummary";
import AccordionSummary from "../components/AccordionSummary";
import Heading1 from "components/common/text/Heading1";
import Heading3 from "components/common/text/Heading3";
import Heading4 from "components/common/text/Heading4";
import Heading6 from "components/common/text/Heading6";
import ButtonClose from "components/common/buttons/ButtonClose";
import { ImageMain } from "../components/PopupImage";
import PopupPayment from "../components/PopupPayment";
import Accordion from "../components/Accordion";
import Span from "../components/Span";
import BoxCustom from "../components/BoxCustom";
import { PaymentSchedule } from "models/payment_schedule";
import moment from "moment";
import { usePrice } from "helpers/price";
import TooltipCancelPayment from "../components/TooltipCancelPayment";
import  ProjectHelper  from "helpers/project";
import { PaymentScheduleService } from "services/payment_schedule";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { ReducerType } from "redux/reducers";
import { getPaymentSchedulesRequest } from "redux/reducers/Project/actionTypes";
import useDateTime from "hooks/useDateTime"

interface Props {
  isOpen: boolean;
  paymentSchedule: PaymentSchedule;
  onDownloadInvoice: () => void;
  onCancel: () => void;
  onCancelPayment: () => void;
}

const PopupBankTransfer = memo((props: Props) => {
  const { isOpen, paymentSchedule, onDownloadInvoice, onCancel, onCancelPayment } = props;
  const { t } = useTranslation();
  const { getCostCurrency } = usePrice();
  const dispatch = useDispatch();
  const { project } = useSelector((state: ReducerType) => state.project);
  const payment = useMemo(() => ProjectHelper.getPaymentForBrandTrack(paymentSchedule), [paymentSchedule]);
  const [userConfirm, setUserConfirm] = useState(false);

  const comfirmPayment = () => {
    dispatch(setLoading(true));
    PaymentScheduleService.confirmPaymentSchedule(paymentSchedule.id, true)
      .then(() => {
        setUserConfirm(true);
        dispatch(getPaymentSchedulesRequest(project.id));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  useEffect(() => {
    setUserConfirm(payment?.userConfirm);
  }, [payment]);

  const { formatFullDate, formatMonthYear } = useDateTime()

  return (
    <PopupPayment scroll="paper" open={isOpen} onClose={onCancel}>
      <DialogTitleConfirm $padding={"24px 24px 8px 24px"}>
        <Box display="flex" alignItems={{ sm: "flex-end", xs: "flex-start" }} mt={3}>
          <ImageMain src={images.imgPaymentError1} alt="" />
          <Box ml={{ sm: 3 }}>
            <Heading1 whiteSpace={{ lg: "nowrap" }} $colorName="--eerie-black" translation-key="brand_track_popup_paynow_bank_transfer_title">
              {t("brand_track_popup_paynow_bank_transfer_title")}
            </Heading1>
            <Heading3 $fontWeight={500} $colorName="--gray-80" my={1} translation-key="brand_track_paynow_popup_payment_title">
              {t("brand_track_paynow_popup_payment_title", {
                start: formatMonthYear(paymentSchedule.start),
                end: formatMonthYear(paymentSchedule.end),
              })}
            </Heading3>
            <BoxCustom $flexBox={true}>
              <Box display="flex">
                <IconMoneyCash />
                <Heading4 ml={1} $fontWeight={400}>
                  {getCostCurrency(paymentSchedule.totalAmount)?.show}
                </Heading4>
              </Box>
            </BoxCustom>
          </Box>
        </Box>
        <ButtonClose $backgroundColor="--eerie-black-5" $colorName="--eerie-black-40" onClick={onCancel} />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <ParagraphBody
          paddingTop={2}
          $colorName="--gray-80"
          translation-key="brand_track_popup_paynow_bank_transfer_subtitle"
          dangerouslySetInnerHTML={{
            __html: `${t("brand_track_popup_paynow_bank_transfer_subtitle", {
              dueDate: formatFullDate(paymentSchedule.dueDate),
            })}`,
          }}
        />
        <Grid>
          <Accordion $accordionMain={true} $accordionBankTransfer={true}>
            <AccordionSummary width={"100%"} expandIcon={<ArrowRightIcon sx={{ color: "var(--cimigo-blue)" }} />} aria-controls="panel1a-content">
              <Heading4
                $fontWeight={400}
                $colorName={"--cimigo-blue"}
                display={"flex"}
                alignItems={"center"}
                translation-key="brand_track_popup_paynow_bank_transfer_title_transfer"
              >
                {t("brand_track_popup_paynow_bank_transfer_title_transfer", { currency: "VND" })}
              </Heading4>
            </AccordionSummary>
            <AccordionDetails>
              <Grid rowGap={1} py={2}>
                <BoxCustom $flexBox={true}>
                  <ParagraphSmall translation-key="payment_billing_bank_name">{t("payment_billing_bank_name")}</ParagraphSmall>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="payment_billing_bank_name_name">
                    {t("payment_billing_bank_name_name")}
                  </Heading6>
                </BoxCustom>
                <BoxCustom $flexBox={true}>
                  <ParagraphSmall translation-key="payment_billing_beneficiary">{t("payment_billing_beneficiary")}</ParagraphSmall>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="payment_billing_beneficiary_name">
                    {t("payment_billing_beneficiary_name")}
                  </Heading6>
                </BoxCustom>
                <BoxCustom $flexBox={true}>
                  <ParagraphSmall translation-key="payment_billing_account_number">{t("payment_billing_account_number")}</ParagraphSmall>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="payment_billing_account_number_bank">
                    {t("payment_billing_account_number_bank")}
                  </Heading6>
                </BoxCustom>
                <BoxCustom $flexBox={true}>
                  <ParagraphSmall translation-key="payment_billing_currency">{t("payment_billing_currency")}</ParagraphSmall>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="payment_billing_currency_VND">
                    {t("payment_billing_currency_VND")}
                  </Heading6>
                </BoxCustom>
              </Grid>
              <Grid paddingBottom={2}>
                <BoxCustom $flexBox={true} py={0.5} pt={2} $borderTop={true}>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="brand_track_popup_paynow_bank_transfer_transfer_amount">
                    {t("brand_track_popup_paynow_bank_transfer_transfer_amount")}
                  </Heading6>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black">
                    {getCostCurrency(paymentSchedule.totalAmount)?.VNDShow}
                  </Heading6>
                </BoxCustom>
                <BoxCustom $flexBox={true} py={0.5}>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="payment_billing_payment_reference">
                    {t("payment_billing_payment_reference")}
                  </Heading6>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black">
                    {payment?.orderId}
                  </Heading6>
                </BoxCustom>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion $accordionMain={true} $accordionBankTransfer={true}>
            <AccordionSummary width={"100%"} expandIcon={<ArrowRightIcon sx={{ color: "var(--cimigo-blue)" }} />} aria-controls="panel1a-content">
              <Heading4
                $fontWeight={400}
                $colorName={"--cimigo-blue"}
                display={"flex"}
                alignItems={"center"}
                translation-key="brand_track_popup_paynow_bank_transfer_title_transfer"
              >
                {t("brand_track_popup_paynow_bank_transfer_title_transfer", { currency: "USD" })}
              </Heading4>
            </AccordionSummary>
            <AccordionDetails>
              <Grid rowGap={1} py={2}>
                <BoxCustom $flexBox={true}>
                  <ParagraphSmall translation-key="payment_billing_bank_name">{t("payment_billing_bank_name")}</ParagraphSmall>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="payment_billing_bank_name_name">
                    {t("payment_billing_bank_name_name")}
                  </Heading6>
                </BoxCustom>
                <BoxCustom $flexBox={true}>
                  <ParagraphSmall translation-key="payment_billing_beneficiary">{t("payment_billing_beneficiary")}</ParagraphSmall>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="payment_billing_beneficiary_name">
                    {t("payment_billing_beneficiary_name")}
                  </Heading6>
                </BoxCustom>
                <BoxCustom $flexBox={true}>
                  <ParagraphSmall translation-key="payment_billing_account_number">{t("payment_billing_account_number")}</ParagraphSmall>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="payment_billing_account_number_bank">
                    {t("payment_billing_account_number_bank")}
                  </Heading6>
                </BoxCustom>
                <BoxCustom $flexBox={true}>
                  <ParagraphSmall translation-key="payment_billing_SWIFT_code">{t("payment_billing_SWIFT_code")}</ParagraphSmall>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="payment_billing_SWIFT_code_name">
                    {t("payment_billing_SWIFT_code_name")}
                  </Heading6>
                </BoxCustom>
                <BoxCustom $flexBox={true}>
                  <ParagraphSmall translation-key="payment_billing_currency">{t("payment_billing_currency")}</ParagraphSmall>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="payment_billing_currency_USD">
                    {t("payment_billing_currency_USD")}
                  </Heading6>
                </BoxCustom>
              </Grid>
              <Grid paddingBottom={2}>
                <BoxCustom $flexBox={true} py={0.5} pt={2} $borderTop={true}>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="brand_track_popup_paynow_bank_transfer_transfer_amount">
                    {t("brand_track_popup_paynow_bank_transfer_transfer_amount")}
                  </Heading6>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black">
                    {getCostCurrency(paymentSchedule.totalAmount)?.USDShow}
                  </Heading6>
                </BoxCustom>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} py={0.5}>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="payment_billing_payment_reference">
                    {t("payment_billing_payment_reference")}
                  </Heading6>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black">
                    {payment?.orderId}
                  </Heading6>
                </Box>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <CalendarMonthOutlinedIcon sx={{ color: "var(--gray-80)" }} />
          <ParagraphBody my={2} ml={1} $colorName={"--gray-80"} translation-key="brand_track_popup_paynow_due_date_title">
            {t("brand_track_popup_paynow_due_date_title", { dueDate: formatFullDate(paymentSchedule.dueDate) })}
          </ParagraphBody>
        </Box>
        {!userConfirm ? (
          <ParagraphBody textAlign={"center"} $colorName={"--gray-80"} translation-key="brand_track_popup_paynow_bank_transfer_subtitle_3">
            {t("brand_track_popup_paynow_bank_transfer_subtitle_3")}{" "}
            <Span onClick={comfirmPayment} translation-key="brand_track_popup_paynow_action_2">
              {t("brand_track_popup_paynow_action_2")}
            </Span>
          </ParagraphBody>
        ) : (
          <ParagraphBody
            textAlign={"center"}
            $colorName={"--gray-80"}
            sx={{ background: "#f9f9f9", padding: "4px", bordeRadius: "4px" }}
            translation-key="brand_track_popup_paynow_bank_transfer_subtitle_4"
            dangerouslySetInnerHTML={{ __html: t("brand_track_popup_paynow_bank_transfer_subtitle_4") }}
          />
        )}
        <DowloadInvoice onDownloadInvoice={onDownloadInvoice} />
        <Ordersummary paymentSchedule={paymentSchedule} />
        <ParagraphBody $colorName={"--eerie-black-00"} translation-key="brand_track_popup_paynow_bank_transfer_subtitle_2">
          {t("brand_track_popup_paynow_bank_transfer_subtitle_2")}
        </ParagraphBody>
        <Box mt={2}>
          <ParagraphBody
            className="nestedLink"
            $colorName="--eerie-black-00"
            translation-key="payment_billing_order_bank_transfer_sub_6"
            dangerouslySetInnerHTML={{ __html: t("payment_billing_order_bank_transfer_sub_6") }}
          />
        </Box>
        <Typography my={3} color={"var(--eerie-black)"} textAlign="center" translation-key="brand_track_popup_paynow_change_payment_method">
          {t("brand_track_popup_paynow_change_payment_method")} <TooltipCancelPayment onCancelPayment={onCancelPayment} />
        </Typography>
      </DialogContentConfirm>
    </PopupPayment>
  );
});

export default PopupBankTransfer;
