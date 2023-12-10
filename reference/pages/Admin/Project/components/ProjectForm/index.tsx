import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import Inputs, { classesInputs } from "components/Inputs";
import { push } from "connected-react-router";
import { memo, useEffect } from "react"
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { OptionItem } from "models/general";
import InputSelect from "components/InputsSelect";
import { Project, projectStatus } from "models/project";
import { FileUpload } from "models/attachment";
import TextTitle from "components/Inputs/components/TextTitle";
import UploadFile from "components/UploadFile";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ErrorMessage from "components/common/text/ErrorMessage";
import moment from "moment";
import { ESOLUTION_TYPE } from 'models/solution';


const schema = yup.object().shape({
  status: yup.object().required('Status is required.'),
  dataStudio: yup.string().nullable().notRequired(),
  report: yup.mixed().nullable().notRequired(),
  invoice: yup.mixed().nullable().notRequired(),
  reportReadyDate: yup.string().nullable().notRequired()
})

export interface ProjectFormData {
  dataStudio: string,
  report: FileUpload,
  status: OptionItem,
  invoice: FileUpload;
  reportReadyDate: string;
}

interface Props {
  itemEdit: Project;
  onSubmit: (data: FormData) => void
}

const ProjectForm = memo(({ itemEdit, onSubmit }: Props) => {
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<ProjectFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const handleBack = () => {
    dispatch(push(routes.admin.project.root))
  }

  const _onSubmit = (data: ProjectFormData) => {
    if (!itemEdit) return
    const form = new FormData()
    form.append('reportReadyDate', data.reportReadyDate ? moment(data.reportReadyDate).format('YYYY-MM-DD') : '')
    if (data.dataStudio) form.append('dataStudio', data.dataStudio)
    if (data.report?.file) form.append('reports', data.report.file)
    if (!data.report || data.report?.file) form.append('deleteReport', 'true')
    if (data.invoice?.file) form.append('invoice', data.invoice.file)
    if (!data.invoice || data.invoice?.file) form.append('deleteInvoice', 'true')
    if (itemEdit.status !== data.status.id) {
      form.append('status', `${data.status.id}`)
    }
    onSubmit(form)
  }

  useEffect(() => {
    if (itemEdit) {
      let report: FileUpload
      if (itemEdit.reports?.length) {
        report = {
          id: itemEdit.reports[0].id,
          fileName: itemEdit.reports[0].fileName,
          fileSize: itemEdit.reports[0].fileSize,
          mimeType: itemEdit.reports[0].mimeType,
          url: itemEdit.reports[0].url,
        }
      }
      let invoice: FileUpload
      if (itemEdit.invoice) {
        invoice = {
          id: itemEdit.invoice.id,
          fileName: itemEdit.invoice.fileName,
          fileSize: itemEdit.invoice.fileSize,
          mimeType: itemEdit.invoice.mimeType,
          url: itemEdit.invoice.url,
        }
      }
      reset({
        dataStudio: itemEdit.dataStudio,
        status: projectStatus.find(it => it.id === itemEdit.status),
        report: report,
        invoice: invoice,
        reportReadyDate: itemEdit.reportReadyDate || null
      })
    }
  }, [reset, itemEdit])

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          Edit project
        </Typography>
        <Box display="flex" alignContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleBack}
            startIcon={<ArrowBackOutlined />}
          >
            Back
          </Button>
        </Box>
      </Box>
      <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card elevation={3} >
              <CardContent>
                <Typography component="h2" variant="h6" align="left" sx={{ marginBottom: "2rem" }}>
                  Project
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Data studio"
                      name="title"
                      type="text"
                      inputRef={register('dataStudio')}
                      errorMessage={errors.dataStudio?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Status"
                      name="status"
                      control={control}
                      translationData={"project_status_completed"}
                      selectProps={{
                        menuPosition: 'fixed',
                        options: projectStatus,
                        placeholder: "Select status",
                      }}
                      errorMessage={(errors.status as any)?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextTitle>Report ready date</TextTitle>
                    <Controller
                      name="reportReadyDate"
                      control={control}
                      render={({ field }) => <DatePicker
                        inputFormat="DD/MM/YYYY"
                        value={field.value}
                        onChange={field.onChange}
                        renderInput={(params) => <TextField fullWidth {...params}  classes={{ root: classesInputs.inputTextfield }}/>}
                      />}
                    />
                    {!!errors.reportReadyDate && (<ErrorMessage>{errors.reportReadyDate.message}</ErrorMessage>)}
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
                  <Grid item xs={12}>
                    <TextTitle>Invoice</TextTitle>
                    <Controller
                      name="invoice"
                      control={control}
                      render={({ field }) => <UploadFile
                        value={field.value}
                        caption="Allowed pdf"
                        typeInvalidMess="File type must be pdf"
                        fileFormats={['application/pdf']}
                        errorMessage={(errors.invoice as any)?.message}
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </div>
  )
})

export default ProjectForm