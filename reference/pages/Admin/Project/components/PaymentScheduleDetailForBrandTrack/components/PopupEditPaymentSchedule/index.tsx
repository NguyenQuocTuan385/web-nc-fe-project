import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Grid, Dialog, TextField } from "@mui/material";
import { Project } from "models/project";
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading3 from "components/common/text/Heading3";
import ParagraphBody from "components/common/text/ParagraphBody"
import TextBtnSmall from "components/common/text/TextBtnSmall";
import Button, { BtnType } from "components/common/buttons/Button";
import ButtonCLose from "components/common/buttons/ButtonClose";
import classes from "./styles.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PaymentSchedule } from "models/payment_schedule";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import moment from "moment"
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ErrorMessage from "components/common/text/ErrorMessage";
import Inputs, { classesInputs } from "components/Inputs";
import { OptionItem } from "models/general";

interface PaymentScheduleForm {
    amount: number;
    dueDate: Date;
}
interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PaymentScheduleForm) => void;
    paymentSchedule: PaymentSchedule;
}

const PopupEditPaymentSchedule = (props: Props) => {
    const { isOpen, paymentSchedule, onClose, onSubmit } = props;


    const schema = useMemo(() => {
        return yup.object().shape({
          amount: yup.number().min(0, "Amount must be equal or greater than 0").required("Amount is required").typeError("Amount is required."),
          dueDate: yup.date().required("Due date is required").typeError("Invalid Date"),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<PaymentScheduleForm>({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    const _onSubmit = (data) => {
        onSubmit(data)
        onClose()
    };

    useEffect(() => {
        if (paymentSchedule) {
            reset({
                amount: paymentSchedule.amount,
                dueDate: paymentSchedule.dueDate,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    const _onClose = () => {
        onClose()
    }

    return (
        <Dialog
            scroll="paper"
            open={isOpen}
            onClose={() => _onClose()}
            classes={{ paper: classes.paper }}
        >
            <form className={classes.form} onSubmit={handleSubmit(_onSubmit)}>
                <DialogTitle $backgroundColor="--white">
                    <Heading3 $colorName="--gray-90">
                        Edit payment schedule ({moment(paymentSchedule?.start).format("MMM yyyy").toUpperCase()} - {moment(paymentSchedule?.end).format("MMM yyyy").toUpperCase()})
                    </Heading3>
                    <ButtonCLose
                        $backgroundColor="--eerie-black-5"
                        $colorName="--eerie-black-40"
                        onClick={() => _onClose()}>
                    </ButtonCLose>
                </DialogTitle>
                <DialogContent dividers sx={{ marginBottom: "8px" }}>
                    <Grid container rowSpacing={2} columnSpacing={3}>
                        <Grid item xs={12} md={6}>
                            <ParagraphSmall $colorName="--gray-80">
                                Amount
                            </ParagraphSmall>
                            <Inputs
                                className={classes.inputField}
                                placeholder={"Amount of payment schedule"}
                                type="number"
                                autoComplete="off"
                                inputRef={register("amount")}
                                errorMessage={errors.amount?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ParagraphSmall $colorName="--gray-80" translation-key="brand_track_field_brand_manufacturer">
                                Due Date
                            </ParagraphSmall>
                            <Controller
                                name="dueDate"
                                control={control}
                                render={({ field }) => <DatePicker
                                    inputFormat="DD/MM/YYYY"
                                    value={field.value}
                                    onChange={field.onChange}
                                    renderInput={(params) => <TextField fullWidth {...params} classes={{ root: classesInputs.inputTextfield }} />}
                                />}
                            />
                            {!!errors.dueDate && (<ErrorMessage>{errors.dueDate.message}</ErrorMessage>)}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.footer}>
                    <Button
                        btnType={BtnType.Secondary}
                        translation-key="common_cancel"
                        children={<TextBtnSmall>Cancel</TextBtnSmall>}
                        className={classes.btnCancel}
                        onClick={onClose}
                    />
                    <Button
                        btnType={BtnType.Raised}
                        type="submit"
                        children={<TextBtnSmall>Save</TextBtnSmall>}
                        className={classes.btnSave}
                    />
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PopupEditPaymentSchedule;
