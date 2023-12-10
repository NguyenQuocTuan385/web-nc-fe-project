/* eslint-disable jsx-a11y/anchor-is-valid */
import { memo } from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import AccordionDetails from "@mui/material/AccordionDetails";
import Heading4 from "components/common/text/Heading4";
import Heading6 from "components/common/text/Heading6";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import AccordionSummary from "../AccordionSummary";
import Accordion from "../../components/Accordion";
import BoxCustom from "../BoxCustom";
import { PaymentSchedule } from "models/payment_schedule";
import moment from "moment";
import { usePrice } from "helpers/price";
import useDateTime from "hooks/useDateTime"
interface PropsType {
  paymentSchedule: PaymentSchedule;
}
const Ordersummary = memo(({ paymentSchedule }: PropsType) => {
  const { t } = useTranslation();
  const { getCostCurrency } = usePrice();
  const { formatMonthYear } = useDateTime()
  return (
    <Box mb={2}>
      <Accordion $accordionOrderSummary={true}>
        <AccordionSummary aria-controls="panel1a-content">
          <Heading4 $colorName={"--cimigo-blue"} translation-key="brand_track_paynow_popup_payment_billing_sub_tab_payment_summary">
            {t("brand_track_paynow_popup_payment_billing_sub_tab_payment_summary")}
          </Heading4>
        </AccordionSummary>
        <AccordionDetails>
          <BoxCustom py={2} mt={1} $borderTop={true}>
            <BoxCustom $flexBox={true}>
              <Heading6 $fontWeight={500} $colorName={"--eerie-black"} translation-key="brand_track_paynow_popup_project_name">
                {t("brand_track_paynow_popup_project_name", {
                  time: `${paymentSchedule.solutionConfig.paymentMonthSchedule} ${t("common_month", {
                    s: paymentSchedule.solutionConfig.paymentMonthSchedule > 1 ? t("common_s") : "",
                  })}`,
                })}
              </Heading6>
              <Heading6 variant="tabular_nums" $fontWeight={500} $colorName={"--eerie-black"}>
                {getCostCurrency(paymentSchedule.amount)?.show}
              </Heading6>
            </BoxCustom>
            <ParagraphExtraSmall $colorName={"--gray-60"}>
              {formatMonthYear(paymentSchedule.start)} - {formatMonthYear(paymentSchedule.end)}
            </ParagraphExtraSmall>
            <ParagraphExtraSmall $colorName={"--gray-60"} translation-key="brand_track_paynow_popup_project_id">
              {t("brand_track_paynow_popup_project_id", { id: paymentSchedule.projectId })}
            </ParagraphExtraSmall>
          </BoxCustom>
          <BoxCustom $borderTop={true} pt={2}>
            <BoxCustom $flexBox={true}>
              <ParagraphSmall $colorName={"--gray-60"} translation-key="common_sub_total">
                {t("common_sub_total")}
              </ParagraphSmall>
              <Heading6 variant="tabular_nums" $fontWeight={500} $colorName={"--eerie-black"}>
                {getCostCurrency(paymentSchedule.amount)?.show}
              </Heading6>
            </BoxCustom>
            <BoxCustom $flexBox={true}>
              <ParagraphSmall $colorName={"--gray-60"} translation-key="common_vat">
                {t("common_vat", { percent: (paymentSchedule.systemConfig?.vat || 0) * 100 })}
              </ParagraphSmall>
              <Heading6 variant="tabular_nums" $fontWeight={500} $colorName={"--eerie-black"}>
                {getCostCurrency(paymentSchedule.vat)?.show}
              </Heading6>
            </BoxCustom>
          </BoxCustom>
          <BoxCustom $flexBox={true} pt={3}>
            <Heading4 $fontWeight={500} $colorName={"--eerie-black"} translation-key="common_total">
              {t("common_total")}
            </Heading4>
            <Heading4 variant="tabular_nums" $fontWeight={500} $colorName={"--eerie-black"}>
              {getCostCurrency(paymentSchedule.totalAmount)?.show}
            </Heading4>
          </BoxCustom>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
});

export default Ordersummary;
