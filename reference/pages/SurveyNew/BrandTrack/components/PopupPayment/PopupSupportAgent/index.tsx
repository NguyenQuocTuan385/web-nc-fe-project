import { memo, useMemo } from "react";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { IconMoneyCash } from "components/icons";
import AccordionDetails from "@mui/material/AccordionDetails";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle";
import { DialogContentConfirm } from "components/common/dialogs/DialogContent";
import images from "config/images";
import DowloadInvoice from "../components/DowloadInvoice";
import Ordersummary from "../components/Ordersummary";
import Heading1 from "components/common/text/Heading1";
import Heading3 from "components/common/text/Heading3";
import Heading4 from "components/common/text/Heading4";
import Heading6 from "components/common/text/Heading6";
import ButtonClose from "components/common/buttons/ButtonClose";
import AccordionSummary from "../components/AccordionSummary";
import { ImageMain } from "../components/PopupImage";
import PopupPayment from "../components/PopupPayment";
import Accordion from "../components/Accordion";
import BoxCustom from "../components/BoxCustom";
import { PaymentSchedule } from "models/payment_schedule";
import moment from "moment";
import { usePrice } from "helpers/price";
import TooltipCancelPayment from "../components/TooltipCancelPayment";
import ProjectHelper from "helpers/project";
import useDateTime from "hooks/useDateTime"

interface Props {
  isOpen: boolean;
  paymentSchedule: PaymentSchedule;
  onDownloadInvoice: () => void;
  onCancel: () => void;
  onCancelPayment: () => void;
}

const PopupSupportAgent = memo((props: Props) => {
  const { isOpen, paymentSchedule, onDownloadInvoice, onCancel, onCancelPayment } = props;
  const { t } = useTranslation();
  const { getCostCurrency } = usePrice();
  const payment = useMemo(() => ProjectHelper.getPaymentForBrandTrack(paymentSchedule), [paymentSchedule]);
  const { formatFullDate, formatMonthYear } = useDateTime()

  return (
    <PopupPayment scroll="paper" open={isOpen} onClose={onCancel}>
      <DialogTitleConfirm $padding="24px 24px 8px 24px">
        <Box display="flex" alignItems={{ sm: "flex-end", xs: "flex-start" }} mt={3}>
          <ImageMain src={images.imgSupportAgent} alt="" />
          <Box ml={{ sm: 3 }}>
            <Heading1 whiteSpace={{ lg: "nowrap" }} $colorName="--eerie-black" translation-key="brand_track_popup_paynow_support_agent_title">
              {t("brand_track_popup_paynow_support_agent_title")}
            </Heading1>
            <Heading3 $fontWeight={500} $colorName="--gray-80" my={1} translation-key="brand_track_paynow_popup_payment_title">
              {t("brand_track_paynow_popup_payment_title", {
                start: formatMonthYear(paymentSchedule.start),
                end: formatMonthYear(paymentSchedule.end),
              })}
            </Heading3>
            <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"} flexWrap="wrap">
              <Box display="flex">
                <IconMoneyCash />
                <Heading4 ml={1} mr={3} $fontWeight={400} translation-key="">
                  {getCostCurrency(paymentSchedule.totalAmount)?.show}
                </Heading4>
              </Box>
              <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                <CalendarMonthOutlinedIcon sx={{ color: "var(--gray-80)" }} />
                <Heading4 $fontWeight={400} ml={1} $colorName={"--gray-80"} translation-key="brand_track_popup_paynow_due_date_title">
                  {t("brand_track_popup_paynow_due_date_title", { dueDate: formatFullDate(paymentSchedule.dueDate) })}
                </Heading4>
              </Box>
            </Grid>
          </Box>
        </Box>
        <ButtonClose $backgroundColor="--eerie-black-5" $colorName="--eerie-black-40" onClick={onCancel} />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <ParagraphBody
          paddingTop={2}
          $colorName="--gray-80"
          translation-key="brand_track_popup_paynow_support_agent_subtitle"
          dangerouslySetInnerHTML={{
            __html: `${t("brand_track_popup_paynow_support_agent_subtitle")}`,
          }}
        />
        <Grid>
          <Accordion $accordionOrderSummary={true}>
            <AccordionSummary aria-controls="panel1a-content">
              <Heading4
                $colorName={"--cimigo-blue"}
                display={"flex"}
                alignItems={"center"}
                translation-key="brand_track_popup_paynow_contact_information"
              >
                {t("brand_track_popup_paynow_contact_information")}
              </Heading4>
            </AccordionSummary>
            <AccordionDetails>
              <Grid display={"flex"} flexDirection="column" gap={1}>
                <BoxCustom mt={1} pt={2} $borderTop={true} $flexBox={true}>
                  <ParagraphSmall translation-key="brand_track_popup_paynow_contact_name">
                    {t("brand_track_popup_paynow_contact_name")}
                  </ParagraphSmall>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="brand_track_popup_paynow_contact_name_value">
                    {payment.contactName}
                  </Heading6>
                </BoxCustom>
                <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"} flexWrap="wrap">
                  <ParagraphSmall translation-key="brand_track_popup_paynow_contact_email">
                    {t("brand_track_popup_paynow_contact_email")}
                  </ParagraphSmall>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="brand_track_popup_paynow_contact_email_value">
                    {payment.contactEmail}
                  </Heading6>
                </Grid>
                <Grid display={"flex"} alignItems={"center"} justifyContent={"space-between"} flexWrap="wrap">
                  <ParagraphSmall translation-key="brand_track_popup_paynow_contact_phone">
                    {t("brand_track_popup_paynow_contact_phone")}
                  </ParagraphSmall>
                  <Heading6 $fontWeight={500} $colorName="--eerie-black" translation-key="brand_track_popup_paynow_contact_phone_value">
                    {payment.contactPhone}
                  </Heading6>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <ParagraphBody $colorName="--eerie-black" mt={3} translation-key="brand_track_popup_paynow_support_agent_subtitle_2">
            {t("brand_track_popup_paynow_support_agent_subtitle_2")}
          </ParagraphBody>
        </Grid>
        <DowloadInvoice onDownloadInvoice={onDownloadInvoice} />
        <Ordersummary paymentSchedule={paymentSchedule} />
        <Box mt={2}>
          <ParagraphBody
            className="nestedLink"
            $colorName="--eerie-black"
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

export default PopupSupportAgent;
