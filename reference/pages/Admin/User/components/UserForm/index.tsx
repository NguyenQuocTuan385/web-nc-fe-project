import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { memo, useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { OptionItem } from "models/general";
import InputSelect from "components/InputsSelect";
import { adminTypes, EAdminType, User } from "models/user";
import UploadImage from "components/UploadImage";
import CountryService from "services/country";
import { setErrorMess } from "redux/reducers/Status/actionTypes";
import { VALIDATION } from "config/constans";


export interface UserFormData {
  avatar: File | string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  countryId: OptionItem,
  isNotify: boolean,
  adminTypeId: OptionItem,
  verified: boolean,
  company: string,
  phone: string,
}

interface Props {
  itemEdit?: User;
  onSubmit: (data: FormData) => void
}

const UserForm = memo(({ itemEdit, onSubmit }: Props) => {

  const schema = useMemo(() => {
    return yup.object().shape({
      avatar: yup.mixed(),
      firstName: yup.string().required('First name is required.'),
      lastName: yup.string().required('Last name is required.'),
      email: yup.string().email('Please enter a valid email adress').required('Email is required.'),
      password: itemEdit ?
        yup.string() :
        yup.string().matches(VALIDATION.password, {
          message: 'Password must contains at least 8 characters, including at least one letter and one number and a special character.', excludeEmptyString: true
        })
          .required('Password is required.'),
      countryId: yup.object().required('Country is required.'),
      isNotify: yup.boolean(),
      adminTypeId: yup.object().required('Admin type is required.'),
      verified: yup.boolean(),
      company: yup.string().notRequired(),
      phone: yup.string().matches(VALIDATION.phone, { message: "Please enter a valid phone number.", excludeEmptyString: true }).notRequired()
    })
  }, [itemEdit])

  const dispatch = useDispatch();
  const [countries, setCountries] = useState<OptionItem[]>([])

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<UserFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      verified: true,
      isNotify: true
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      await CountryService.getCountries({ take: 9999 })
        .then(res => {
          setCountries(res.data || [])
        })
        .catch((e) => dispatch(setErrorMess(e)))
    }
    fetchData()
  }, [dispatch])

  const handleBack = () => {
    dispatch(push(routes.admin.user.root))
  }

  const _onSubmit = (data: UserFormData) => {
    const form = new FormData()
    form.append('firstName', data.firstName)
    form.append('lastName', data.lastName)
    form.append('email', data.email)
    form.append('countryId', `${data.countryId.id}`)
    form.append('isNotify', `${data.isNotify}`)
    form.append('company', data.company)
    form.append('phone', data.phone)
    if(!itemEdit || itemEdit?.adminTypeId !== EAdminType.SUPER_ADMIN) {
      form.append('adminTypeId', `${data.adminTypeId.id}`)
      form.append('verified', `${data.verified}`)
    }
    if (!itemEdit) form.append('password', data.password)
    if (typeof data.avatar === 'object') form.append('avatar', data.avatar)
    onSubmit(form)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        avatar: itemEdit.avatar,
        firstName: itemEdit.firstName || '',
        lastName: itemEdit.lastName || '',
        email: itemEdit.email || '',
        password: itemEdit.password || '',
        countryId: itemEdit.country ? { id: itemEdit.country.id, name: itemEdit.country.name } : undefined,
        isNotify: itemEdit.isNotify,
        adminTypeId: itemEdit.admin_type ? { id: itemEdit.admin_type.id, name: itemEdit.admin_type.name } : undefined,
        verified: itemEdit.verified,
        company: itemEdit.company || '',
        phone: itemEdit.phone || '',
      })
    }
  }, [reset, itemEdit])

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          {itemEdit ? 'Edit user' : 'Create user'}
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
          <Grid item xs={12} md={4}>
            <Card elevation={3} >
              <Box sx={{ my: 10, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <Controller
                  name="avatar"
                  control={control}
                  render={({ field }) => <UploadImage
                    square
                    file={field.value}
                    errorMessage={errors.avatar?.message}
                    onChange={(value) => field.onChange(value)}
                  />}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card elevation={3} >
              <CardContent>
                <Typography component="h2" variant="h6" align="left" sx={{ marginBottom: "2rem" }}>
                  User
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="First Name"
                      name="firstName"
                      type="text"
                      inputRef={register('firstName')}
                      errorMessage={errors.firstName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Last Name"
                      name="lastName"
                      type="text"
                      inputRef={register('lastName')}
                      errorMessage={errors.lastName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Email"
                      name="email"
                      type="text"
                      inputRef={register('email')}
                      errorMessage={errors.email?.message}
                    />
                  </Grid>
                  {!itemEdit && (
                    <Grid item xs={12} sm={6}>
                      <Inputs
                        title="Password"
                        name="password"
                        type="password"
                        showEyes
                        inputRef={register('password')}
                        errorMessage={errors.password?.message}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Company"
                      name="company"
                      type="text"
                      inputRef={register('company')}
                      errorMessage={errors.company?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Phone"
                      name="phone"
                      type="text"
                      inputRef={register('phone')}
                      errorMessage={errors.phone?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Country"
                      name="countryId"
                      control={control}
                      selectProps={{
                        menuPosition: 'fixed',
                        options: countries,
                        placeholder: "Select country",
                      }}
                      errorMessage={(errors.countryId as any)?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="User Type"
                      name="adminTypeId"
                      control={control}
                      selectProps={{
                        isDisabled: itemEdit?.adminTypeId === EAdminType.SUPER_ADMIN,
                        menuPosition: 'fixed',
                        options: adminTypes,
                        placeholder: "Select user type",
                      }}
                      errorMessage={(errors.adminTypeId as any)?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Controller
                          name="verified"
                          control={control}
                          render={({ field }) => <Checkbox
                            checked={field.value}
                            {...field}
                          />}
                        />
                      }
                      label="Verified user"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Controller
                          name="isNotify"
                          control={control}
                          render={({ field }) => <Checkbox
                            checked={field.value}
                            {...field}
                          />}
                        />
                      }
                      label="Receive email updates on new product annoucements"
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

export default UserForm