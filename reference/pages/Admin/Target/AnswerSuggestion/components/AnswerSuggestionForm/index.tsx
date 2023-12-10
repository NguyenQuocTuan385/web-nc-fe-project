import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { memo, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { TargetAnswer, TargetAnswerGroup, TargetAnswerSuggestion } from "models/Admin/target";
import { OptionItem } from "models/general";
import InputSelect from "components/InputsSelect";
import { TargetAnswerService } from "services/admin/target_answer";
import { setErrorMess } from "redux/reducers/Status/actionTypes";
import { TargetAnswerGroupService } from "services/admin/target_answer_group";

const schema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  order: yup.number().typeError('Order is required.').required('Order is required.'),
  answerIds: yup.array(yup.object().shape({
    id: yup.number(),
    name: yup.string()
  })).notRequired(),
  groupIds: yup.array(yup.object().shape({
    id: yup.number(),
    name: yup.string()
  })).notRequired()
})

export interface AnswerSuggestionFormData {
  name: string;
  order: number;
  answerIds: OptionItem[];
  groupIds: OptionItem[];
}

interface Props {
  title: string;
  questionId: number,
  langEdit?: string;
  itemEdit?: TargetAnswerSuggestion;
  onSubmit: (data: AnswerSuggestionFormData) => void
}

const AnswerSuggestionForm = memo(({ title, questionId, itemEdit, langEdit, onSubmit }: Props) => {

  const [answers, setAnswers] = useState<OptionItem[]>([]);
  const [groups, setGroups] = useState<OptionItem[]>([]);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<AnswerSuggestionFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleBack = () => {
    dispatch(push(routes.admin.target.question.answerSuggestion.root.replace(":id", `${questionId}`)))
  }

  const _onSubmit = (data: AnswerSuggestionFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        name: itemEdit.name,
        order: itemEdit.order,
        answerIds: itemEdit.answers?.map(it => ({ id: it.id, name: it.name })),
        groupIds: itemEdit.groups?.map(it => ({ id: it.id, name: it.name }))
      })
    }
  }, [reset, itemEdit])

  useEffect(() => {
    const fetchOption = async () => {
      TargetAnswerService.getAnswers({ take: 9999, questionId: questionId })
        .then(res => {
          setAnswers((res.data as TargetAnswer[]).map(it => ({ id: it.id, name: it.name })))
        })
        .catch((e) => dispatch(setErrorMess(e)))
      TargetAnswerGroupService.getAnswerGroups({ take: 9999, questionId: questionId })
        .then(res => {
          setGroups((res.data as TargetAnswerGroup[]).map(it => ({ id: it.id, name: it.name })))
        })
        .catch((e) => dispatch(setErrorMess(e)))
    }
    fetchOption()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                  Suggestion
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
                    <InputSelect
                      fullWidth
                      title="Answers"
                      name="answerIds"
                      control={control}
                      selectProps={{
                        isMulti: true,
                        options: answers,
                        placeholder: "Select answer",
                        isDisabled: !!langEdit
                      }}
                    //errorMessage={errors.answerIds?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Groups"
                      name="groupIds"
                      control={control}
                      selectProps={{
                        isMulti: true,
                        options: groups,
                        placeholder: "Select group",
                        isDisabled: !!langEdit
                      }}
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

export default AnswerSuggestionForm