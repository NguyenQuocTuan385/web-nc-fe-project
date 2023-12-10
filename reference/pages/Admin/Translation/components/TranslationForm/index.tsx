import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { memo, useEffect } from "react"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { langSupports, OptionItemT } from "models/general";
import InputSelect from "components/InputsSelect";
import { Translation } from "models/Admin/translation";

const schema = yup.object().shape({
  key: yup.string().required('Key is required.'),
  data: yup.string().required('Data is required.'),
  language: yup.object().shape({
    id: yup.string().required('Language is required.'),
    name: yup.string().required()
  }).required()
})

export interface TranslationFormData {
  key: string;
  data: string;
  language: OptionItemT<string>;
}

interface Props {
  title: string;
  itemEdit?: Translation;
  onSubmit: (data: TranslationFormData) => void
}

const TranslationForm = memo(({ title, itemEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<TranslationFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const handleBack = () => {
    dispatch(push(routes.admin.translation.root))
  }

  const _onSubmit = (data: TranslationFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (itemEdit) {
      const lang = langSupports.find(it => it.key === itemEdit.language)
      reset({
        key: itemEdit.key,
        data: itemEdit.data,
        language: lang ? { id: lang.key, name: lang.name } : undefined
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
                  Translation
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Key"
                      name="key"
                      type="text"
                      inputRef={register('key')}
                      errorMessage={errors.key?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Text"
                      name="data"
                      type="text"
                      inputRef={register('data')}
                      errorMessage={errors.data?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Language"
                      name="language"
                      control={control}
                      selectProps={{
                        options: langSupports.map(it => ({...it, id: it.key})),
                        placeholder: "Select language",
                      }}
                      errorMessage={(errors.language as any)?.id?.message}
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

export default TranslationForm