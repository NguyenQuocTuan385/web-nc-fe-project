import { Box, Chip, Grid, IconButton, ListItemIcon, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Heading4 from "components/common/text/Heading4";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { usePrice } from "helpers/price";
import { editableProject } from "helpers/project";
import { Project, SETUP_SURVEY_SECTION } from "models/project";
import { MaxChip, PriceChip } from "pages/SurveyNew/components";
import { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getCustomQuestionsRequest, setProjectReducer } from "redux/reducers/Project/actionTypes";
import { setLoading, setErrorMess } from "redux/reducers/Status/actionTypes";
import { ProjectService } from "services/project";
import classes from "./styles.module.scss"
import clsx from "clsx"
import Switch from "components/common/inputs/Switch";
import { SetupTable } from "components/common/table/SetupTable";
import SubTitle from "components/common/text/SubTitle";
import { DragIndicator, KeyboardArrowDown, MoreHoriz, Edit as EditIcon, DeleteForever as DeleteForeverIcon, MoreVert } from "@mui/icons-material";
import { CreateOrEditCustomQuestionInput, CustomQuestion, CustomQuestionType, ECustomQuestionType, icCustomQuestions, UpdateOrderQuestionParams } from "models/custom_question";
import { CustomQuestionService } from "services/custom_question";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import { Menu } from "components/common/memu/Menu";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import PopupConfirmDelete from "components/PopupConfirmDelete";
import PopupOpenQuestion from "pages/SurveyNew/components/PopupOpenQuestion";
import PopupSingleChoice from "pages/SurveyNew/components/PopupSingleChoice";
import PopupMultipleChoices from "pages/SurveyNew/components/PopupMultipleChoices";
import PopupNumericScale from "pages/SurveyNew/components/PopupNumericScale";
import PopupSmileyRating from "pages/SurveyNew/components/PopupSmileyRating";
import PopupStarRating from "pages/SurveyNew/components/PopupStarRating";
import PopupConfirmDisableCustomQuestion from "pages/SurveyNew/components/PopupConfirmDisableCustomQuestion";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";

interface CustomQuestionsProps {
  project: Project;
  step: number;
}

export const CustomQuestions = memo(({ project, step }: CustomQuestionsProps) => {

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [openPopupOpenQuestion, setOpenPopupOpenQuestion] = useState(false)
  const [openPopupSingleChoice, setOpenPopupSingleChoice] = useState(false)
  const [openPopupMultipleChoices, setOpenPopupMultipleChoices] = useState(false)
  const [openPopupNumericScale, setOpenPopupNumericScale] = useState(false)
  const [openPopupSmileyRating, setOpenPopupSmileyRating] = useState(false)
  const [openPopupStarRating, setOpenPopupStarRating] = useState(false)

  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [openQuestionEdit, setOpenQuestionEdit] = useState<CustomQuestion>();
  const [singleChoiceEdit, setSingleChoiceEdit] = useState<CustomQuestion>();
  const [multipleChoicesEdit, setMultipleChoicesEdit] = useState<CustomQuestion>();
  const [numericScaleEdit, setNumericScaleEdit] = useState<CustomQuestion>();
  const [smileyRatingEdit, setSmileyRatingEdit] = useState<CustomQuestion>();
  const [starRatingEdit, setStarRatingEdit] = useState<CustomQuestion>();
  const [questionDelete, setQuestionDelete] = useState<CustomQuestion>();

  const [customQuestionType, setCustomQuestionType] = useState<CustomQuestionType[]>([]);
  const [openConfirmDisableCustomQuestion, setOpenConfirmDisableCustomQuestion] = useState(false);
  const [anchorElMenuQuestions, setAnchorElMenuQuestions] = useState<null | HTMLElement>(null);

  const [anchorElAction, setAnchorElAction] = useState<null | HTMLElement>(null);
  const [questionAction, setQuestionAction] = useState<CustomQuestion>();


  const editable = useMemo(() => editableProject(project), [project])

  const maxCustomQuestion = useMemo(() => project?.solution?.maxCustomQuestion || 0, [project])

  const { price: { customQuestionCost }, getCustomQuestionItemCost } = usePrice()

  const findQuestionType = (type: ECustomQuestionType) => {
    return customQuestionType?.find(item => item.id === type);
  }

  const questionTypeOpenQuestion = useMemo(() => findQuestionType(ECustomQuestionType.Open_Question)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [customQuestionType]);

  const questionTypeSingleChoice = useMemo(() => findQuestionType(ECustomQuestionType.Single_Choice)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [customQuestionType]);

  const questionTypeMultipleChoices = useMemo(() => findQuestionType(ECustomQuestionType.Multiple_Choices)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [customQuestionType]);

  const questionTypeNumericScale = useMemo(() => findQuestionType(ECustomQuestionType.Numeric_Scale)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [customQuestionType]);
  const questionTypeSmileyRating = useMemo(() => findQuestionType(ECustomQuestionType.Smiley_Rating)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [customQuestionType]);
  const questionTypeStarRating = useMemo(() => findQuestionType(ECustomQuestionType.Star_Rating)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [customQuestionType]);

  const onOpenPopupCustomQuestion = (type: ECustomQuestionType) => {
    switch (type) {
      case ECustomQuestionType.Open_Question:
        setOpenPopupOpenQuestion(true);
        break;
      case ECustomQuestionType.Single_Choice:
        setOpenPopupSingleChoice(true);
        break;
      case ECustomQuestionType.Multiple_Choices:
        setOpenPopupMultipleChoices(true);
        break;
      case ECustomQuestionType.Numeric_Scale:
        setOpenPopupNumericScale(true);
        break;
      case ECustomQuestionType.Smiley_Rating:
        setOpenPopupSmileyRating(true);
        break;
      case ECustomQuestionType.Star_Rating:
        setOpenPopupStarRating(true);
        break;
      default:
        break;
    }
    handleCloseMenuQuestions();
  }

  const getQuestionDetail = (question: CustomQuestion) => {
    dispatch(setLoading(true))
    CustomQuestionService.findOne(question.id)
      .then((res) => {
        switch (question.typeId) {
          case ECustomQuestionType.Open_Question:
            setOpenQuestionEdit(res.data);
            break;
          case ECustomQuestionType.Single_Choice:
            setSingleChoiceEdit(res.data);
            break;
          case ECustomQuestionType.Multiple_Choices:
            setMultipleChoicesEdit(res.data);
            break;
          case ECustomQuestionType.Numeric_Scale:
            setNumericScaleEdit(res.data);
            break;
          case ECustomQuestionType.Smiley_Rating:
            setSmileyRatingEdit(res.data);
            break;
          case ECustomQuestionType.Star_Rating:
            setStarRatingEdit(res.data);
            break;
          default:
            break;
        }
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onOpenPopupConfirmDisableCustomQuestion = () => {
    setOpenConfirmDisableCustomQuestion(true);
  }

  const onClosePopupConfirmDisableCustomQuestion = () => {
    setOpenConfirmDisableCustomQuestion(false);
  }

  const onConfirmedDisableCustomQuestion = () => {
    onToggleCustomQuestion(true)
    onClosePopupConfirmDisableCustomQuestion()
  }

  const handleClickMenuQuestions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenuQuestions(event.currentTarget)
  }

  const handleCloseMenuQuestions = () => {
    setAnchorElMenuQuestions(null);
  }

  const onToggleCustomQuestion = (confirmed: boolean = false) => {
    const enableCustomQuestion = !project?.enableCustomQuestion;
    if (!enableCustomQuestion && !confirmed && !!project?.customQuestions.length) {
      onOpenPopupConfirmDisableCustomQuestion()
      return
    }
    dispatch(setLoading(true))
    ProjectService.updateEnableCustomQuestion(project.id, { enableCustomQuestion: enableCustomQuestion })
      .then(() => {
        dispatch(setProjectReducer({ ...project, enableCustomQuestion: enableCustomQuestion }));
        dispatch(getCustomQuestionsRequest(project.id));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  useEffect(() => {
    const getCustomQuestionType = () => {
      CustomQuestionService.getTypes({ take: 99 })
        .then((res) => {
          setCustomQuestionType(res.data);
        })
        .catch(e => dispatch(setErrorMess(e)));
    }
    getCustomQuestionType()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClosePopupOpenQuestion = () => {
    setOpenPopupOpenQuestion(false);
    setOpenQuestionEdit(null);
  }

  const onClosePopupSingleChoice = () => {
    setOpenPopupSingleChoice(false);
    setSingleChoiceEdit(null);
  }

  const onClosePopupMultipleChoices = () => {
    setOpenPopupMultipleChoices(false);
    setMultipleChoicesEdit(null);
  }

  const onClosePopupNumericScale = () => {
    setOpenPopupNumericScale(false);
    setNumericScaleEdit(null);
  }

  const onClosePopupSmileyRating = () => {
    setOpenPopupSmileyRating(false);
    setSmileyRatingEdit(null);
  }

  const onClosePopupStarRating = () => {
    setOpenPopupStarRating(false);
    setStarRatingEdit(null);
  }

  const onCloseConfirmDeleteQuestion = () => {
    setQuestionDelete(null);
  }

  const onDeleteQuestion = () => {
    dispatch(setLoading(true));
    CustomQuestionService.delete(questionDelete.id)
      .then(() => {
        dispatch(getCustomQuestionsRequest(project.id))
        onCloseConfirmDeleteQuestion();
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  };

  const onAddOrEditOpenQuestion = (data: CreateOrEditCustomQuestionInput) => {
    if (openQuestionEdit) {
      dispatch(setLoading(true));
      CustomQuestionService.update(openQuestionEdit.id, data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupOpenQuestion();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true));
      CustomQuestionService.create(data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupOpenQuestion();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onAddOrEditSingleChoice = (data: CreateOrEditCustomQuestionInput) => {
    if (singleChoiceEdit) {
      dispatch(setLoading(true));
      CustomQuestionService.update(singleChoiceEdit.id, data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupSingleChoice();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true));
      CustomQuestionService.create(data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupSingleChoice();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onAddOrEditMultipleChoices = (data: CreateOrEditCustomQuestionInput) => {
    if (multipleChoicesEdit) {
      dispatch(setLoading(true));
      CustomQuestionService.update(multipleChoicesEdit.id, data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupMultipleChoices();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true));
      CustomQuestionService.create(data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupMultipleChoices();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onAddOrEditNumericScale = (data: CreateOrEditCustomQuestionInput) => {
    if (numericScaleEdit) {
      dispatch(setLoading(true));
      CustomQuestionService.update(numericScaleEdit.id, data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupNumericScale();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true));
      CustomQuestionService.create(data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupNumericScale();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onAddOrEditSmileyRating = (data: CreateOrEditCustomQuestionInput) => {
    if (smileyRatingEdit) {
      dispatch(setLoading(true));
      CustomQuestionService.update(smileyRatingEdit.id, data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupSmileyRating();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true));
      CustomQuestionService.create(data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupSmileyRating();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onAddOrEditStarRating = (data: CreateOrEditCustomQuestionInput) => {
    if (starRatingEdit) {
      dispatch(setLoading(true));
      CustomQuestionService.update(starRatingEdit.id, data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupStarRating();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true));
      CustomQuestionService.create(data)
        .then(() => {
          dispatch(getCustomQuestionsRequest(project.id))
          onClosePopupStarRating();
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const getPrice = (customQuestion: CustomQuestion) => {
    return getCustomQuestionItemCost(customQuestion)
  }

  const reorder = (items: CustomQuestion[], startIndex: number, endIndex: number) => {
    const result: CustomQuestion[] = [...(items || [])];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return
    const result: CustomQuestion[] = reorder(
      project?.customQuestions,
      source.index,
      destination.index
    );
    setQuestions(result);
    onUpdateOrderQuestion(result);
  };

  const onUpdateOrderQuestion = (list: CustomQuestion[]) => {
    const params: UpdateOrderQuestionParams = {
      projectId: project.id,
      questions: list.map((item, index) => {
        return {
          id: item.id,
          order: index + 1,
        }
      }),
    }
    CustomQuestionService.updateOrder(params)
      .then(() => {
        dispatch(getCustomQuestionsRequest(project.id))
      })
      .catch(e => dispatch(setErrorMess(e)))
  }

  useEffect(() => {
    setQuestions(project?.customQuestions || [])
  }, [project?.customQuestions])

  const onCloseAction = () => {
    setAnchorElAction(null)
    setQuestionAction(null)
  }

  const onEditQuestion = () => {
    if (!questionAction) return
    getQuestionDetail(questionAction);
    onOpenPopupCustomQuestion(questionAction.typeId);
    onCloseAction()
  };

  const onShowConfirmDeleteQuestion = () => {
    if (!questionAction) return
    setQuestionDelete(questionAction);
    onCloseAction()
  }

  return (
    <Grid id={SETUP_SURVEY_SECTION.custom_questions} mt={4}>
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Box mr={1}>
          {editable && (
            <Switch
              checked={project?.enableCustomQuestion}
              onChange={() => onToggleCustomQuestion()}
            />
          )}
          <Heading4
            $fontSizeMobile={"16px"}
            $colorName="--eerie-black"
            translation-key="setup_survey_custom_question_title"
            sx={{ display: "inline-block", verticalAlign: "middle" }}
            className={clsx({ [classes.titleDisabled]: !project?.enableCustomQuestion })}
          >
            {t('setup_survey_custom_question_title', { step: step })}
          </Heading4>
          <MaxChip
            sx={{ ml: 1 }}
            label={<ParagraphSmall className={clsx({ [classes.titleSubDisabled]: !project?.enableCustomQuestion })} $colorName="--eerie-black">{t('common_max')} {maxCustomQuestion}</ParagraphSmall>}
          />
        </Box>
        <Box sx={{ml:"auto"}}>
          <PriceChip
            className={clsx({ 'disabled': !project?.enableCustomQuestion })}
            label={<ParagraphSmall translation-key={project?.enableCustomQuestion ? "setup_survey_amount_question" : "setup_survey_custom_question_cost_description"}>
              {project?.enableCustomQuestion ? `${customQuestionCost.show} ( ${project?.customQuestions?.length || 0} ${t("setup_survey_amount_question")} )` : t("setup_survey_custom_question_cost_description")}
            </ParagraphSmall>}
          />
        </Box>
      </Box>
      <ParagraphBody
        $colorName="--gray-80"
        mt={1}
        translation-key="setup_survey_custom_question_sub_title"
        className={clsx({ [classes.titleSubDisabled]: !project?.enableCustomQuestion })}
        dangerouslySetInnerHTML={{
          __html: t("setup_survey_custom_question_sub_title"),
        }} 
      />
      {project?.enableCustomQuestion && (<ParagraphBody
        sx={{marginTop: "16px"}}
        $colorName="--gray-80"
        translation-key="setup_survey_custom_question_note"
        className={classes.note}
        dangerouslySetInnerHTML={{
          __html: t("setup_survey_custom_question_note"),
        }}
      >
      </ParagraphBody>)}
      {project?.enableCustomQuestion && (
        <>
          {/* ===================start list desktop====================== */}
          {!!project?.customQuestions?.length && (
          <SetupTable className={classes.desktopTable}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="60">
                  </TableCell>
                  <TableCell translation-key="project_question">
                    <SubTitle>{t("project_question")}</SubTitle>
                  </TableCell>
                  <TableCell align="center" translation-key="project_cost" width="200">
                    <SubTitle>{t("project_cost")}</SubTitle>
                  </TableCell>
                  <TableCell align="center" translation-key="common_action" width="150">
                    <SubTitle>{t('common_action')}</SubTitle>
                  </TableCell>
                </TableRow>
              </TableHead>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-list-custom-question">
                  {(provided) => (
                    <TableBody
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {questions?.map((item, index) => (
                        <Draggable
                          draggableId={item.id.toString()}
                          index={index}
                          key={item.id}
                          isDragDisabled={!editable || questions.length === 1}
                        >
                          {(provided, snapshot) => (
                            <TableRow
                              className={clsx(classes.rowItem, { [classes.rowItemDraging]: snapshot.isDragging })}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TableCell width="60" valign="middle" sx={{ pl: "16px !important" }}>
                                {editable && (
                                  <Box display="flex" alignItems="center" justifyContent="center">
                                    <DragIndicator className={classes.dragIcon} />
                                  </Box>
                                )}
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="flex-start">
                                  <img className={classes.rowListImg} src={icCustomQuestions[item.typeId]} alt="icon custom question" />
                                  <ParagraphSmall ml={"12px"}>{item.title}</ParagraphSmall>
                                </Box>
                              </TableCell>
                              <TableCell align="center" width="200">
                                <Chip className={classes.price} label={<ParagraphSmall $colorName="--cimigo-green-dark-2">{getPrice(item)?.show}</ParagraphSmall>} />
                              </TableCell>
                              <TableCell align="center" width="150">
                                {editable && (
                                  <IconButton
                                    sx={{ padding: "6px" }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setAnchorElAction(e.currentTarget)
                                      setQuestionAction(item)
                                    }}
                                  >
                                    <MoreHoriz sx={{ fontSize: "20px", color: "--eerie-black-65" }} />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </DragDropContext>
            </Table>
          </SetupTable>)}
          {/* ===================end list desktop====================== */}
          {/* ===================start list mobile====================== */}
          <Grid className={classes.mobileTable}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable-list-custom-question-mobile">
                {(provided) => (
                  <Grid
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {questions?.map((item, index) => (
                      <Draggable
                        draggableId={item.id.toString()}
                        index={index}
                        key={item.id}
                        isDragDisabled={!editable || questions.length === 1}
                      >
                        {(provided) => (
                          <Box
                            className={classes.itemListMobile}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Box pt={1} display="flex" alignItems="center" justifyContent="space-between">
                              <Box display="flex" alignItems="center" ml={2} mr={1} overflow="hidden">
                                <img className={classes.rowListImg} src={icCustomQuestions[item.typeId]} alt="icon custom question" />
                                <ParagraphSmall className={classes.itemListTitle} ml={1} $colorName="--eerie-black">{item.title}</ParagraphSmall>
                              </Box>
                              {editable && (
                                <IconButton
                                  sx={{ p: 0 }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setAnchorElAction(e.currentTarget)
                                    setQuestionAction(item)
                                  }}
                                >
                                  <MoreVert sx={{ fontSize: "24px" }} />
                                </IconButton>
                              )}
                            </Box>
                            <Box my={1} ml={2} mr={1}>
                              <Chip className={classes.priceMobile} label={<ParagraphExtraSmall $colorName="--cimigo-green-dark-2">{getPrice(item)?.show}</ParagraphExtraSmall>} />
                            </Box>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Grid>
                )}
              </Droppable>
            </DragDropContext>
          </Grid>
          {/* ===================end list mobile====================== */}
          <Button
            sx={{ mt: 3, width: { xs: "100%", sm: "auto" } }}
            onClick={handleClickMenuQuestions}
            disabled={!editable || project?.customQuestions?.length >= maxCustomQuestion}
            btnType={BtnType.Outlined}
            translation-key="setup_survey_custom_question_menu_action_placeholder"
            children={<TextBtnSmall>{t('setup_survey_custom_question_menu_action_placeholder')}</TextBtnSmall>}
            endIcon={<KeyboardArrowDown sx={{ fontSize: "16px !important" }} />}
          />
          {(editable && questions.length >= maxCustomQuestion) && <ParagraphSmall mt={1} $colorName="--red-error" translation-key="setup_survey_custom_question_error_max">{t("setup_survey_custom_question_error_max", { max: maxCustomQuestion })}</ParagraphSmall>}
        </>
      )}
      <Menu
        $minWidth={"unset"}
        anchorEl={anchorElMenuQuestions}
        open={Boolean(anchorElMenuQuestions)}
        onClose={handleCloseMenuQuestions}
      >
        {customQuestionType.map((item) => (
          <MenuItem className={classes.menuItem} onClick={() => onOpenPopupCustomQuestion(item.id)} key={item.id}>
            <img src={icCustomQuestions[item.id]} alt="icon custom question" />
            <ParagraphExtraSmall className={classes.menuItemText}>{item.title}</ParagraphExtraSmall>
          </MenuItem>
        ))}
      </Menu>
      <Menu
        anchorEl={anchorElAction}
        open={Boolean(anchorElAction)}
        onClose={onCloseAction}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={onEditQuestion}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ParagraphBody translation-key="common_edit">{t('common_edit')}</ParagraphBody>
        </MenuItem>
        <MenuItem onClick={onShowConfirmDeleteQuestion}>
          <ListItemIcon>
            <DeleteForeverIcon sx={{ color: "var(--red-error) !important" }} fontSize="small" />
          </ListItemIcon>
          <ParagraphBody translation-key="common_delete">{t('common_delete')}</ParagraphBody>
        </MenuItem>
      </Menu>
      {questionTypeOpenQuestion && (
        <PopupOpenQuestion
          isOpen={openPopupOpenQuestion}
          onClose={onClosePopupOpenQuestion}
          onSubmit={onAddOrEditOpenQuestion}
          questionEdit={openQuestionEdit}
          questionType={questionTypeOpenQuestion}
          project={project}
        />
      )}
      {questionTypeSingleChoice && (
        <PopupSingleChoice
          isOpen={openPopupSingleChoice}
          onClose={onClosePopupSingleChoice}
          onSubmit={onAddOrEditSingleChoice}
          questionEdit={singleChoiceEdit}
          questionType={questionTypeSingleChoice}
          project={project}
        />
      )}
      {questionTypeMultipleChoices && (
        <PopupMultipleChoices
          isOpen={openPopupMultipleChoices}
          onClose={onClosePopupMultipleChoices}
          onSubmit={onAddOrEditMultipleChoices}
          questionEdit={multipleChoicesEdit}
          questionType={questionTypeMultipleChoices}
          project={project}
        />
      )}
      {questionTypeNumericScale && (
        <PopupNumericScale
          isOpen={openPopupNumericScale}
          onClose={onClosePopupNumericScale}
          onSubmit={onAddOrEditNumericScale}
          questionEdit={numericScaleEdit}
          questionType={questionTypeNumericScale}
          project={project}
        />
      )}
      {questionTypeSmileyRating && (
        <PopupSmileyRating
          isOpen={openPopupSmileyRating}
          onClose={onClosePopupSmileyRating}
          onSubmit={onAddOrEditSmileyRating}
          questionEdit={smileyRatingEdit}
          questionType={questionTypeSmileyRating}
          project={project}
        />
      )}
      {questionTypeStarRating && (
        <PopupStarRating
          isOpen={openPopupStarRating}
          onClose={onClosePopupStarRating}
          onSubmit={onAddOrEditStarRating}
          questionEdit={starRatingEdit}
          questionType={questionTypeStarRating}
          project={project}
        />
      )}
      <PopupConfirmDelete
        isOpen={!!questionDelete}
        title={t("setup_survey_popup_confirm_delete_question_title")}
        description={t("setup_survey_popup_confirm_delete_question_desc")}
        onCancel={() => onCloseConfirmDeleteQuestion()}
        onDelete={onDeleteQuestion}
      />
      <PopupConfirmDisableCustomQuestion
        isOpen={openConfirmDisableCustomQuestion}
        onCancel={onClosePopupConfirmDisableCustomQuestion}
        onYes={onConfirmedDisableCustomQuestion}
      />
    </Grid >
  )
})

export default CustomQuestions;