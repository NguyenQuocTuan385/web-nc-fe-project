import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from "yup";
import { Webhook, eventWebhooks } from "models/Admin/webhook";
import InputSelect from "components/InputsSelect";
import { WebHookFormData } from "../../Create";


interface Props {
  title: string;
  itemEdit?: Webhook;
  onSubmit: (data: WebHookFormData) => void;
}

const WebhookForm = memo(({ title, itemEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();


  const schema = yup.object().shape({
    event: yup.object().shape({
      id: yup.number().required(),
      name: yup.string().required()
    }).required("Event is required"),
    url: yup.string().url().required("Url is required"),
    description: yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<WebHookFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleBack = () => {
    dispatch(push(routes.admin.webhook.root));
  };

  const _onSubmit = (data: WebHookFormData) => {
    onSubmit(data)
  };

  useEffect(() => {
    if (itemEdit) {
      reset({
        event: eventWebhooks.find(it => it.id === itemEdit.eventId),
        url: itemEdit.url,
        description: itemEdit.description,
      });
    }
  }, [reset, itemEdit]);

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignContent="center"
        mb={4}
      >
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
                <Typography
                  component="h2"
                  variant="h6"
                  align="left"
                  sx={{ marginBottom: "2rem" }}
                >
                  Webhook
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Event"
                      name="event"
                      control={control}
                      selectProps={{
                        options: eventWebhooks,
                        placeholder: "Select Event",
                      }}
                      errorMessage={(errors.event as any)?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Url"
                      name="url"
                      type="text"
                      inputRef={register("url")}
                      errorMessage={errors.url?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Description"
                      name="description"
                      type="text"
                      inputRef={register("description")}
                      errorMessage={errors.description?.message}
                    />
                  </Grid>
                </Grid>
                <Box
                  sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                >
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
  );
});

export default WebhookForm;
