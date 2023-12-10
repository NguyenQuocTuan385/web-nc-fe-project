import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Grid, Dialog, TextField, FormControlLabel } from "@mui/material";
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
import { FileUpload } from "models/attachment";
import { ProjectResult } from "models/Admin/project_result";
import UploadFile from "components/UploadFile";
import InputCheckbox from 'components/common/inputs/InputCheckbox';

interface ProjectResultForm {
    month: Date,
    dataStudio: string,
    report: FileUpload,
    isReplacedDataStudio: boolean,
    isReplacedReport: boolean
}
interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData, itemId: number) => void;
    itemEdit: ProjectResult,
    project: Project
}

const PopupAddEditProjectResult = (props: Props) => {
    const { isOpen, itemEdit, project, onClose, onSubmit } = props;

    const schema = useMemo(() => {
        return yup.object().shape({
            dataStudio: yup.string().nullable().notRequired(),
            month: yup.date().nullable().typeError('Month is required').required('Month is required'),
            isReplacedDataStudio: yup.boolean().nullable().notRequired(),
            isReplacedReport: yup.boolean().nullable().notRequired(),
            report: yup.mixed().nullable().notRequired(),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<ProjectResultForm>({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            isReplacedReport: false,
            isReplacedDataStudio: false,
            month: null
        }
    });

    const _onSubmit = (data: ProjectResultForm) => {
        const form = new FormData()
        form.append('projectId', project.id.toString())
        form.append('month', moment(data.month).endOf('month').format('YYYY-MM-DD'))
        form.append('isReplacedReport', data.isReplacedReport ? 'true' : 'false')
        form.append('isReplacedDataStudio', data.isReplacedDataStudio ? 'true' : 'false')
        if (!data.report || data.report?.file) form.append('deleteReport', 'true')
        if (data.dataStudio) form.append('dataStudio', data.dataStudio)
        if (data.report?.file) form.append('report', data.report.file)
        onSubmit(form, itemEdit?.id)
        _onClose()
    };

    const resetForm = () => {
        reset({
            dataStudio: "",
            month: null,
            isReplacedReport: null,
            isReplacedDataStudio: null,
            report: null,
        })
    }

    useEffect(() => {
        if (itemEdit) {
            let report: FileUpload
            if (itemEdit?.report) {
                report = {
                    id: itemEdit.report.id,
                    fileName: itemEdit.report.fileName,
                    fileSize: itemEdit.report.fileSize,
                    mimeType: itemEdit.report.mimeType,
                    url: itemEdit.report.url,
                }
            }

            reset({
                dataStudio: itemEdit.dataStudio,
                month: itemEdit.month,
                isReplacedReport: itemEdit.isReplacedReport,
                isReplacedDataStudio: itemEdit.isReplacedDataStudio,
                report: report
            });
        }
        else {
            resetForm()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, itemEdit])

    const _onClose = () => {
        resetForm()
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
                        {
                            itemEdit ? `Edit report` : `Add report`
                        }
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
                                Data Studio
                            </ParagraphSmall>
                            <Inputs
                                className={classes.inputField}
                                placeholder={"Data Studio"}
                                type="text"
                                autoComplete="off"
                                inputRef={register("dataStudio")}
                                errorMessage={errors.dataStudio?.message}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ParagraphSmall $colorName="--gray-80">
                                Month
                            </ParagraphSmall>
                            <Controller
                                name="month"
                                control={control}
                                render={({ field }) => <DatePicker
                                    inputFormat="MM/YYYY"
                                    views={['month', 'year']}
                                    value={field.value}
                                    onChange={field.onChange}
                                    renderInput={(params) => <TextField fullWidth {...params} classes={{ root: classesInputs.inputTextfield }} />}
                                />}
                            />
                            {!!errors.month && (<ErrorMessage>{errors.month.message}</ErrorMessage>)}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="isReplacedReport"
                                        control={control}
                                        render={({ field }) =>
                                            <InputCheckbox
                                                checked={field.value}
                                                onChange={field.onChange}
                                            />}
                                    />
                                }
                                label={<>Replaced by total report</>}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="isReplacedDataStudio"
                                        control={control}
                                        render={({ field }) =>
                                            <InputCheckbox
                                                checked={field.value}
                                                onChange={field.onChange}
                                            />}
                                    />
                                }
                                label={<>Replaced by total data studio</>}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ParagraphSmall $colorName="--gray-80">
                                Report
                            </ParagraphSmall>
                            <Controller
                                name="report"
                                control={control}
                                render={({ field }) => <UploadFile
                                    value={field.value}
                                    errorMessage={(errors.report as any)?.message}
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
                        onClick={_onClose}
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

export default PopupAddEditProjectResult;
