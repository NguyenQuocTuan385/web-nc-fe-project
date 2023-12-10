import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Chip, Grid, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { memo, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { OptionItem } from "models/general";
import InputSelect from "components/InputsSelect";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { QuotaTable } from "models/Admin/quota";
import { TargetQuestionService } from "services/admin/target_question";
import { TargetAnswer, TargetQuestion } from "models/Admin/target";
import { TargetAnswerService } from "services/admin/target_answer";
import _ from "lodash";
import React from "react";

const schema = yup.object().shape({
  title: yup.string().required('Title is required.'),
  titleCell: yup.string().required('Title cell is required.'),
  order: yup.number().typeError('Order is required.').required('Order is required.'),
  questionIds: yup.array(yup.object().shape({
    id: yup.number(),
    name: yup.string()
  })).required('Questions is required.'),
})

export interface CalculationItem {
  answers: TargetAnswer[],
  isDefault?: boolean,
  original: number
}

export interface QuotaTableFormData {
  title: string;
  titleCell: string;
  order: number;
  questionIds: OptionItem[];
  calculations: {
    answerIds: number[]
    original: number,
    isDefault?: boolean
  }[];
}

interface Props {
  langEdit?: string;
  itemEdit?: QuotaTable;
  onSubmit: (data: QuotaTableFormData) => void
}

const QuotaTableForm = memo(({ itemEdit, langEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();
  const [targetQuestions, setTargetQuestions] = useState<OptionItem[]>([]);
  const [calculationsData, setCalculationsData] = useState<CalculationItem[]>([]);

  const { register, handleSubmit, formState: { errors, isValid }, reset, control, watch, setValue } = useForm<QuotaTableFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const handleBack = () => {
    dispatch(push(routes.admin.quotaTable.root))
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        title: itemEdit.title,
        titleCell: itemEdit.titleCell,
        order: itemEdit.order,
        questionIds: itemEdit.targetQuestions.map(it => ({ id: it.id, name: it.name }))
      })
    }
  }, [reset, itemEdit])

  useEffect(() => {
    const fetchOption = async () => {
      TargetQuestionService.getQuestions({ take: 9999 })
        .then((res) => {
          setTargetQuestions((res.data as TargetQuestion[]).map((it) => ({ id: it.id, name: it.name })))
        })
        .catch((e) => dispatch(setErrorMess(e)))
    }
    fetchOption()
  }, [dispatch])

  const questionsSelected = watch("questionIds")

  useEffect(() => {
    if (questionsSelected?.length) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        const apis = questionsSelected.map(async (item): Promise<TargetAnswer[]> => {
          return TargetAnswerService.getAnswers({ take: 999, questionId: item.id })
            .then(res => res.data)
        })
        Promise.all(apis)
          .then((res) => {
            const _questionsIds = questionsSelected.filter((_, index) => !!res[index]?.length)
            if (_questionsIds?.length !== questionsSelected?.length) {
              setValue('questionIds', _questionsIds)
              return
            }
            let _calculationsData: CalculationItem[] = []
            const getCalculationsData = (answers: TargetAnswer[] = [], i: number = 0) => {
              res[i].forEach(item => {
                if (res[i + 1]) {
                  getCalculationsData([...answers, item], i + 1)
                } else {
                  if (itemEdit) {
                    const answersTemp = [...answers, item]
                    const answerIds = answersTemp.map(it => it.id).sort()
                    const config = itemEdit.quotaCalculations.find(temp => _.isEqual(temp.answerIds.sort(), answerIds))
                    _calculationsData.push({ answers: [...answers, item], original: config?.original || 0, isDefault: config.isDefault })
                  } else {
                    _calculationsData.push({ answers: [...answers, item], original: 0, isDefault: false })
                  }
                }
              })
            }
            getCalculationsData()
            setCalculationsData(_calculationsData)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    } else setCalculationsData([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsSelected])

  const onChangeOriginal = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const _calculationsData = [...calculationsData]
    let original = null
    if (e.target.value !== '' && Number(e.target.value) >= 0) original = Number(e.target.value)
    _calculationsData[index].original = original
    setCalculationsData(_calculationsData)
  }

  const onChangeIsDefault = (index: number) => {
    const _calculationsData = [...calculationsData]
    _calculationsData[index].isDefault = !_calculationsData[index].isDefault
    setCalculationsData(_calculationsData)
  }

  const checkIsValid = () => {
    return isValid && !calculationsData.find(it => !isValidCalculation(it))
  }

  const _onSubmit = (data: QuotaTableFormData) => {
    if (!checkIsValid()) return
    onSubmit({
      ...data,
      calculations: calculationsData.map(it => ({
        answerIds: it.answers?.map(temp => temp.id),
        original: it.original || 0,
        isDefault: it.isDefault
      }))
    })
  }

  const isShowCheckBox = (answers: TargetAnswer[]) => {
    return !!answers.find(it => it.exclusive && it.targetAnswerGroup)
  }

  const isShowDefaultCol = useMemo(() => {
    return !!calculationsData.find(it => isShowCheckBox(it.answers))
  }, [calculationsData])

  const isValidCalculation = (item: CalculationItem) => {
    if (item.original) return true
    const iTargetAnswerHaveGroup = item.answers.findIndex(it => it.targetAnswerGroup)
    if (iTargetAnswerHaveGroup !== -1 && !isShowCheckBox(item.answers)) {
      const targetAnswerGroup = item.answers[iTargetAnswerHaveGroup].targetAnswerGroup
      return !!(calculationsData.find(row => {
        const exclusive = row.answers.find(answer => answer.exclusive && answer.targetAnswerGroup?.id === targetAnswerGroup.id)
        if (exclusive) {
          const answers = _.cloneDeep(item.answers)
          answers.splice(iTargetAnswerHaveGroup, 1, exclusive)
          return row.isDefault && _.isEqual(row.answers.map(it => it.id).sort(), answers.map(it => it.id).sort())
        }
        return false
      }))
    }
    return false
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          {itemEdit ? 'Edit Quota Table' : 'Create Quota Table'}
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
                  Quota Table
                </Typography>
                <Grid container spacing={2}>
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
                      title="Title cell"
                      name="titleCell"
                      type="text"
                      inputRef={register('titleCell')}
                      errorMessage={errors.titleCell?.message}
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
                      title="Questions"
                      name="questionIds"
                      control={control}
                      selectProps={{
                        isMulti: true,
                        options: targetQuestions,
                        placeholder: "Select questions",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.questionIds as any)?.message}
                    />
                  </Grid>
                  {(!!questionsSelected?.length && !!calculationsData?.length) && (
                    <Grid item xs={12}>
                      <TableContainer sx={{ marginTop: '2rem' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              {questionsSelected.map(item => (
                                <TableCell key={item.id}>{item.name}</TableCell>
                              ))}
                              {isShowDefaultCol && (
                                <TableCell>Default</TableCell>
                              )}
                              <TableCell>Original</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {calculationsData.map((item, index) => (
                              <TableRow key={index}>
                                {item.answers.map(answer => (
                                  <TableCell key={answer.id}>
                                    {answer.targetAnswerGroup && <Chip sx={{ marginRight: 1 }} label={answer.targetAnswerGroup.name} color="primary" variant="outlined" />}
                                    {answer.name}
                                  </TableCell>
                                ))}
                                {isShowDefaultCol && (
                                  <TableCell>
                                    {isShowCheckBox(item.answers) && (
                                      <Switch
                                        checked={!!item?.isDefault}
                                        onChange={() => onChangeIsDefault(index)}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                      />
                                    )}
                                  </TableCell>
                                )}
                                <TableCell>
                                  <Inputs
                                    name=""
                                    type="number"
                                    disabled={!!langEdit}
                                    isShowError={!isValidCalculation(item)}
                                    value={item.original ?? ''}
                                    onChange={(e) => onChangeOriginal(e, index)}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  )}
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!checkIsValid()}
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

export default QuotaTableForm