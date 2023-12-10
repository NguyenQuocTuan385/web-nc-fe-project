import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { memo, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from "yup";
import { ApikeyFormData } from "../../Create";
import { Apikey } from "models/Admin/apikey";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import classes from "./styles.module.scss";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DatePicker } from "@mui/x-date-pickers";
import ErrorMessage from "components/common/text/ErrorMessage";
import { classesInputs } from "components/Inputs";
import ParagraphSmall from "components/common/text/ParagraphSmall";

const schema = yup.object().shape({
  name: yup.string().required("Name is required."),
  expiredTime: yup
    .date()
    .required()
    .min(moment(), "Expired time is greater than current date."),
});

interface Props {
  title: string;
  itemEdit?: Apikey;
  onSubmit: (data: ApikeyFormData) => void;
}

const APIKeyForm = memo(({ title, itemEdit, onSubmit }: Props) => {
  
  const dispatch = useDispatch();
  const [showApikey, setShowApikey] = useState<boolean>();

  const getCreateApiKey = () => {
    var apiKey = uuidv4();
    return "key-" + apiKey.replace(/-/g, "");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<ApikeyFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      key: getCreateApiKey(),
      expiredTime: moment().add(1, "years").toDate(),
    },
  });

  const valueKey = watch("key");

  const handleBack = () => {
    dispatch(push(routes.admin.apikey.root));
  };

  const _onSubmit = (data: ApikeyFormData) => {
    onSubmit(data);
  };

  const actionEye = () => {
    setShowApikey(!showApikey);
  };

  const actionRefreshKey = () => {
    setValue("key", getCreateApiKey());
  };

  const keyShow = useMemo(() => {
    return !showApikey ? `********************************${valueKey.slice(-4)}` : valueKey;
  },[showApikey, valueKey])

  useEffect(() => {
    if (itemEdit) {
      reset({
        name: itemEdit.name,
        key: itemEdit.key,
        description: itemEdit.description,
        expiredTime: itemEdit.expiredTime,
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
                  API Key
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Name"
                      name="name"
                      type="text"
                      inputRef={register("name")}
                      errorMessage={errors.name?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      className={classes.inputKey}
                      title="Key"
                      type="text"
                      disabled
                      value={keyShow}
                      endAdornment={
                        <InputAdornment position="end">
                          <div className={classes.groupIcon}>
                            <IconButton
                              sx={{ marginRight: "5px" }}
                              onClick={actionEye}
                              edge="end"
                            >
                              {!showApikey ? (
                                <VisibilityIcon />
                              ) : (
                                <VisibilityOffIcon />
                              )}
                            </IconButton>
                            <IconButton>
                              <RefreshIcon onClick={actionRefreshKey} />
                            </IconButton>
                          </div>
                        </InputAdornment>
                      }
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
                  <Grid item xs={12} sm={6}>
                    <ParagraphSmall
                      $colorName="--cimigo-theme-light-on-surface"
                      $fontWeight={500}
                    >
                      Expired Time
                    </ParagraphSmall>
                    <Controller
                      name="expiredTime"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          value={field.value}
                          onChange={field.onChange}
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              {...params}
                              classes={{ root: classesInputs.inputTextfield }}
                            />
                          )}
                        />
                      )}
                    />
                    {!!errors.expiredTime && (
                      <ErrorMessage>{errors.expiredTime.message}</ErrorMessage>
                    )}
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

export default APIKeyForm;
