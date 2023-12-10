import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, QuestionAnswer, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { memo, useEffect } from "react"
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { OptionItem } from "models/general";
import InputSelect from "components/InputsSelect";
import { TargetQuestion, targetQuestionRenderTypes, targetQuestionTypes } from "models/Admin/target";
import TextTitle from "components/Inputs/components/TextTitle";

const schema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  title: yup.string().required('Title is required.'),
  order: yup.number().typeError('Order is required.').required('Order is required.'),
  code: yup.string(),
  answerGroupName: yup.string(),
  typeId: yup.object().shape({
    id: yup.number().required('Type is required.'),
    name: yup.string().required()
  }).required(),
  renderTypeId: yup.object().shape({
    id: yup.number().required('Render type is required.'),
    name: yup.string().required()
  }).required(),
  showOptionAll: yup.boolean().required()
})

export interface QuestionFormData {
  name: string;
  title: string;
  order: number;
  code?: string;
  answerGroupName: string;
  typeId: OptionItem;
  renderTypeId: OptionItem;
  showOptionAll: boolean;
}

interface Props {
  title: string;
  langEdit?: string;
  itemEdit?: TargetQuestion;
  onSubmit: (data: QuestionFormData) => void
}

const QuestionForm = memo(({ title, itemEdit, langEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<QuestionFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      order: 99,
      showOptionAll: false
    }
  });

  const handleBack = () => {
    dispatch(push(routes.admin.target.question.root))
  }

  const _onSubmit = (data: QuestionFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        name: itemEdit.name,
        title: itemEdit.title,
        order: itemEdit.order,
        code: itemEdit.code,
        answerGroupName: itemEdit.answerGroupName,
        typeId: itemEdit.type ? { id: itemEdit.type.id, name: itemEdit.type.name } : undefined,
        renderTypeId: itemEdit.renderType ? { id: itemEdit.renderType.id, name: itemEdit.renderType.name } : undefined,
        showOptionAll: itemEdit.showOptionAll
      })
    }
  }, [reset, itemEdit])

  const onRedirectAnswers = () => {
    if (!itemEdit) return
    dispatch(push(routes.admin.target.question.answer.root.replace(":id", `${itemEdit.id}`)))
  }

  const onRedirectAnswerGroups = () => {
    if (!itemEdit) return
    dispatch(push(routes.admin.target.question.answerGroup.root.replace(":id", `${itemEdit.id}`)))
  }

  const onRedirectAnswerSuggestions = () => {
    if (!itemEdit) return
    dispatch(push(routes.admin.target.question.answerSuggestion.root.replace(":id", `${itemEdit.id}`)))
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          {title}
        </Typography>
        <Box display="flex" alignContent="center">
          {itemEdit && (
            <>
              <Button
                sx={{ marginRight: 2 }}
                variant="contained"
                color="primary"
                onClick={onRedirectAnswerSuggestions}
              >
                Suggestions
              </Button>
              <Button
                sx={{ marginRight: 2 }}
                variant="contained"
                color="primary"
                onClick={onRedirectAnswerGroups}
              >
                Answer Groups
              </Button>
              <Button
                sx={{ marginRight: 2 }}
                variant="contained"
                color="primary"
                onClick={onRedirectAnswers}
                startIcon={<QuestionAnswer />}
              >
                Answers
              </Button>
            </>
          )}
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
                  Question
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
                      title="Title"
                      name="title"
                      type="text"
                      inputRef={register('title')}
                      errorMessage={errors.title?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Answer group name (Show in quotas)"
                      name="answerGroupName"
                      type="text"
                      inputRef={register('answerGroupName')}
                      errorMessage={errors.answerGroupName?.message}
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
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Type"
                      name="typeId"
                      control={control}
                      selectProps={{
                        options: targetQuestionTypes,
                        placeholder: "Select type",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.typeId as any)?.id?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Render type"
                      name="renderTypeId"
                      control={control}
                      selectProps={{
                        options: targetQuestionRenderTypes,
                        placeholder: "Select render type",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.renderTypeId as any)?.id?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Code"
                      name="code"
                      type="text"
                      disabled={!!langEdit}
                      inputRef={register('code')}
                      errorMessage={errors.code?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextTitle>Show select all</TextTitle>
                    <FormControlLabel
                      control={
                        <Controller
                          name="showOptionAll"
                          control={control}
                          render={({ field }) => <Checkbox
                            checked={field.value}
                            {...field}
                            disabled={!!langEdit}
                          />}
                        />
                      }
                      label="Select all"
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

export default QuestionForm