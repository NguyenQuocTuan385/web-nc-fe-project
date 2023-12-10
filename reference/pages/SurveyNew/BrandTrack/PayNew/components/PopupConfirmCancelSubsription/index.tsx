import { Box, Dialog } from "@mui/material";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle";
import ButtonClose from "components/common/buttons/ButtonClose";
import { DialogContentConfirm } from "components/common/dialogs/DialogContent";
import { DialogActionsConfirm } from "components/common/dialogs/DialogActions";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import ParagraphBody from "components/common/text/ParagraphBody";
import { memo, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Heading4 from "components/common/text/Heading4";
import InputTextareaAutosize from "components/InputTextareaAutosize";
import moment from "moment";
import { PaymentSchedule } from "models/payment_schedule";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { PaymentScheduleService } from "services/payment_schedule";
import { useDispatch } from "react-redux";
import useDateTime from "hooks/useDateTime"

interface SubmitCancelSubsriptionFormData {
  reason: string;
}
interface PopupConfirmCancelSubsriptionProps {
  projectId: number;
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (reason: string) => void;
}

const PopupConfirmCancelSubsription = memo(
  (props: PopupConfirmCancelSubsriptionProps) => {

    const dispatch = useDispatch();

    const { t, i18n } = useTranslation();

    const { onCancel, onSubmit, isOpen, projectId } = props;

    const [dataLatestPaid, setDataLatestPaid] =
      useState<PaymentSchedule>();

    const schema = useMemo(() => {
      return yup.object().shape({
        name: yup.string().max(500, "Max 500 characters!"),
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

    const {
      register,
      formState: { errors },
      handleSubmit,
      reset,
    } = useForm<SubmitCancelSubsriptionFormData>({
      resolver: yupResolver(schema),
      mode: "onChange",
    });

    const _onCancel = () => {
      reset({
        reason: "",
      });
      onCancel();
    };

    const _onSubmit = (data: SubmitCancelSubsriptionFormData) => {
      if (!data) return;
      onSubmit(data.reason);
      reset({
        reason: "",
      });
    };

    useEffect(() => {
      const getLatestPaid = async () => {

        dispatch(setLoading(true));

        await PaymentScheduleService.getLatestPaidPaymentSchedule(projectId)
          .then((res) => {
            setDataLatestPaid(res.data);
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)));
      };
      getLatestPaid();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    const { formatFullDate, formatMonthYear } = useDateTime()

    return (
      <Dialog
        scroll="paper"
        open={isOpen}
        onClose={_onCancel}
        classes={{ paper: classes.paper }}
      >
        <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
          <DialogTitleConfirm className={classes.headerDialog}>
            <Box display="flex">
              <Heading4
                $colorName="--cimigo-blue-dark-3"
                translation-key="brand_track_your_next_payment_title_modal_cancel_subscription"
              >
                {t(
                  "brand_track_your_next_payment_title_modal_cancel_subscription"
                )}
              </Heading4>
            </Box>
            <ButtonClose
              $backgroundColor="--eerie-black-5"
              $colorName="--eerie-black-40"
              onClick={_onCancel}
            />
          </DialogTitleConfirm>
          <DialogContentConfirm dividers>
            {dataLatestPaid && moment(dataLatestPaid?.end).isAfter(moment()) ? (
              <ParagraphBody
                pt={3}
                className={classes.description}
                $colorName="--eerie-black"
                translation-key="brand_track_your_next_payment_content_modal_cancel_subscription_have_payment_des"
                dangerouslySetInnerHTML={{
                  __html: t(
                    "brand_track_your_next_payment_content_modal_cancel_subscription_have_payment_des",
                    {
                      endDate: formatMonthYear(dataLatestPaid?.end),
                    }
                  ),
                }}
              ></ParagraphBody>
            ) : (
              <ParagraphBody
                $colorName="--eerie-black"
                pt={3}
                className={classes.description}
                translation-key="brand_track_your_next_payment_content_modal_cancel_subscription_not_have_payment_des"
              >
                {t(
                  "brand_track_your_next_payment_content_modal_cancel_subscription_not_have_payment_des"
                )}
              </ParagraphBody>
            )}
            <InputTextareaAutosize
              name="reason"
              maxRows={10}
              minRows={3}
              translation-key="brand_track_your_next_payment_placeholder_input_reason"
              placeholder={t(
                "brand_track_your_next_payment_placeholder_input_reason"
              )}
              inputRef={register("reason")}
              errorMessage={errors.reason?.message}
              className={classes.inputTextarea}
            />
          </DialogContentConfirm>
          <DialogActionsConfirm>
            <Button
              btnType={BtnType.Secondary}
              onClick={_onCancel}
              children={
                <TextBtnSmall
                  $colorName={"--cimigo-blue"}
                  translation-key="brand_track_your_next_payment_title_button_keep_my_subscription"
                >
                  {t(
                    "brand_track_your_next_payment_title_button_keep_my_subscription"
                  )}
                </TextBtnSmall>
              }
            />
            <Button
              className={classes.btnStopMySubscription}
              children={
                <TextBtnSmall
                  $colorName={"--gray-10"}
                  translation-key="brand_track_your_next_payment_title_button_stop_my_subscription"
                >
                  {t(
                    "brand_track_your_next_payment_title_button_stop_my_subscription"
                  )}
                </TextBtnSmall>
              }
              type="submit"
            />
          </DialogActionsConfirm>
        </form>
      </Dialog>
    );
  }
);
export default PopupConfirmCancelSubsription;
