import { Box, Grid, Button } from "@mui/material"
import { Project } from "models/project"
import { memo, useMemo, useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes"
import classes from './styles.module.scss'
import clsx from "clsx"
import { FileUpload } from "models/attachment";
import { AdminProjectService } from "services/admin/project"
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import TextTitle from "components/Inputs/components/TextTitle";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import Inputs from "components/Inputs";
import UploadFile from "components/UploadFile";

export interface Props {
    project?: Project,
}

export interface ProjectFormData {
    dataStudio: string,
    report: FileUpload,
}

const schema = yup.object().shape({
    dataStudio: yup.string().nullable().notRequired(),
    report: yup.mixed().nullable().notRequired(),
})


const TotalResultForm = memo(({ project }: Props) => {

    const dispatch = useDispatch()

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<ProjectFormData>({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });

    const onSubmit = (data: ProjectFormData) => {
        dispatch(setLoading(true))
        const form = new FormData()
        if (data.dataStudio) form.append('dataStudio', data.dataStudio)
        if (data.report?.file) form.append('reports', data.report.file)
        if (!data.report || data.report?.file) form.append('deleteReport', 'true')
        AdminProjectService.update(Number(project.id), form)
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    useEffect(() => {
        let report: FileUpload
        if (project.reports?.length) {
            report = {
                id: project.reports[0].id,
                fileName: project.reports[0].fileName,
                fileSize: project.reports[0].fileSize,
                mimeType: project.reports[0].mimeType,
                url: project.reports[0].url,
            }
        }
        reset({
            dataStudio: project.dataStudio,
            report: report,
        })
    }, [reset, project])

    return (
        <>
            <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Inputs
                            title="Data studio"
                            name="title"
                            type="text"
                            inputRef={register('dataStudio')}
                            errorMessage={errors.dataStudio?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextTitle>Report</TextTitle>
                        <Controller
                            name="report"
                            control={control}
                            render={({ field }) => <UploadFile
                                value={field.value}
                                errorMessage={(errors.report as any)?.message}
                                onChange={(value) => field.onChange(value)}
                            />}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={<Save />}
                    >
                        Save
                    </Button>
                </Box>
            </form>
        </>
    )
})

export default TotalResultForm