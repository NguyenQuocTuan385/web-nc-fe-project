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
import { SampleSize } from "models/Admin/sample_size";

const schema = yup.object().shape({
  limit: yup.number()
    .typeError('Limit is required.')
    .positive('Limit must be a positive number')
    .required('Limit is required.'),
  price: yup.number()
    .typeError('Price is required.')
    .positive('Price must be a positive number')
    .required('Price is required.')
})

export interface SampleSizeFormData {
  limit: number;
  price: number;
}

interface Props {
  solutionId: number,
  itemEdit?: SampleSize;
  onSubmit: (data: SampleSizeFormData) => void
}

const SampleSizeForm = memo(({ solutionId, itemEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SampleSizeFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const handleBack = () => {
    dispatch(push(routes.admin.solution.sampleSize.root.replace(":solutionId", `${solutionId}`)))
  }

  const _onSubmit = (data: SampleSizeFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        limit: itemEdit.limit,
        price: itemEdit.price
      })
    }
  }, [reset, itemEdit])

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          {itemEdit ? 'Edit sample size' : 'Create sample size'}
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
            <Card elevation={3} sx={{ overflow: "unset" }}>
              <CardContent>
                <Typography component="h2" variant="h6" align="left" sx={{ marginBottom: "2rem" }}>
                  Samp Size
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Limit"
                      name="limit"
                      type="number"
                      inputRef={register('limit')}
                      errorMessage={errors.limit?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Unit price"
                      name="price"
                      type="number"
                      inputRef={register('price')}
                      errorMessage={errors.price?.message}
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

export default SampleSizeForm