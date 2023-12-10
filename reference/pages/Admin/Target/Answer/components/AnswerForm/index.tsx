import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { memo, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { OptionItem } from "models/general";
import InputSelect from "components/InputsSelect";
import { TargetAnswer, TargetAnswerGroup } from "models/Admin/target";
import TextTitle from "components/Inputs/components/TextTitle";
import { TargetAnswerGroupService } from "services/admin/target_answer_group";
import { setErrorMess } from "redux/reducers/Status/actionTypes";

const schema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  order: yup.number().typeError('Order is required.').required('Order is required.'),
  code: yup.string(),
  description: yup.string(),
  exclusive: yup.bool(),
  groupId: yup.object().shape({
    id: yup.number(),
    name: yup.string()
  }).notRequired(),
})

export interface AnswerFormData {
  name: string;
  order: number;
  code?: string;
  description: string;
  groupId: OptionItem;
  exclusive: boolean;
}

interface Props {
  title: string;
  questionId: number,
  langEdit?: string;
  itemEdit?: TargetAnswer;
  onSubmit: (data: AnswerFormData) => void
}

const AnswerForm = memo(({ title, questionId, itemEdit, langEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();
  const [targetAnswerGroups, setTargetAnswerGroups] = useState<TargetAnswerGroup[]>([]);

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<AnswerFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      exclusive: false,
      order: 99
    }
  });

  const handleBack = () => {
    dispatch(push(routes.admin.target.question.answer.root.replace(":id", `${questionId}`)))
  }

  const _onSubmit = (data: AnswerFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        name: itemEdit.name,
        order: itemEdit.order,
        code: itemEdit.code,
        description: itemEdit.description,
        exclusive: itemEdit.exclusive,
        groupId: itemEdit.targetAnswerGroup ? { id: itemEdit.targetAnswerGroup.id, name: itemEdit.targetAnswerGroup.name } : undefined,
      })
    }
  }, [reset, itemEdit])

  useEffect(() => {
    const fetchOption = async () => {
      await TargetAnswerGroupService.getAnswerGroups({ take: 9999, questionId: questionId })
        .then((res) => {
          setTargetAnswerGroups(res.data.map((it: TargetAnswerGroup) => ({ id: it.id, name: it.name })))
        })
        .catch((e) => dispatch(setErrorMess(e)))
    }
    fetchOption()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

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
                  Answer
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
                      title="Description"
                      name="description"
                      type="text"
                      inputRef={register('description')}
                      errorMessage={errors.description?.message}
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
                      title="Group"
                      name="groupId"
                      control={control}
                      selectProps={{
                        options: targetAnswerGroups,
                        placeholder: "Select group",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.groupId as any)?.id?.message}
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
                    <TextTitle>Exclusive</TextTitle>
                    <FormControlLabel
                      control={
                        <Controller
                          name="exclusive"
                          control={control}
                          render={({ field }) => <Checkbox
                            checked={field.value}
                            {...field}
                            disabled={!!langEdit}
                          />}
                        />
                      }
                      label="Exclusive option"
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

export default AnswerForm