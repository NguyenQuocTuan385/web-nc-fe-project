import _ from "lodash";
import { TargetAnswer, TargetAnswerSuggestion, TargetQuestion } from "models/Admin/target"

export enum ETab {
  Location = "Location",
  Household_Income = "Household_Income",
  Age_Coverage = "Age_Coverage"
}
export interface TabItem {
  id: ETab,
  title: string,
  img: string
}

export interface SampleSizeItem {
  value: number,
  popular: boolean
}

export const _listSampleSize: SampleSizeItem[] = [
  { value: 100, popular: false },
  { value: 200, popular: true },
  { value: 300, popular: false },
]

export const _listEyeTrackingSampleSize: SampleSizeItem[] = [
  { value: 30, popular: false },
  { value: 50, popular: false },
  { value: 100, popular: false },
]

export interface CustomSampleSizeForm {
  sampleSize: number
}

export interface CustomEyeTrackingSampleSizeForm {
  eyeTrackingSampleSize: number
}

export interface DataSelected {
  [key: number]: TargetAnswer[]
}

export const onToggleAnswer = (questionId: number, answer: TargetAnswer, checked: boolean, dataSelected: DataSelected, setDataSelected: React.Dispatch<React.SetStateAction<{ [key: number]: TargetAnswer[]; }>>) => {
  let _dataSelected = { ...dataSelected }
  if (checked) {
    if (answer.exclusive) {
      _dataSelected[questionId] = [...(_dataSelected[questionId] || []).filter(it => it.groupId !== answer.groupId), answer]
    } else {
      _dataSelected[questionId] = [...(_dataSelected[questionId] || []), answer]
    }
  } else {
    _dataSelected[questionId] = (_dataSelected[questionId] || []).filter(it => it.id !== answer.id)
  }
  setDataSelected(_dataSelected)
}

export const onClickSuggestion = (suggestion: TargetAnswerSuggestion, questions: TargetQuestion[], setDataSelected: React.Dispatch<React.SetStateAction<{ [key: number]: TargetAnswer[]; }>>) => {
  let _answers: TargetAnswer[] = []
  if (suggestion.answerIds?.length) {
    const iQ = questions.findIndex(it => it.id === suggestion.questionId)
    if (iQ !== -1) {
      const answersAdd = questions[iQ].targetAnswers?.filter(it => suggestion.answerIds.includes(it.id)) || []
      _answers = _answers.concat(answersAdd)
    }
  }
  if (suggestion.groupIds?.length) {
    const iQ = questions.findIndex(it => it.id === suggestion.questionId)
    if (iQ !== -1) {
      const groups = questions[iQ].targetAnswerGroups?.filter(it => suggestion.groupIds.includes(it.id)) || []
      if (groups?.length) {
        let answersAdd: TargetAnswer[] = []
        groups.forEach(it => {
          const exclusiveAnswer = it.targetAnswers?.find((temp) => temp.exclusive)
          if (exclusiveAnswer) {
            answersAdd.push(exclusiveAnswer)
          }
        })
        _answers = _answers.concat(answersAdd)
      }
    }
  }
  _answers = _.unionBy(_answers, 'id')
  const exclusiveAnswers = _answers?.filter((temp) => temp.exclusive) || []
  exclusiveAnswers.forEach(it => {
    _answers = _answers.filter(temp => it.questionId !== temp.questionId || it.groupId !== temp.groupId || temp.exclusive)
  })
  setDataSelected(pre => ({ ...pre, [suggestion.questionId]: _answers }))
}

export const isSelectedSuggestion = (suggestion: TargetAnswerSuggestion, dataSelected: DataSelected) => {
  if (!dataSelected[suggestion.questionId]?.length) return false
  if (suggestion.answerIds?.length) {
    const notSelect = suggestion.answerIds.find(answerId => !dataSelected[suggestion.questionId].find(it => it.id === answerId))
    if (notSelect) return false
  }
  if (suggestion.groupIds?.length) {
    const notSelect = suggestion.groupIds.find(groupId => !dataSelected[suggestion.questionId].find(it => it.groupId === groupId && it.exclusive))
    if (notSelect) return false
  }
  return true
}

export const isDisableSubmit = (questions: TargetQuestion[], dataSelected: DataSelected) => {
  return !!questions.find(it => !dataSelected[it.id]?.length)
}

export const onSelectAll = (
  questionId: number,
  answers: TargetAnswer[],
  checked: boolean,
  dataSelected: DataSelected,
  setDataSelected: React.Dispatch<React.SetStateAction<DataSelected>>,
  groupId?: number
) => {
  let _dataSelected = { ...dataSelected }
  const allAnswers = answers?.filter(it => !it.exclusive) || []
  let otherAnswers = []
  if (groupId) {
    otherAnswers = _dataSelected[questionId]?.filter(it => it.groupId !== groupId) || []
  }
  if (checked) {
    _dataSelected[questionId] = [...allAnswers, ...otherAnswers]
  } else {
    _dataSelected[questionId] = [...otherAnswers]
  }
  setDataSelected(_dataSelected)
}

export const isSelectAll = (questionId: number, dataSelected: DataSelected, answers: TargetAnswer[]) => {
  const allAnswers = answers?.filter(it => !it.exclusive) || []
  return !allAnswers.find(it => !dataSelected[questionId]?.find(temp => temp.id === it.id))
}