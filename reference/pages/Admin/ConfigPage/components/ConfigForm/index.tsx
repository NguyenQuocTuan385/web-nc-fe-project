import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { push } from "connected-react-router";
import { memo, useEffect } from "react"
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { ConfigAttributes, ConfigType } from "models/config";
import { FileUpload } from "models/attachment";
import UploadFile from "components/UploadFile";
import InputTextfield from "components/common/inputs/InputTextfield";
import TextTitle from "components/common/text/TextTitle";

const schema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  type: yup.string().required('Type is required.'),
  valueNumber: yup.number()
    .when('type', {
      is: (val: string) => val === ConfigType.number,
      then: yup.number().typeError('Value is required.').required('Value is required.'),
      otherwise: yup.number().notRequired()
    }),
  valueFile: yup.mixed().nullable().notRequired()
    .when('type', {
      is: (val: string) => val === ConfigType.attachment,
      then: yup.mixed().required('File is required.'),
      otherwise: yup.mixed().nullable().notRequired()
    }),
})

export interface ConfigFormData {
  name: string,
  type?: string;
  value?: any;
  valueNumber?: number;
  valueFile?: FileUpload;
}

interface Props {
  title: string;
  itemEdit?: ConfigAttributes;
  onSubmit: (data: FormData) => void;
}

const ConfigForm = memo(({ title, itemEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm<ConfigFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      valueNumber: 0
    }
  });

  const handleBack = () => {
    dispatch(push(routes.admin.config.root))
  }

  const _onSubmit = (data: ConfigFormData) => {
    const _data = new FormData();
    _data.append("name", data.name);
    switch (data.type) {
      case ConfigType.number:
        _data.append("value", `${data.valueNumber}`);
        break;
      case ConfigType.attachment:
        if (data.valueFile?.file) _data.append('file', data.valueFile.file)
        break;
    }
    onSubmit(_data)
  }

  useEffect(() => {
    if (itemEdit) {
      let valueNumber = 0
      let valueFile: FileUpload
      switch (itemEdit.type) {
        case ConfigType.number:
          valueNumber = Number(itemEdit.value)
          break;
        case ConfigType.attachment:
          if (itemEdit.attachment) {
            valueFile = {
              id: itemEdit.attachment.id,
              fileName: itemEdit.attachment.fileName,
              fileSize: itemEdit.attachment.fileSize,
              mimeType: itemEdit.attachment.mimeType,
              url: itemEdit.attachment.url,
            }
          }
          break;
      }
      reset({
        name: itemEdit.name,
        type: itemEdit.type,
        valueNumber,
        valueFile
      })
    }
  }, [reset, itemEdit])

  const type = watch("type")

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          {title}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          startIcon={<ArrowBackOutlined />}
        >
          Back
        </Button>
      </Box>
      <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card elevation={3} sx={{ overflow: "unset" }}>
              <CardContent>
                <Typography component="h2" variant="h6" align="left" sx={{ marginBottom: "2rem" }}>
                  Config
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <InputTextfield
                      title="Name"
                      name="name"
                      type="text"
                      inputRef={register('name')}
                      errorMessage={errors.name?.message}
                    />
                  </Grid>
                  <Controller
                    name="valueNumber"
                    key="valueNumber1"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Grid item xs={12} sm={6} hidden={type !== ConfigType.number}>
                          <InputTextfield
                            title='Value'
                            placeholder='Enter value'
                            errorMessage={errors.valueNumber?.message}
                            name={field.name}
                            value={field.value || ''}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                          />
                        </Grid>
                      )
                    }}
                  />
                  <Controller
                    name="valueFile"
                    key="valueFile1"
                    control={control}
                    render={({ field }) => (
                      <Grid item xs={12} sm={6} hidden={type !== ConfigType.attachment}>
                        <TextTitle invalid={(errors.valueFile as any)?.message}>File</TextTitle>
                        <UploadFile
                          value={field.value}
                          caption="Allowed pdf"
                          typeInvalidMess="File type must be pdf"
                          fileFormats={['application/pdf']}
                          errorMessage={(errors.valueFile as any)?.message}
                          onChange={(value) => field.onChange(value)}
                        />
                      </Grid>
                    )}
                  />
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

export default ConfigForm