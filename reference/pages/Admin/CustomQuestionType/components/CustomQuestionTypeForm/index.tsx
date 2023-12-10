import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { memo, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { OptionItem, statuses } from "models/general";
import InputSelect from "components/InputsSelect";
import { CustomQuestionType } from "models/Admin/custom_question_type";
import { ECustomQuestionType } from "models/custom_question";

export interface CustomQuestionTypeFormData {
  title: string;
  order: number,
  price: number;
  priceAttribute: number;
  minAnswer: number;
  maxAnswer: number;
  maxAttribute: number;
  status: OptionItem;
}

interface Props {
  langEdit?: string;
  itemEdit?: CustomQuestionType;
  onSubmit: (data: CustomQuestionTypeFormData) => void
}

const CustomQuestionTypeForm = memo(({ itemEdit, langEdit, onSubmit }: Props) => {

  const dispatch = useDispatch()

  const schema = useMemo(() => {
    return yup.object().shape({
      title: yup.string()
        .required('Title is required.'),
      order: yup.number()
        .typeError('Order is required.')
        .required('Order is required.'),
      price: yup.number()
        .typeError('Price is required.')
        .positive('Price must be a positive number')
        .required('Price is required.'),
      priceAttribute: [ECustomQuestionType.Numeric_Scale, ECustomQuestionType.Smiley_Rating, ECustomQuestionType.Star_Rating].includes(itemEdit?.id ?? 0) ?
        yup.number().typeError('Attribute Price is required.').positive('Attribute Price must be a positive number').required('Attribute Price is required.') :
        yup.mixed().notRequired(),
      maxAttribute: [ECustomQuestionType.Numeric_Scale, ECustomQuestionType.Smiley_Rating, ECustomQuestionType.Star_Rating].includes(itemEdit?.id ?? 0) ?
        yup.number().integer('Min Attribute must be an integer').typeError('Min Attribute is required.').positive('Min Attribute must be a positive number').required('Min Attribute is required.') :
        yup.mixed().notRequired(),
      minAnswer: [ECustomQuestionType.Open_Question, ECustomQuestionType.Single_Choice, ECustomQuestionType.Multiple_Choices].includes(itemEdit?.id ?? 0) ?
        yup.number().integer('Min Answer must be an integer').typeError('Min Answer is required.').positive('Min Answer must be a positive number').required('Min Answer is required.') :
        yup.mixed().notRequired(),
      maxAnswer: [ECustomQuestionType.Open_Question, ECustomQuestionType.Single_Choice, ECustomQuestionType.Multiple_Choices].includes(itemEdit?.id ?? 0) ?
        yup.number().integer('Max Answer must be an integer').typeError('Max Answer is required.').positive('Max Answer must be a positive number').required('Max Answer is required.') :
        yup.mixed().notRequired(),
      status: yup.object().shape({
        id: yup.number().required('Status is required.'),
        name: yup.string().required()
      }).required(),
    })
  }, [itemEdit?.id])

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<CustomQuestionTypeFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const handleBack = () => {
    dispatch(push(routes.admin.customQuestionType.root))
  }

  const _onSubmit = (data: CustomQuestionTypeFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        title: itemEdit.title,
        order: itemEdit.order,
        price: itemEdit.price,
        priceAttribute: itemEdit.priceAttribute ?? 0,
        minAnswer: itemEdit.minAnswer ?? 0,
        maxAnswer: itemEdit.maxAnswer ?? 0,
        maxAttribute: itemEdit.maxAttribute ?? 0,
        status: statuses.find(temp => temp.id === itemEdit.status),
      })
    }
  }, [reset, itemEdit])

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          Edit custom question type
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
                  Custom question type
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Title"
                      name="start"
                      type="text"
                      inputRef={register('title')}
                      errorMessage={errors.title?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Price"
                      name="price"
                      type="number"
                      disabled={!!langEdit}
                      inputRef={register('price')}
                      errorMessage={errors.price?.message}
                    />
                  </Grid>
                  {[ECustomQuestionType.Numeric_Scale, ECustomQuestionType.Smiley_Rating, ECustomQuestionType.Star_Rating].includes(itemEdit?.id ?? 0) ? (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Attribute Price"
                          name="priceAttribute"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('priceAttribute')}
                          errorMessage={errors.priceAttribute?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Max Attribute"
                          name="maxAttribute"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('maxAttribute')}
                          errorMessage={errors.maxAttribute?.message}
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Min Answer"
                          name="minAnswer"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('minAnswer')}
                          errorMessage={errors.minAnswer?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Inputs
                          title="Max Answer"
                          name="maxAnswer"
                          type="number"
                          disabled={!!langEdit}
                          inputRef={register('maxAnswer')}
                          errorMessage={errors.maxAnswer?.message}
                        />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Status"
                      name="status"
                      control={control}
                      selectProps={{
                        options: statuses,
                        placeholder: "Select status",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={errors.status?.id?.message}
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

export default CustomQuestionTypeForm