import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import ParagraphSmall from "components/common/text/ParagraphSmall";
import moment from "moment"
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ErrorMessage from "components/common/text/ErrorMessage";
import Inputs, { classesInputs } from "components/Inputs";
import {
    GetPaymentSchedulePreview,
    PaymentSchedulePreview,
} from "models/payment_schedule";
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { formatOrdinalumbers } from "utils/formatNumber";
import { AdminPaymentScheduleService } from 'services/admin/payment_schedule';

interface RestartScheduleForm {
    paymentSchedules: {
        dueDate: Date,
        start: Date
        end: Date,
        amount: number,
    }[],
}
interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: RestartScheduleForm) => void;
    project: Project
}

const PopupRestartPaymentSchedule = (props: Props) => {
    const { isOpen, onClose, onSubmit, project } = props;
    const [startMonth, setStartMonth] = useState<Date>()
    const [previewList, setPreviewList] = useState<PaymentSchedulePreview[]>([])
    const dispatch = useDispatch()

    const previewPaymentSchedule = () => {
        const params: GetPaymentSchedulePreview = {
            projectId: project.id,
            startDate: moment(startMonth).startOf('month').toDate(),
        }
        dispatch(setLoading(true))
        AdminPaymentScheduleService.getPaymentScheduleRestartPreview(params)
            .then((res) => {
                reset({
                    paymentSchedules: res.data.map(it => ({
                        dueDate: moment(it.dueDate).toDate(),
                        start: moment(it.startDate).toDate(),
                        end: moment(it.endDate).toDate(),
                        amount: it.amount,
                    })),
                })
                setPreviewList(res.data)
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    const schema = useMemo(() => {
        return yup.object().shape({
            paymentSchedules: yup
                .array(
                    yup.object({
                        dueDate: yup.date().required("Due date is required").typeError("Due date is required"),
                        start: yup.date().required("Start date is required").typeError("Start date is required"),
                        end: yup.date().required("End date is required").typeError("End date is required"),
                        amount: yup.number().required("Amount is required"),
                    })
                )
                .required(),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<RestartScheduleForm>({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    const _onSubmit = (data: RestartScheduleForm) => {
        onSubmit(data)
        _onClose()
    };

    const _onClose = () => {
        reset()
        setPreviewList([])
        onClose()
    }

    const { fields: fieldsAttributes } = useFieldArray({
        control,
        name: "paymentSchedules"
    });

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
                        Restart payment schedule
                    </Heading3>
                    <ButtonCLose
                        $backgroundColor="--eerie-black-5"
                        $colorName="--eerie-black-40"
                        onClick={() => _onClose()}>
                    </ButtonCLose>
                </DialogTitle>
                <DialogContent dividers sx={{ marginBottom: "8px" }}>
                    <Grid container rowSpacing={2} columnSpacing={3}>
                        <Grid item xs={12}>
                            <ParagraphSmall $colorName="--gray-80">
                                Start date
                            </ParagraphSmall>
                            <DatePicker
                                views={['year', 'month']}
                                inputFormat="MM/YYYY"
                                value={startMonth}
                                onChange={setStartMonth}
                                renderInput={(params) => <TextField fullWidth {...params} classes={{ root: classesInputs.inputTextfield }} />}
                            />
                            <Button
                                btnType={BtnType.Primary}
                                type="button"
                                children={<TextBtnSmall>Get preview</TextBtnSmall>}
                                className={classes.btnPreview}
                                onClick={previewPaymentSchedule}
                            />
                        </Grid>
                        {
                            previewList?.length ? previewList.map((paymentSchedule, index) => (
                                <Grid item xs={12} key={paymentSchedule.order}>
                                    <ParagraphBody $fontWeight="600" $colorName="--gray-80">
                                        {formatOrdinalumbers(paymentSchedule.order, 'en')} payment schedule
                                    </ParagraphBody>
                                    <Grid item xs={12}>
                                        <ParagraphSmall $colorName="--gray-80">
                                            Start
                                        </ParagraphSmall>
                                        <Inputs
                                            className={classes.inputField}
                                            placeholder={"Start time"}
                                            value={moment(paymentSchedule.startDate).format("MM/YYYY")}
                                            type="text"
                                            autoComplete="off"
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ParagraphSmall $colorName="--gray-80">
                                            End
                                        </ParagraphSmall>
                                        <Inputs
                                            className={classes.inputField}
                                            placeholder={"End time"}
                                            value={moment(paymentSchedule.endDate).format("MM/YYYY")}
                                            type="text"
                                            autoComplete="off"
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ParagraphSmall $colorName="--gray-80">
                                            Amount
                                        </ParagraphSmall>
                                        <Inputs
                                            className={classes.inputField}
                                            placeholder={"Amount of payment schedule"}
                                            type="number"
                                            autoComplete="off"
                                            value={`${paymentSchedule.amount}`}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ParagraphSmall $colorName="--gray-80">
                                            VAT
                                        </ParagraphSmall>
                                        <Inputs
                                            className={classes.inputField}
                                            value={`${paymentSchedule.vat}`}
                                            type="text"
                                            autoComplete="off"
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ParagraphSmall $colorName="--gray-80">
                                            Total Amount
                                        </ParagraphSmall>
                                        <Inputs
                                            className={classes.inputField}
                                            value={`${paymentSchedule.totalAmount}`}
                                            type="number"
                                            autoComplete="off"
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ParagraphSmall $colorName="--gray-80">
                                            Due date
                                        </ParagraphSmall>
                                        <Controller
                                            name={`paymentSchedules.${index}.dueDate`}
                                            control={control}
                                            render={({ field }) => <DatePicker
                                                inputFormat="DD/MM/YYYY"
                                                value={field.value}
                                                onChange={field.onChange}
                                                renderInput={(params) => <TextField fullWidth {...params} classes={{ root: classesInputs.inputTextfield }} />}
                                            />}
                                        />
                                        {!!errors.paymentSchedules?.[index]?.dueDate?.message && (<ErrorMessage>{errors.paymentSchedules?.[index]?.dueDate?.message}</ErrorMessage>)}
                                    </Grid>
                                </Grid>
                            )) : null
                        }

                    </Grid>
                </DialogContent>
                <DialogActions className={classes.footer}>
                    <Button
                        btnType={BtnType.Secondary}
                        translation-key="common_cancel"
                        children={<TextBtnSmall>Cancel</TextBtnSmall>}
                        className={classes.btnCancel}
                        onClick={_onClose}
                    />
                    <Button
                        btnType={BtnType.Raised}
                        type="submit"
                        children={<TextBtnSmall>Save</TextBtnSmall>}
                        className={classes.btnSave}
                        disabled={!previewList?.length}
                    />
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PopupRestartPaymentSchedule;
