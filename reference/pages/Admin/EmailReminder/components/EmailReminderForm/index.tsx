import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, Typography, FormControlLabel } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { memo, useEffect } from "react"
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { EmailReminder } from "models/Admin/email_reminder";
import InputCheckbox from "components/common/inputs/InputCheckbox"
import ParagraphSmall from "components/common/text/ParagraphSmall";

const schema = yup.object().shape({
  title: yup.string().required('Title is required.'),
  numberOfDays: yup.number().integer('Number of days is an integer').min(0, 'Number of days must be greater or equal 0').required('Number of days is required.').typeError('Number of days is required.'),
  isSendUser: yup.bool(),
  isSendAdmin: yup.bool()
})

export interface EmailReminderFormData {
  title: string;
  numberOfDays: number;
  isSendUser: boolean;
  isSendAdmin: boolean;
}

interface Props {
  title: string;
  itemEdit?: EmailReminder;
  onSubmit: (data: EmailReminderFormData) => void
}

const EmailReminderForm = memo(({ title, itemEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<EmailReminderFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      isSendAdmin: true,
      isSendUser: true,
    }
  });

  const handleBack = () => {
    dispatch(push(routes.admin.emailReminder.root))
  }

  const _onSubmit = (data: EmailReminderFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        title: itemEdit.title,
        numberOfDays: itemEdit.numberOfDays,
        isSendAdmin: itemEdit.isSendAdmin,
        isSendUser: itemEdit.isSendUser
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
                  Email Reminder
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Title"
                      name="title"
                      type="text"
                      inputRef={register('title')}
                      errorMessage={errors.title?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Number of days"
                      name="numberOfDays"
                      type="text"
                      inputRef={register('numberOfDays')}
                      errorMessage={errors.numberOfDays?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Controller
                          name="isSendUser"
                          control={control}
                          render={({ field }) => <InputCheckbox
                            checkboxColorType={"blue"}
                            checked={field.value}
                            onChange={field.onChange}
                          />}
                        />
                      }
                      label={<ParagraphSmall>Send email for user</ParagraphSmall>}
                    />
                    <FormControlLabel
                      control={
                        <Controller
                          name="isSendAdmin"
                          control={control}
                          render={({ field }) => <InputCheckbox
                            checkboxColorType={"blue"}
                            checked={field.value}
                            onChange={field.onChange}
                          />}
                        />
                      }
                      label={<ParagraphSmall>Send email for admin</ParagraphSmall>}
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

export default EmailReminderForm