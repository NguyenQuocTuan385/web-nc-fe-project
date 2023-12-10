import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, Typography, FormControlLabel } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { memo, useEffect } from "react"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { OptionItemT } from "models/general";
import InputCreatableSelect from "components/InputCreatableSelect";
import { EmailTemplate } from "models/Admin/email_template";
import InputTextareaAutosize from "components/InputTextareaAutosize";
import { Controller } from 'react-hook-form';
import InputCheckbox from 'components/common/inputs/InputCheckbox';

const schema = yup.object().shape({
  subject: yup.string().required('Subject is required.'),
  content: yup.string().required('Content to is required.'),
  emailsTo: yup.array().min(1, 'Email to is required.').required('Email to is required.'),
  isEmailOwner: yup.boolean().nullable().notRequired(),
  isEmailEditor: yup.boolean().nullable().notRequired(),
  isEmailUserMakeOrder: yup.boolean().nullable().notRequired(),
})

export interface EmailTemplateFormData {
  subject: string;
  content: string;
  emailsTo: OptionItemT<string>[];
  isEmailOwner: boolean;
  isEmailEditor: boolean;
  isEmailUserMakeOrder: boolean;
}

interface Props {
  title: string;
  itemEdit?: EmailTemplate;
  onSubmit: (data: EmailTemplateFormData) => void
}

const EmailTemplateForm = memo(({ title, itemEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<EmailTemplateFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      isEmailOwner: false,
      isEmailEditor: false,
      isEmailUserMakeOrder: false
  }
  });

  const handleBack = () => {
    dispatch(push(routes.admin.emailTemplate.root))
  }

  const _onSubmit = (data: EmailTemplateFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        subject: itemEdit.subject,
        content: itemEdit.content,
        emailsTo: itemEdit.emailsTo?.map(it => ({ id: it, name: it })),
        isEmailOwner: itemEdit.isEmailOwner,
        isEmailEditor: itemEdit.isEmailEditor,
        isEmailUserMakeOrder: itemEdit.isEmailUserMakeOrder
      })
    }
  }, [reset, itemEdit])

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
                  Email Template
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Subject"
                      name="subject"
                      type="text"
                      inputRef={register('subject')}
                      errorMessage={errors.subject?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputCreatableSelect
                      email
                      fullWidth
                      title="Email to"
                      name="emailsTo"
                      control={control}
                      selectProps={{
                        options: [],
                        isClearable: true,
                        isMulti: true,
                        placeholder: "Select email to",
                      }}
                      errorMessage={(errors.emailsTo as any)?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Controller
                          name="isEmailOwner"
                          control={control}
                          render={({ field }) =>
                            <InputCheckbox
                              checked={field.value}
                              onChange={field.onChange}
                            />}
                        />
                      }
                      label={<>Email Owner</>}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Controller
                          name="isEmailEditor"
                          control={control}
                          render={({ field }) =>
                            <InputCheckbox
                              checked={field.value}
                              onChange={field.onChange}
                            />}
                        />
                      }
                      label={<>Email Editor</>}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Controller
                          name="isEmailUserMakeOrder"
                          control={control}
                          render={({ field }) =>
                            <InputCheckbox
                              checked={field.value}
                              onChange={field.onChange}
                            />}
                        />
                      }
                      label={<>Email User Make Order</>}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <InputTextareaAutosize
                      title="Content"
                      name="content"
                      maxRows={100}
                      minRows={10}
                      inputRef={register('content')}
                      errorMessage={errors.content?.message}
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

export default EmailTemplateForm