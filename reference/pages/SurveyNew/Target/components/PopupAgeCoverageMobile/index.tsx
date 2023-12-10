import { useState, memo, useEffect, useMemo } from 'react';
import { Dialog, Grid, Tab, Tabs, Box } from '@mui/material';
import classes from './styles.module.scss';
import { Project } from 'models/project';
import { TargetAnswer, TargetQuestion, TargetQuestionType } from 'models/Admin/target';
import { useDispatch } from 'react-redux';
import { DataSelected, isDisableSubmit, isSelectAll, onSelectAll, onToggleAnswer } from '../../models';
import { ProjectService } from 'services/project';
import { setErrorMess, setLoading, setSuccessMess } from 'redux/reducers/Status/actionTypes';
import { getTargetRequest, setProjectReducer } from 'redux/reducers/Project/actionTypes';
import { editableProject } from 'helpers/project';
import { useTranslation } from 'react-i18next';
import TabPanelMobile from '../TabPanelMobile';
import { DialogTitle } from 'components/common/dialogs/DialogTitle';
import Heading5 from 'components/common/text/Heading5';
import PopupConfirmChangeSampleSize, { DataConfirmChangeSampleSize } from 'pages/SurveyNew/components/PopupConfirmChangeSampleSize';
import ButtonClose from 'components/common/buttons/ButtonClose';
import { DialogContent } from 'components/common/dialogs/DialogContent';
import { DialogActions } from 'components/common/dialogs/DialogActions';
import Button, { BtnType } from 'components/common/buttons/Button';
import TextBtnSecondary from 'components/common/text/TextBtnSecondary';
import { CheckCircle } from '@mui/icons-material';
import SubTitle from 'components/common/text/SubTitle';
import { AnswerListMobile } from '..';
import ControlCheckbox from 'components/common/control/ControlCheckbox';
import InputCheckbox from 'components/common/inputs/InputCheckbox';
import ParagraphSmall from 'components/common/text/ParagraphSmall';

enum ETab {
  Gender_And_Age_Quotas,
  Mums_Only
}

interface Props {
  isOpen: boolean,
  project: Project,
  questionsAgeGender: TargetQuestion[],
  questionsMum: TargetQuestion[],
  onCancel: () => void
}

const PopupAgeCoverageMobile = memo(({ isOpen, project, questionsAgeGender, questionsMum, onCancel }: Props) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const [activeTab, setActiveTab] = useState(ETab.Gender_And_Age_Quotas);
  const [dataSelectedGenderAge, setDataSelectedGenderAge] = useState<DataSelected>({})
  const [dataSelectedMum, setDataSelectedMum] = useState<DataSelected>({})
  const [confirmChangeTarget, setConfirmChangeTarget] = useState<DataConfirmChangeSampleSize>();

  const editable = useMemo(() => editableProject(project), [project])

  const isDisableGenderAge = useMemo(() => {
    return isDisableSubmit(questionsAgeGender, dataSelectedGenderAge) || !editable
  }, [editable, questionsAgeGender, dataSelectedGenderAge])

  const isDisableMum = useMemo(() => {
    return isDisableSubmit(questionsMum, dataSelectedMum) || !editableProject(project)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable, questionsMum, dataSelectedMum])

  const isDisable = useMemo(() => {
    switch (activeTab) {
      case ETab.Gender_And_Age_Quotas:
        return isDisableGenderAge
      case ETab.Mums_Only:
        return isDisableMum
    }
    return true
  }, [activeTab, isDisableGenderAge, isDisableMum])

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
    setDataSelectedMum(_dataSelectedMun)
    if (targetMum?.length) {
      setActiveTab(ETab.Mums_Only)
    } else if(targetGenderAge?.length){
      setActiveTab(ETab.Gender_And_Age_Quotas)
    }
  }, [project])

  const _onToggleAnswerGenderAge = (questionId: number, answer: TargetAnswer, checked: boolean) => {
    onToggleAnswer(questionId, answer, checked, dataSelectedGenderAge, setDataSelectedGenderAge)
  }

  const _onToggleAnswerMum = (questionId: number, answer: TargetAnswer, checked: boolean) => {
    onToggleAnswer(questionId, answer, checked, dataSelectedMum, setDataSelectedMum)
  }

  const onChangeTab = (tab: ETab) => {
    setActiveTab(tab)
  }

  const onUpdateTargetGenderAgeRequest = () => {
    if (isDisableGenderAge) return
    dispatch(setLoading(true))
    ProjectService.updateTarget(project.id, {
      questionTypeId: TargetQuestionType.Gender_And_Age_Quotas,
      questionSelected: Object.keys(dataSelectedGenderAge).map(questionId => ({ questionId: Number(questionId), answerIds: dataSelectedGenderAge[Number(questionId)].map(it => it.id) }))
    })
      .then((res) => {
        ProjectService.updateTarget(project.id, {
          questionTypeId: TargetQuestionType.Mums_Only,
          questionSelected: []
        })
          .then(() => {
            dispatch(setSuccessMess(res.message))
            dispatch(getTargetRequest(project.id))
            onCancel()
          })
          .catch((e) => dispatch(setErrorMess(e)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onUpdateTargetMumRequest = () => {
    if (isDisableMum) return
    dispatch(setLoading(true))
    ProjectService.updateTarget(project.id, {
      questionTypeId: TargetQuestionType.Mums_Only,
      questionSelected: Object.keys(dataSelectedMum).map(questionId => ({ questionId: Number(questionId), answerIds: dataSelectedMum[Number(questionId)].map(it => it.id) }))
    })
      .then((res) => {
        ProjectService.updateTarget(project.id, {
          questionTypeId: TargetQuestionType.Gender_And_Age_Quotas,
          questionSelected: []
        })
          .then(() => {
            dispatch(getTargetRequest(project.id))
            dispatch(setSuccessMess(res.message))
            onCancel()
          })
          .catch((e) => dispatch(setErrorMess(e)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onSave = () => {
    if (isDisable) return
    switch (activeTab) {
      case ETab.Gender_And_Age_Quotas:
        ProjectService.getQuota(project.id)
          .then((res) => {
            if (res?.length) setConfirmChangeTarget({ isConfirmQuotas: true })
            else onUpdateTargetGenderAgeRequest()
          })
          .catch(e => dispatch(setErrorMess(e)))
        break;
      case ETab.Mums_Only:
        ProjectService.getQuota(project.id)
          .then((res) => {
            if (res?.length) setConfirmChangeTarget({ isConfirmQuotas: true })
            else onUpdateTargetMumRequest()
          })
          .catch(e => dispatch(setErrorMess(e)))
        break;
    }
  }

  const onCloseComfirmTarget = () => {
    setConfirmChangeTarget(undefined)
  }

  const onConfimedChangeTarget = () => {
    if (isDisable) return
    switch (activeTab) {
      case ETab.Gender_And_Age_Quotas:
        ProjectService.resetQuota(project.id)
          .then((res) => {
            dispatch(setProjectReducer({ ...project, agreeQuota: res.data.agreeQuota }))
            onUpdateTargetGenderAgeRequest()
          })
          .catch(e => dispatch(setErrorMess(e)))
          .finally(() => onCloseComfirmTarget())
        break;
      case ETab.Mums_Only:
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

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle sx={{ alignItems: 'center' }}>
        <Heading5 $colorName="--ghost-white" translation-key="target_sub_tab_age_coverage">{t('target_sub_tab_age_coverage')}</Heading5>
        <ButtonClose onClick={onCancel} />
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Tabs
          value={activeTab}
          onChange={(_, tab) => onChangeTab(tab)}
          className={classes.tabs}
        >
          <Tab
            label={<SubTitle>{t('target_sub_tab_age_coverage_tab_gender_and_age')}</SubTitle>}
            translation-key="target_sub_tab_age_coverage_tab_gender_and_age"
            className={classes.tabItem}
            icon={<CheckCircle />}
            iconPosition="start"
          />
          <Tab
            label={<SubTitle>{t('target_sub_tab_age_coverage_tab_mum_only')}</SubTitle>}
            translation-key="target_sub_tab_age_coverage_tab_mum_only"
            className={classes.tabItem}
            icon={<CheckCircle />}
            iconPosition="start"
          />
        </Tabs>
        <TabPanelMobile py={3} px={2} value={activeTab} index={ETab.Gender_And_Age_Quotas}>
          {questionsAgeGender.map(question => (
            <Grid key={question.id} className={classes.questionItem}>
              <SubTitle $colorName="--eerie-black">
                {question.title}:
              </SubTitle>
              <Box mt={3}>
                <AnswerListMobile>
                  {question.targetAnswers.map((answer) => (
                    <Grid item xs={6} key={answer.id}>
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
                    </Grid>
                  ))}
                  {question.showOptionAll && (
                    <Grid item xs={6}>
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
                    </Grid>
                  )}
                </AnswerListMobile>
              </Box>
            </Grid>
          ))}
        </TabPanelMobile>
        <TabPanelMobile py={3} px={2} value={activeTab} index={ETab.Mums_Only}>
          {questionsMum.map(question => (
            <Grid key={question.id} className={classes.questionItem}>
              <SubTitle $colorName="--eerie-black">
                {question.title}:
              </SubTitle>
              <Box mt={3}>
                <AnswerListMobile>
                  {question.targetAnswers.map((answer) => (
                    <Grid item xs={12} key={answer.id}>
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
                    </Grid>
                  ))}
                  {question.showOptionAll && (
                    <Grid item xs={12}>
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
                    </Grid>
                  )}
                </AnswerListMobile>
              </Box>
            </Grid>
          ))}
        </TabPanelMobile>
        <PopupConfirmChangeSampleSize
          data={confirmChangeTarget}
          onClose={onCloseComfirmTarget}
          onConfirm={onConfimedChangeTarget}
        />
      </DialogContent>
      <DialogActions>
        <Button
          fullWidth
          disabled={isDisable}
          btnType={BtnType.Raised}
          translation-key="common_save"
          onClick={onSave}
          children={<TextBtnSecondary>{t("common_save")}</TextBtnSecondary>}
        />
      </DialogActions>
    </Dialog>
  );
});
export default PopupAgeCoverageMobile;



