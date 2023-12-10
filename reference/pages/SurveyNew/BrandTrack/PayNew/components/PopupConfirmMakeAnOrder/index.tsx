import { Box, Dialog } from "@mui/material";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle";
import Heading3 from "components/common/text/Heading3";
import ButtonClose from "components/common/buttons/ButtonClose";
import { DialogContentConfirm } from "components/common/dialogs/DialogContent";
import { DialogActionsConfirm } from "components/common/dialogs/DialogActions";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import ParagraphBody from "components/common/text/ParagraphBody";
import { memo } from "react";
import { Project } from "models/project";
import moment from "moment";
import { PaymentSchedulePreview } from "models/payment_schedule";
import useDateTime from "hooks/useDateTime"

interface PopupConfirmMakeAnOrderProps {
  project?: Project;
  isOpen: boolean;
  paymentSchedule: PaymentSchedulePreview;
  onCancel: () => void;
  onSubmit: () => void;
}

const PopupConfirmMakeAnOrder = memo((props: PopupConfirmMakeAnOrderProps) => {
  const { t } = useTranslation();

  const { onCancel, onSubmit, isOpen, project, paymentSchedule } = props;

  const _onCancel = () => {
    onCancel();
  };

  const _onSubmit = () => {
    onSubmit();
  };

  const { formatFullDate, formatMonthYear } = useDateTime()


  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={_onCancel}
      classes={{ paper: classes.paper }}
    >
      <DialogTitleConfirm className={classes.headerDialog}>
        <Box display="flex">
          <Heading3
            $colorName="--gray-90"
            translation-key="brand_track_select_start_date_title_modal_make_an_order"
          >
            {t("brand_track_select_start_date_title_modal_make_an_order")}
          </Heading3>
        </Box>
        <ButtonClose
          $backgroundColor="--eerie-black-5"
          $colorName="--eerie-black-40"
          onClick={_onCancel}
        />
      </DialogTitleConfirm>
      <DialogContentConfirm sx={{ paddingTop: "24px" }} dividers>
        <Box sx={{ paddingTop: "24px" }}>
          <ParagraphBody
            $colorName="--eerie-black"
            className={classes.description}
            translation-key="brand_track_select_start_date_content_modal_make_an_order_des_1"
            dangerouslySetInnerHTML={{
              __html: t(
                "brand_track_select_start_date_content_modal_make_an_order_des_1",
                {
                  project: project?.name,
                }
              ),
            }}
          ></ParagraphBody>
          <ParagraphBody
            pt={3}
            $colorName="--eerie-black"
            className={classes.description}
            translation-key="brand_track_select_start_date_content_modal_make_an_order_des_2"
            dangerouslySetInnerHTML={{
              __html: t(
                "brand_track_select_start_date_content_modal_make_an_order_des_2",
                {
                  date: formatMonthYear(paymentSchedule?.startDate),
                }
              ),
            }}
          ></ParagraphBody>
          <ParagraphBody
            pt={3}
            $colorName="--eerie-black"
            className={classes.description}
            translation-key="brand_track_select_start_date_content_modal_make_an_order_des_3"
            dangerouslySetInnerHTML={{
              __html: t("brand_track_select_start_date_content_modal_make_an_order_des_3", {
                date: formatFullDate(paymentSchedule?.dueDate),
                scheduledMonths: paymentSchedule?.scheduledMonths,
              }),
            }}
          ></ParagraphBody>
        </Box>
      </DialogContentConfirm>
      <DialogActionsConfirm>
        <Button
          btnType={BtnType.Secondary}
          onClick={_onCancel}
          translation-key="common_cancel"
        >
          {t("common_cancel")}
        </Button>
        <Button
          btnType={BtnType.Raised}
          children={
            <TextBtnSmall translation-key="brand_track_select_start_date_button_make_an_order">
              {t("brand_track_select_start_date_button_make_an_order")}
            </TextBtnSmall>
          }
          type="submit"
          onClick={_onSubmit}
        />
      </DialogActionsConfirm>
    </Dialog>
  );
});
export default PopupConfirmMakeAnOrder;
