import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { SolutionCategoryHome } from "models/Admin/solution";
import { memo, useEffect } from "react"
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import TextTitle from "components/Inputs/components/TextTitle";
import UploadImage from "components/UploadImage";

const schema = yup.object().shape({
  image: yup.mixed().required('Image is required.'),
  name: yup.string().required('Name is required.'),
})

export interface SolutionFormData {
  image: string | File;
  name: string,
}

interface SolutionFormProps {
  title: string;
  langEdit?: string;
  itemEdit?: SolutionCategoryHome;
  onSubmit: (data: FormData) => void
}

const SolutionForm = memo(({ title, itemEdit, langEdit, onSubmit }: SolutionFormProps) => {

  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<SolutionFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const handleBack = () => {
    dispatch(push(routes.admin.solutionCategoryHome.root))
  }

  const _onSubmit = (data: SolutionFormData) => {
    const formData = new FormData()
    formData.append('name', data.name)
    if (data.image && typeof data.image === 'object') formData.append('image', data.image)
    if (langEdit) formData.append('language', langEdit)

    onSubmit(formData)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        image: itemEdit.image,
        name: itemEdit.name,
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
            <Card elevation={3} >
              <CardContent>
                <Typography component="h2" variant="h6" align="left" sx={{ marginBottom: "2rem" }}>
                  Solution Category Home
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <Grid item xs={12} sm={6}>
                      <TextTitle invalid={errors.image?.message}>Image</TextTitle>
                      <Controller
                        name="image"
                        control={control}
                        render={({ field }) => <UploadImage
                          square
                          file={field.value}
                          errorMessage={errors.image?.message}
                          onChange={(value) => field.onChange(value)}
                        />}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Name"
                      name="name"
                      type="text"
                      inputRef={register('name')}
                      errorMessage={errors.name?.message}
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

export default SolutionForm