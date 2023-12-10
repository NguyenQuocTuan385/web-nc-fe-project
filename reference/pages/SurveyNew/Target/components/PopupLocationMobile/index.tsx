import { useState, memo, useEffect, useMemo } from 'react';
import { Dialog, Grid, IconButton, Collapse, Box } from '@mui/material';
import classes from './styles.module.scss';
import { Project } from 'models/project';
import { TargetAnswer, TargetAnswerSuggestion, TargetQuestion, TargetQuestionRenderType, TargetQuestionType } from 'models/Admin/target';
import { DataSelected, isDisableSubmit, isSelectAll, isSelectedSuggestion, onClickSuggestion, onSelectAll, onToggleAnswer } from '../../models';
import { useDispatch } from 'react-redux';
import { setLoading, setSuccessMess, setErrorMess } from 'redux/reducers/Status/actionTypes';
import { ProjectService } from 'services/project';
import { getTargetRequest, setProjectReducer } from 'redux/reducers/Project/actionTypes';
import { editableProject } from 'helpers/project';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import PopupConfirmChangeSampleSize, { DataConfirmChangeSampleSize } from 'pages/SurveyNew/components/PopupConfirmChangeSampleSize';
import { DialogTitle } from 'components/common/dialogs/DialogTitle';
import ButtonClose from 'components/common/buttons/ButtonClose';
import { DialogContent } from 'components/common/dialogs/DialogContent';
import { DialogActions } from 'components/common/dialogs/DialogActions';
import Button, { BtnType } from 'components/common/buttons/Button';
import TextBtnSecondary from 'components/common/text/TextBtnSecondary';
import Heading5 from 'components/common/text/Heading5';
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import ParagraphExtraSmall from 'components/common/text/ParagraphExtraSmall';
import BasicTooltip from 'components/common/tooltip/BasicTooltip';
import ControlCheckbox from 'components/common/control/ControlCheckbox';
import InputCheckbox from 'components/common/inputs/InputCheckbox';
import ChipCustom from 'components/common/chip/ChipCustom';
import { ExpandMore, InfoOutlined } from '@mui/icons-material';
import Heading6 from 'components/common/text/Heading6';
import Switch from "components/common/inputs/Switch";
import { AnswerListMobile } from '..';

interface Props {
  isOpen: boolean,
  project: Project,
  questions: TargetQuestion[],
  onCancel: () => void
}

const PopupLocationMobile = memo(({ isOpen, project, questions, onCancel }: Props) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const [dataSelected, setDataSelected] = useState<DataSelected>({})
  const [groupsExpanded, setGroupsExpanded] = useState<{ [key: number]: boolean }>({})
  const [confirmChangeTarget, setConfirmChangeTarget] = useState<DataConfirmChangeSampleSize>();

  const editable = useMemo(() => editableProject(project), [project])

  const isDisable = useMemo(() => {
    return isDisableSubmit(questions, dataSelected) || !editable
  }, [questions, dataSelected, editable])

  const onChangeGroupsExpanded = (groupId: number) => {
    setGroupsExpanded((pre) => ({ ...pre, [groupId]: !pre[groupId] }))
  };

  const _onToggleAnswer = (questionId: number, answer: TargetAnswer, checked: boolean) => {
    onToggleAnswer(questionId, answer, checked, dataSelected, setDataSelected)
  }

  const _onClickSuggestion = (suggestion: TargetAnswerSuggestion) => {
    onClickSuggestion(suggestion, questions, setDataSelected)
  }

  const _isSelectedSuggestion = (suggestion: TargetAnswerSuggestion) => {
    return isSelectedSuggestion(suggestion, dataSelected)
  }

  useEffect(() => {
    const _dataSelected: DataSelected = {}
    const targetLs = project?.targets?.filter(it => it.targetQuestion?.typeId === TargetQuestionType.Location) || []
    targetLs.forEach(item => {
      _dataSelected[item.questionId] = item.answers
    })
    setDataSelected(_dataSelected)
  }, [project])

  useEffect(() => {
    setGroupsExpanded({})
  }, [questions])

  const onUpdateTargetRequest = () => {
    dispatch(setLoading(true))
    ProjectService.updateTarget(project.id, {
      questionTypeId: TargetQuestionType.Location,
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
        <Heading5 $colorName="--ghost-white" translation-key="target_sub_tab_location">{t('target_sub_tab_location')}</Heading5>
        <ButtonClose onClick={onCancel} />
      </DialogTitle>
      <DialogContent>
        <Grid className={classes.rowItem}>
          <Grid className={classes.leftItem}>
            <Heading5 $colorName="--eerie-black" translation-key="target_country_title">
              {t('target_country_title')}:
            </Heading5>
          </Grid>
          <Grid className={classes.rightItem}>
            <ParagraphSmall $colorName="--eerie-black-00" translation-key="target_country_name">{t("target_country_name")}</ParagraphSmall>
            <ParagraphExtraSmall mt={0.5} $colorName="--gray-80" translation-key="target_country_sub_title">{t('target_country_sub_title')}</ParagraphExtraSmall>
          </Grid>
        </Grid>
        {questions.map(question => {
          switch (question.renderTypeId) {
            case TargetQuestionRenderType.Normal:
              return (
                <Grid key={question.id} className={classes.rowItem}>
                  <Grid className={classes.leftItem}>
                    <Heading5 $colorName="--eerie-black">
                      {question.title}:
                    </Heading5>
                  </Grid>
                  <Grid className={clsx(classes.rightItem, classes.rightItemList)}>
                    {question.targetAnswers.map(answer => (
                      <BasicTooltip arrow key={answer.id} title={answer.description}>
                        <ControlCheckbox
                          $cleanPadding={true}
                          hastooltip={answer.description}
                          control={
                            <InputCheckbox
                              disabled={!editable}
                              checked={!!dataSelected[question.id]?.find(it => it.id === answer.id)}
                              onChange={(_, checked) => _onToggleAnswer(question.id, answer, checked)}
                            />
                          }
                          label={answer.name}
                        />
                      </BasicTooltip>
                    ))}
                    {question.showOptionAll && (
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
                    )}
                  </Grid>
                </Grid>
              )
            case TargetQuestionRenderType.Box:
              return (
                <Grid key={question.id} className={classes.rowItem}>
                  <Box sx={{ width: "100%" }}>
                    <Heading5 $colorName="--eerie-black">{question.name}:</Heading5>
                    <Box ml={2}>
                      {!!question.targetAnswerSuggestions?.length && (
                        <>
                          <ParagraphSmall mb={1} $colorName="--eerie-black" translation-key="target_suggest_title">{t("target_suggest_title")}:</ParagraphSmall>
                          <Box className={classes.suggestionList}>
                            {question.targetAnswerSuggestions.map(suggestion => (
                              <ChipCustom
                                disabled={!editable}
                                clickable
                                key={suggestion.id}
                                label={suggestion.name}
                                variant={"outlined"}
                                selected={_isSelectedSuggestion(suggestion)}
                                onClick={() => _onClickSuggestion(suggestion)}
                              />
                            ))}
                          </Box>
                        </>
                      )}
                      <Grid className={classes.answerGroup}>
                        {question.targetAnswerGroups.map((group) => (
                          <Grid className={classes.answerGroupItem} key={group.id}>
                            <Grid className={classes.answerGroupItemHead} onClick={() => onChangeGroupsExpanded(group.id)}>
                              <Heading6 mr={1} $colorName="--gray-90">{group.name}</Heading6>
                              <IconButton className={clsx(classes.expandMore, { [classes.expandedIcon]: groupsExpanded[group.id] })}>
                                <ExpandMore />
                              </IconButton>
                            </Grid>
                            <Collapse
                              className={classes.answerGroupItemContent}
                              in={groupsExpanded[group.id]}
                              timeout="auto"
                              unmountOnExit
                            >
                              {group.targetAnswers?.filter(it => it.exclusive).map(answer => (
                                <Box key={answer.id} className={classes.exclusive}>
                                  <Box display="flex" alignItems="center">
                                    <ParagraphSmall $colorName="--eerie-black">{answer.name}</ParagraphSmall>
                                    {!!answer.description && (
                                      <BasicTooltip arrow title={answer.description}>
                                        <InfoOutlined sx={{ color: "var(--gray-60)", fontSize: 20, ml: 0.5 }} />
                                      </BasicTooltip>
                                    )}
                                  </Box>
                                  <Switch
                                    disabled={!editable}
                                    sx={{ ml: 1 }}
                                    checked={!!dataSelected[question.id]?.find(it => it.id === answer.id)}
                                    onChange={(_, checked) => _onToggleAnswer(question.id, answer, checked)}
                                  />
                                </Box>
                              ))}
                              <Box mt={1}>
                                <AnswerListMobile>
                                  {group.targetAnswers?.filter(it => !it.exclusive).map((answer) => (
                                    <Grid key={answer.id} item xs={12} sm={12} md={6}>
                                      <BasicTooltip arrow key={answer.id} title={answer.description}>
                                        <ControlCheckbox
                                          $cleanPadding={true}
                                          hastooltip={answer.description}
                                          control={
                                            <InputCheckbox
                                              disabled={editable ? !!dataSelected[question.id]?.find(it => it.exclusive && it.groupId === answer.groupId) : !editable}
                                              checked={!!dataSelected[question.id]?.find(it => it.id === answer.id)}
                                              onChange={(_, checked) => _onToggleAnswer(question.id, answer, checked)}
                                            />
                                          }
                                          label={answer.name}
                                        />
                                      </BasicTooltip>
                                    </Grid>
                                  ))}
                                  {question.showOptionAll && (
                                    <Grid item xs={12} sm={12} md={6}>
                                      <ControlCheckbox
                                        $cleanPadding={true}
                                        control={
                                          <InputCheckbox
                                            disabled={editable ? !!dataSelected[question.id]?.find(it => it.exclusive && it.groupId === group.id) : !editable}
                                            checked={isSelectAll(question.id, dataSelected, group.targetAnswers)}
                                            onChange={(_, checked) => onSelectAll(question.id, group.targetAnswers, checked, dataSelected, setDataSelected, group.id)}
                                          />
                                        }
                                        label={<>{t("common_select_all")}</>}
                                      />
                                    </Grid>
                                  )}
                                </AnswerListMobile>
                              </Box>
                            </Collapse>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Box>
                </Grid>
              )
          }
        })}
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
export default PopupLocationMobile;



