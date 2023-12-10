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
import { TargetAnswerGroup } from "models/Admin/target";

const schema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  order: yup.number().typeError('Order is required.').required('Order is required.'),
})

export interface AnswerGroupFormData {
  name: string;
  order: number;
}

interface Props {
  title: string;
  questionId: number,
  langEdit?: string;
  itemEdit?: TargetAnswerGroup;
  onSubmit: (data: AnswerGroupFormData) => void
}

const AnswerGroupForm = memo(({ title, questionId, itemEdit, langEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AnswerGroupFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      order: 99
    }
  });

  const handleBack = () => {
    dispatch(push(routes.admin.target.question.answerGroup.root.replace(":id", `${questionId}`)))
  }

  const _onSubmit = (data: AnswerGroupFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        name: itemEdit.name,
        order: itemEdit.order
      })
    }
  }, [reset, itemEdit])

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          {title}
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
                  Answer Group
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Name"
                      name="name"
                      type="text"
                      inputRef={register('name')}
                      errorMessage={errors.name?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Order"
                      name="order"
                      type="number"
                      disabled={!!langEdit}
                      inputRef={register('order')}
                      errorMessage={errors.order?.message}
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

export default AnswerGroupForm