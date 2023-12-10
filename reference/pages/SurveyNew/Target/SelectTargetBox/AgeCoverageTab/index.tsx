import { memo, useEffect, useMemo, useState } from "react";
import { Box, Grid } from "@mui/material";
import classes from './styles.module.scss';
import { Project } from "models/project";
import { TargetAnswer, TargetQuestion, TargetQuestionType } from "models/Admin/target";
import { useDispatch } from "react-redux";
import { DataSelected, isDisableSubmit, isSelectAll, onSelectAll, onToggleAnswer } from "../../models";
import { ProjectService } from "services/project";
import { setLoading, setSuccessMess, setErrorMess } from "redux/reducers/Status/actionTypes";
import { getTargetRequest, setProjectReducer } from "redux/reducers/Project/actionTypes";
import { editableProject } from "helpers/project";
import { useTranslation } from "react-i18next";
import PopupConfirmChangeSampleSize, { DataConfirmChangeSampleSize } from "pages/SurveyNew/components/PopupConfirmChangeSampleSize";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import ListDot from "components/common/list/ListDot";
import Heading5 from "components/common/text/Heading5";
import ParagraphBody from "components/common/text/ParagraphBody";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import { AnswerList, AnswerListItem, QuestionBoxBody, QuestionBoxContainer, QuestionBoxHeader } from "../../components";
import ControlCheckbox from "components/common/control/ControlCheckbox";
import InputCheckbox from "components/common/inputs/InputCheckbox";

enum ETab {
  Main,
  Gender_And_Age_Quotas,
  Mums_Only
}

interface Props {
  project: Project,
  questionsAgeGender: TargetQuestion[],
  questionsMum: TargetQuestion[]
  onNextStep: () => void
}

const AgeCoverageTab = memo(({ project, questionsAgeGender, questionsMum, onNextStep }: Props) => {

  const { t } = useTranslation()

  const dispatch = useDispatch()

  const [activeTab, setActiveTab] = useState(ETab.Main);
  const [dataSelectedGenderAge, setDataSelectedGenderAge] = useState<DataSelected>({})
  const [dataSelectedMum, setDataSelectedMum] = useState<DataSelected>({})
  const [confirmChangeTarget, setConfirmChangeTarget] = useState<DataConfirmChangeSampleSize>();

  const editable = useMemo(() => editableProject(project), [project])

  useEffect(() => {
    const _dataSelectedGenderAge: DataSelected = {}
    const targetGenderAge = project?.targets?.filter(it => it.targetQuestion?.typeId === TargetQuestionType.Gender_And_Age_Quotas) || []
    targetGenderAge.forEach(item => {
      _dataSelectedGenderAge[item.questionId] = item.answers
    })
    setDataSelectedGenderAge(_dataSelectedGenderAge)
    const _dataSelectedMun: DataSelected = {}
    const targetMum = project?.targets?.filter(it => it.targetQuestion?.typeId === TargetQuestionType.Mums_Only) || []
    targetMum.forEach(item => {
      _dataSelectedMun[item.questionId] = item.answers
    })
    if (activeTab === ETab.Main) {
      if (targetMum?.length) {
        setActiveTab(ETab.Mums_Only)
      } else if(targetGenderAge?.length){
        setActiveTab(ETab.Gender_And_Age_Quotas)
      }
    }
    setDataSelectedMum(_dataSelectedMun)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  const _onToggleAnswerGenderAge = (questionId: number, answer: TargetAnswer, checked: boolean) => {
    onToggleAnswer(questionId, answer, checked, dataSelectedGenderAge, setDataSelectedGenderAge)
  }

  const _onToggleAnswerMum = (questionId: number, answer: TargetAnswer, checked: boolean) => {
    onToggleAnswer(questionId, answer, checked, dataSelectedMum, setDataSelectedMum)
  }

  const isDisableGenderAge = useMemo(() => {
    return isDisableSubmit(questionsAgeGender, dataSelectedGenderAge) || !editable
  }, [editable, questionsAgeGender, dataSelectedGenderAge])

  const isDisableMum = useMemo(() => {
    return isDisableSubmit(questionsMum, dataSelectedMum) || !editableProject(project)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable, questionsMum, dataSelectedMum])

  const onChangeTab = (tab: ETab) => {
    setActiveTab(tab)
  }

  const onUpdateTargetGenderAgeRequest = async () => {
    dispatch(setLoading(true))
    ProjectService.updateTarget(project.id, {
      questionTypeId: TargetQuestionType.Gender_And_Age_Quotas,
      questionSelected: Object.keys(dataSelectedGenderAge).map(questionId => ({ questionId: Number(questionId), answerIds: dataSelectedGenderAge[Number(questionId)].map(it => it.id) }))
    })
      .then((res) => {
        dispatch(setSuccessMess(res.message))
        ProjectService.updateTarget(project.id, {
          questionTypeId: TargetQuestionType.Mums_Only,
          questionSelected: []
        })
          .then(() => {
            dispatch(getTargetRequest(project.id))
            onNextStep()
          })
          .catch((e) => dispatch(setErrorMess(e)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onUpdateTargetMumRequest = () => {
    dispatch(setLoading(true))
    ProjectService.updateTarget(project.id, {
      questionTypeId: TargetQuestionType.Mums_Only,
      questionSelected: Object.keys(dataSelectedMum).map(questionId => ({ questionId: Number(questionId), answerIds: dataSelectedMum[Number(questionId)].map(it => it.id) }))
    })
      .then((res) => {
        dispatch(setSuccessMess(res.message))
        ProjectService.updateTarget(project.id, {
          questionTypeId: TargetQuestionType.Gender_And_Age_Quotas,
          questionSelected: []
        })
          .then(() => {
            dispatch(getTargetRequest(project.id))
            onNextStep()
          })
          .catch((e) => dispatch(setErrorMess(e)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onUpdateTargetGenderAge = () => {
    if (isDisableGenderAge) return
    ProjectService.getQuota(project.id)
      .then((res) => {
        if (res?.length) setConfirmChangeTarget({ isConfirmQuotas: true })
        else onUpdateTargetGenderAgeRequest()
      })
      .catch(e => dispatch(setErrorMess(e)))
  }

  const onUpdateTargetMum = () => {
    if (isDisableMum) return
    ProjectService.getQuota(project.id)
      .then((res) => {
        if (res?.length) setConfirmChangeTarget({ isConfirmQuotas: true })
        else onUpdateTargetMumRequest()
      })
      .catch(e => dispatch(setErrorMess(e)))
  }

  const onCloseComfirmTarget = () => {
    setConfirmChangeTarget(undefined)
  }

  const onConfimedChangeTarget = () => {
    switch (activeTab) {
      case ETab.Gender_And_Age_Quotas:
        if (isDisableGenderAge) return
        ProjectService.resetQuota(project.id)
          .then((res) => {
            dispatch(setProjectReducer({ ...project, agreeQuota: res.data.agreeQuota }))
            onUpdateTargetGenderAgeRequest()
          })
          .catch(e => dispatch(setErrorMess(e)))
          .finally(() => onCloseComfirmTarget())
        break;
      case ETab.Mums_Only:
        if (isDisableMum) return
        ProjectService.resetQuota(project.id)
          .then((res) => {
            dispatch(setProjectReducer({ ...project, agreeQuota: res.data.agreeQuota }))
            onUpdateTargetMumRequest()
          })
          .catch(e => dispatch(setErrorMess(e)))
          .finally(() => onCloseComfirmTarget())
        break;
    }
  }

  const renderTab = () => {
    switch (activeTab) {
      case ETab.Main:
        return (
          <Grid>
            <ParagraphSmall $colorName="--gray-80" translation-key="target_sub_tab_tow_option_age_and_gender_coverage">{t("target_sub_tab_tow_option_age_and_gender_coverage")}</ParagraphSmall>
            <ListDot component="ul">
              <ParagraphSmall variant="body2" variantMapping={{ body2: "li" }} $colorName="--gray-80" translation-key="target_sub_tab_targeting_gender">
                {t("target_sub_tab_targeting_gender")}
              </ParagraphSmall>
              <ParagraphSmall variant="body2" variantMapping={{ body2: "li" }} $colorName="--gray-80" translation-key="target_sub_tab_targeting_age">
                {t("target_sub_tab_targeting_age")}
              </ParagraphSmall>
            </ListDot>
            <Box className={classes.selectTab}>
              <Box className={classes.selectTabItem}>
                <Heading5 align="center" mb={2} $colorName="--eerie-black" translation-key="target_sub_tab_age_coverage_tab_gender_and_age">
                  {t('target_sub_tab_age_coverage_tab_gender_and_age')}
                </Heading5>
                <ParagraphBody align="center" mb={2} $colorName="--eerie-black" translation-key="target_sub_tab_age_coverage_tab_gender_and_age_sub">
                  {t('target_sub_tab_age_coverage_tab_gender_and_age_sub')}
                </ParagraphBody>
                <Button
                  width="150px"
                  btnType={BtnType.Outlined}
                  children={<TextBtnSecondary translation-key="common_select">{t('common_select')}</TextBtnSecondary>}
                  onClick={() => onChangeTab(ETab.Gender_And_Age_Quotas)}
                />
              </Box>
              <Box className={classes.selectTabItem}>
                <Heading5 align="center" mb={2} $colorName="--eerie-black" translation-key="target_sub_tab_age_coverage_tab_mum_only">
                  {t('target_sub_tab_age_coverage_tab_mum_only')}
                </Heading5>
                <ParagraphBody align="center" mb={2} $colorName="--eerie-black" translation-key="target_sub_tab_age_coverage_tab_mum_only_sub">
                  {t('target_sub_tab_age_coverage_tab_mum_only_sub')}
                </ParagraphBody>
                <Button
                  width="150px"
                  btnType={BtnType.Outlined}
                  children={<TextBtnSecondary translation-key="common_select">{t('common_select')}</TextBtnSecondary>}
                  onClick={() => onChangeTab(ETab.Mums_Only)}
                />
              </Box>
            </Box>
          </Grid>
        )
      case ETab.Gender_And_Age_Quotas:
        return (
          <Grid>
            <Box display="flex" justifyContent="flex-end">
              <ParagraphSmallUnderline2 onClick={() => onChangeTab(ETab.Mums_Only)} translation-key="target_sub_tab_age_coverage_switch_mum_only">
                {t('target_sub_tab_age_coverage_switch_mum_only')}
              </ParagraphSmallUnderline2>
            </Box>
            <ParagraphSmall mt={2} $colorName="--gray-80" translation-key="target_sub_tab_select_gender_age_quotas"
              dangerouslySetInnerHTML={{
              __html: t("target_sub_tab_select_gender_age_quotas"),
              }}
            >
            </ParagraphSmall>
            {questionsAgeGender.map(question => (
              <Grid mt={3} key={question.id}>
                <QuestionBoxContainer>
                  <QuestionBoxHeader>
                    <Heading5 $colorName="--eerie-black">{question.title}:</Heading5>
                  </QuestionBoxHeader>
                  <QuestionBoxBody>
                    <AnswerList sx={{ py: 3, px: 4 }}>
                      {question.targetAnswers.map((answer) => (
                        <AnswerListItem item xs={4} md={4} lg={3} key={answer.id}>
                          <ControlCheckbox
                            $cleanPadding={true}
                            control={
                              <InputCheckbox
                                disabled={!editable}
                                checked={!!dataSelectedGenderAge[question.id]?.find(it => it.id === answer.id)}
                                onChange={(_, checked) => _onToggleAnswerGenderAge(question.id, answer, checked)}
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
                                checked={isSelectAll(question.id, dataSelectedGenderAge, question.targetAnswers)}
                                onChange={(_, checked) => onSelectAll(question.id, question.targetAnswers, checked, dataSelectedGenderAge, setDataSelectedGenderAge)}
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
              <Button
                width="128px"
                disabled={isDisableGenderAge}
                btnType={BtnType.Secondary}
                children={<TextBtnSecondary translation-key="common_save">{t("common_save")}</TextBtnSecondary>}
                onClick={onUpdateTargetGenderAge}
              />
            </Box>
          </Grid>
        )
      case ETab.Mums_Only:
        return (
          <Grid>
            <Box display="flex" justifyContent="flex-end">
              <ParagraphSmallUnderline2 onClick={() => onChangeTab(ETab.Gender_And_Age_Quotas)} translation-key="target_sub_tab_age_coverage_switch_gender_and_age">
                {t('target_sub_tab_age_coverage_switch_gender_and_age')}
              </ParagraphSmallUnderline2>
            </Box>
            <ParagraphSmall mt={2} $colorName="--gray-80" translation-key="target_sub_tab_select_age_child_quotas"
              dangerouslySetInnerHTML={{
              __html: t("target_sub_tab_select_age_child_quotas"),
              }}
            >
            </ParagraphSmall>
            {questionsMum.map(question => (
              <Grid mt={3} key={question.id}>
                <QuestionBoxContainer>
                  <QuestionBoxHeader>
                    <Heading5 $colorName="--eerie-black">{question.title}:</Heading5>
                  </QuestionBoxHeader>
                  <QuestionBoxBody>
                    <AnswerList sx={{ py: 3, px: 4 }}>
                      {question.targetAnswers.map((answer) => (
                        <AnswerListItem item xs={6} md={6} lg={4} key={answer.id}>
                          <ControlCheckbox
                            $cleanPadding={true}
                            control={
                              <InputCheckbox
                                disabled={!editable}
                                checked={!!dataSelectedMum[question.id]?.find(it => it.id === answer.id)}
                                onChange={(_, checked) => _onToggleAnswerMum(question.id, answer, checked)}
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
                                checked={isSelectAll(question.id, dataSelectedMum, question.targetAnswers)}
                                onChange={(_, checked) => onSelectAll(question.id, question.targetAnswers, checked, dataSelectedMum, setDataSelectedMum)}
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
              <Button
                width="128px"
                disabled={isDisableMum}
                btnType={BtnType.Secondary}
                children={<TextBtnSecondary translation-key="common_save">{t("common_save")}</TextBtnSecondary>}
                onClick={onUpdateTargetMum}
              />
            </Box>
          </Grid>
        )
    }
  }
  return (
    <>
      {renderTab()}
      <PopupConfirmChangeSampleSize
        data={confirmChangeTarget}
        onClose={onCloseComfirmTarget}
        onConfirm={onConfimedChangeTarget}
      />
    </>
  )
})

export default AgeCoverageTab