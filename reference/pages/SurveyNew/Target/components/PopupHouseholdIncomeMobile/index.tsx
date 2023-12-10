import { memo, useEffect, useMemo, useState } from 'react';
import { Dialog, Grid, Box } from '@mui/material';
import classes from './styles.module.scss';

import { Project } from 'models/project';
import { TargetAnswer, TargetQuestion, TargetQuestionType } from 'models/Admin/target';
import { useDispatch } from 'react-redux';
import { DataSelected, isDisableSubmit, isSelectAll, onSelectAll, onToggleAnswer } from '../../models';
import { setLoading, setSuccessMess, setErrorMess } from 'redux/reducers/Status/actionTypes';
import { ProjectService } from 'services/project';
import { getTargetRequest, setProjectReducer } from 'redux/reducers/Project/actionTypes';
import { editableProject } from 'helpers/project';
import { useTranslation } from 'react-i18next';
import PopupConfirmChangeSampleSize, { DataConfirmChangeSampleSize } from 'pages/SurveyNew/components/PopupConfirmChangeSampleSize';
import { DialogTitle } from 'components/common/dialogs/DialogTitle';
import Heading5 from 'components/common/text/Heading5';
import ButtonClose from 'components/common/buttons/ButtonClose';
import { DialogContent } from 'components/common/dialogs/DialogContent';
import { DialogActions } from 'components/common/dialogs/DialogActions';
import Button, { BtnType } from 'components/common/buttons/Button';
import TextBtnSecondary from 'components/common/text/TextBtnSecondary';
import SubTitle from 'components/common/text/SubTitle';
import ControlCheckbox from 'components/common/control/ControlCheckbox';
import InputCheckbox from 'components/common/inputs/InputCheckbox';
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import { AnswerListMobile } from '..';

interface Props {
  isOpen: boolean,
  project: Project,
  questions: TargetQuestion[],
  onCancel: () => void
}

const PopupHouseholdIncomeMobile = memo(({ isOpen, project, questions, onCancel }: Props) => {
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
        onCancel()
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
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle sx={{ alignItems: 'center' }}>
        <Heading5 $colorName="--ghost-white" translation-key="target_sub_tab_household_income">{t("target_sub_tab_household_income")}</Heading5>
        <ButtonClose onClick={onCancel} />
      </DialogTitle>
      <DialogContent>
        {questions.map(question => (
          <Grid key={question.id} className={classes.rowItem}>
            <SubTitle $colorName="--eerie-black">
              {question.title}:
            </SubTitle>
            <Box mt={3}>
              <AnswerListMobile>
                {question.targetAnswers.map((answer) => (
                  <Grid key={answer.id} item xs={12}>
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
                  </Grid>
                ))}
                {question.showOptionAll && (
                  <Grid item xs={12}>
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
                  </Grid>
                )}
              </AnswerListMobile>
            </Box>
          </Grid>
        ))}
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
          onClick={onUpdateTarget}
          children={<TextBtnSecondary>{t("common_save")}</TextBtnSecondary>}
        />
      </DialogActions>
    </Dialog>
  );
});
export default PopupHouseholdIncomeMobile;



