import { Box, Grid } from "@mui/material"
import { Project } from "models/project";
import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { TargetAnswer, TargetQuestionType, TargetQuestion } from "models/Admin/target";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { DataSelected, onToggleAnswer, isDisableSubmit, isSelectAll, onSelectAll } from "../../models";
import { ProjectService } from "services/project";
import { getTargetRequest, setProjectReducer } from "redux/reducers/Project/actionTypes";
import { editableProject } from "helpers/project";
import { useTranslation } from "react-i18next";
import PopupConfirmChangeSampleSize, { DataConfirmChangeSampleSize } from "pages/SurveyNew/components/PopupConfirmChangeSampleSize";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import { AnswerList, AnswerListItem, QuestionBoxBody, QuestionBoxContainer, QuestionBoxHeader } from "../../components";
import Heading5 from "components/common/text/Heading5";
import ControlCheckbox from "components/common/control/ControlCheckbox";
import InputCheckbox from "components/common/inputs/InputCheckbox";

interface Props {
  project: Project,
  questions: TargetQuestion[]
  onNextStep: () => void
}

const HouseholdIncomeTab = memo(({ project, questions, onNextStep }: Props) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const [dataSelected, setDataSelected] = useState<DataSelected>({})
  const [confirmChangeTarget, setConfirmChangeTarget] = useState<DataConfirmChangeSampleSize>();

  const editable = useMemo(() => editableProject(project), [project])

  const isDisable = useMemo(() => {
    return isDisableSubmit(questions, dataSelected) || !editable
  }, [questions, dataSelected, editable])

  useEffect(() => {
    const _dataSelected: DataSelected = {}
    const targetLs = project?.targets?.filter(it => it.targetQuestion?.typeId === TargetQuestionType.Household_Income) || []
    targetLs.forEach(item => {
      _dataSelected[item.questionId] = item.answers
    })
    setDataSelected(_dataSelected)
  }, [project])

  const _onToggleAnswer = (questionId: number, answer: TargetAnswer, checked: boolean) => {
    onToggleAnswer(questionId, answer, checked, dataSelected, setDataSelected)
  }

  const onUpdateTargetRequest = () => {
    dispatch(setLoading(true))
    ProjectService.updateTarget(project.id, {
      questionTypeId: TargetQuestionType.Household_Income,
      questionSelected: Object.keys(dataSelected).map(questionId => ({ questionId: Number(questionId), answerIds: dataSelected[Number(questionId)].map(it => it.id) }))
    })
      .then((res) => {
        dispatch(getTargetRequest(project.id))
        dispatch(setSuccessMess(res.message))
        onNextStep()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onUpdateTarget = () => {
    if (isDisable) return
    ProjectService.getQuota(project.id)
      .then((res) => {
        if (res?.length) setConfirmChangeTarget({ isConfirmQuotas: true })
        else onUpdateTargetRequest()
      })
      .catch(e => dispatch(setErrorMess(e)))
  }

  const onCloseComfirmTarget = () => {
    setConfirmChangeTarget(undefined)
  }

  const onConfimedChangeTarget = () => {
    if (isDisable) return
    ProjectService.resetQuota(project.id)
      .then((res) => {
        dispatch(setProjectReducer({ ...project, agreeQuota: res.data.agreeQuota }))
        onUpdateTargetRequest()
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => onCloseComfirmTarget())
  }

  return (
    <>
      <ParagraphSmall $colorName="--gray-80" translation-key="target_sub_tab_choose_household_and_select_economic"
        dangerouslySetInnerHTML={{
        __html: t("target_sub_tab_choose_household_and_select_economic"),
        }}
      >
      </ParagraphSmall>
      {questions.map(question => (
        <Grid mt={3} key={question.id}>
          <QuestionBoxContainer>
            <QuestionBoxHeader>
              <Heading5 $colorName="--eerie-black">{question.title}:</Heading5>
            </QuestionBoxHeader>
            <QuestionBoxBody>
              <AnswerList sx={{ py: 2, px: 4 }}>
                {question.targetAnswers.map((answer) => (
                  <AnswerListItem item xs={6} key={answer.id}>
                    <ControlCheckbox
                      $cleanPadding={true}
                      control={
                        <InputCheckbox
                          disabled={!editable}
                          checked={!!dataSelected[question.id]?.find(it => it.id === answer.id)}
                          onChange={(_, checked) => _onToggleAnswer(question.id, answer, checked)}
                        />
                      }
                      label={answer.name}
                    />
                    {!!answer.description && (
                      <ParagraphSmall ml={3.5} $colorName="--gray-60">
                        {answer.description}
                      </ParagraphSmall>
                    )}
                  </AnswerListItem>
                ))}
                {question.showOptionAll && (
                  <AnswerListItem item xs={6}>
                    <ControlCheckbox
                      $cleanPadding={true}
                      control={
                        <InputCheckbox
                          disabled={!editable}
                          checked={isSelectAll(question.id, dataSelected, question.targetAnswers)}
                          onChange={(_, checked) => onSelectAll(question.id, question.targetAnswers, checked, dataSelected, setDataSelected)}
                        />
                      }
                      label={<>{t("common_select_all")}</>}
                    />
                  </AnswerListItem>
                )}

              </AnswerList>
            </QuestionBoxBody>
          </QuestionBoxContainer>
        </Grid>
      ))}
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Button
            disabled={isDisable}
            btnType={BtnType.Secondary}
            children={<TextBtnSecondary translation-key="common_save_and_next">{t("common_save_and_next")}</TextBtnSecondary>}
            onClick={onUpdateTarget}
          />
          <ParagraphSmall sx={{ fontStyle: "italic !important" }} mt={0.5} $colorName="--gray-60" translation-key="target_sub_tab_next_choose_age_coverage">{t("target_sub_tab_next_choose_age_coverage")}</ParagraphSmall>
        </Box>
      </Box>
      <PopupConfirmChangeSampleSize
        data={confirmChangeTarget}
        onClose={onCloseComfirmTarget}
        onConfirm={onConfimedChangeTarget}
      />
    </>
  )
})

export default HouseholdIncomeTab