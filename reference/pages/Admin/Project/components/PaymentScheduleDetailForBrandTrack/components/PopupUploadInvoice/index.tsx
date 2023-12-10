import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Grid, Dialog, TextField } from "@mui/material";
import { Project } from "models/project";
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading3 from "components/common/text/Heading3";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import Button, { BtnType } from "components/common/buttons/Button";
import ButtonCLose from "components/common/buttons/ButtonClose";
import classes from "./styles.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PaymentSchedule } from "models/payment_schedule";
import moment from "moment"
import { Controller } from 'react-hook-form';
import UploadFile from "components/UploadFile";
import { FileUpload } from "models/attachment";

interface UploadInvoiceForm {
    invoice: FileUpload;
}
interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => void;
    paymentSchedule: PaymentSchedule;
}

const schema = yup.object().shape({
    invoice: yup.mixed().nullable().notRequired(),
})

const PopupUploadInvoice = (props: Props) => {
    const { isOpen, paymentSchedule, onClose, onSubmit } = props;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch,
    } = useForm<UploadInvoiceForm>({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    const _onSubmit = (data: UploadInvoiceForm) => {
        if (!paymentSchedule) return
        const form = new FormData()
        if (data.invoice?.file) form.append('invoice', data.invoice.file)
        onSubmit(form)
    };

    useEffect(() => {
        if (paymentSchedule) {

            let invoice: FileUpload
            if (paymentSchedule.invoice) {
                invoice = {
                    id: paymentSchedule.invoice.id,
                    fileName: paymentSchedule.invoice.fileName,
                    fileSize: paymentSchedule.invoice.fileSize,
                    mimeType: paymentSchedule.invoice.mimeType,
                    url: paymentSchedule.invoice.url,
                }
            }

            reset({
                invoice: invoice
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentSchedule])

    const _onClose = () => {
        reset({
            invoice: null
        });
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
                        Upload invoice ({moment(paymentSchedule?.start).format("MMM yyyy").toUpperCase()} - {moment(paymentSchedule?.end).format("MMM yyyy").toUpperCase()})
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
                            <Controller
                                name="invoice"
                                control={control}
                                render={({ field }) => <UploadFile
                                    value={field.value}
                                    caption="Allowed pdf"
                                    typeInvalidMess="File type must be pdf"
                                    fileFormats={['application/pdf']}
                                    errorMessage={(errors.invoice as any)?.message}
                                    onChange={(value) => field.onChange(value ?? null)}
                                />}
                            />
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

export default PopupUploadInvoice;
