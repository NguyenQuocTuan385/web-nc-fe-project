import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Grid, Dialog, InputAdornment, Tooltip, } from "@mui/material";
import {
  CreateOrEditCustomQuestionInput,
  CustomQuestion,
  CustomQuestionType,
  ECustomQuestionType,
} from "models/custom_question";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Project } from "models/project";
import { usePrice } from "helpers/price";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading3 from "components/common/text/Heading3";
import Heading5 from "components/common/text/Heading5";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphBody from "components/common/text/ParagraphBody"
import TextBtnSmall from "components/common/text/TextBtnSmall";
import ErrorMessage from "components/common/text/ErrorMessage";
import Button, { BtnType } from "components/common/buttons/Button";
import ButtonCLose from "components/common/buttons/ButtonClose";
import classes from "./styles.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputTextfield from "components/common/inputs/InputTextfield";
import InputLineTextfield from "components/common/inputs/InputLineTextfield";
import { useTranslation } from "react-i18next";
interface SingleChoiceForm {
  title: string;
  answers?: {
    id?: number;
    title: string;
  }[],
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
  onSubmit: (data: CreateOrEditCustomQuestionInput) => void;
  questionEdit: CustomQuestion;
  questionType: CustomQuestionType;
}

const PopupSingleChoice = (props: Props) => {
  const { isOpen, questionEdit, questionType, project, onClose, onSubmit } = props;

  const { t, i18n } = useTranslation();

  const [focusEleIdx, setFocusEleIdx] = useState(-1);

  const schema = useMemo(() => {
    return yup.object().shape({
      title: yup.string().required("Question title is required"),
      answers: yup
        .array(
          yup.object({
            id: yup.number().transform(value => (isNaN(value) ? undefined : value)).notRequired(),
            title: yup.string().required("Answer is required"),
          })
        )
        .required()
        .min(questionType?.minAnswer, `Answers must be greater than ${questionType?.minAnswer}`)
        .max(questionType?.maxAnswer, `Answers should be less than ${questionType?.maxAnswer}`),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionType, i18n.language]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SingleChoiceForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { fields: fieldsAnswers, append: appendAnswer, remove: removeAnswer, move: moveAnswer } = useFieldArray({
    control,
    name: "answers"
  });

  const { getCustomQuestionSingleChoiceCost } = usePrice()

  const price = useMemo(() => {
    if (!questionType) return
    return getCustomQuestionSingleChoiceCost(questionType, project)
  }, [questionType, getCustomQuestionSingleChoiceCost, project])

  useEffect(() => {
    initAnswer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (questionEdit) {
      reset({
        title: questionEdit.title,
        answers: questionEdit.answers?.map(it => ({
          id: it.id,
          title: it.title,
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionEdit]);

  const _onSubmit = (value: SingleChoiceForm) => {
    const data: CreateOrEditCustomQuestionInput = {
      projectId: project.id,
      title: value.title,
      typeId: ECustomQuestionType.Single_Choice,
      answers: value.answers.map((it) => ({
        id: it.id,
        title: it.title,
      })),
    }
    onSubmit(data)
  };

  const initAnswer = () => {
    for (let i: number = 0; i < questionType?.minAnswer; ++i) {
      appendAnswer({
        id: null,
        title: "",
      })
    }
  };

  const clearForm = () => {
    reset({
      title: "",
      answers: [],
    });
    initAnswer();
  };

  const onAddAnswer = () => {
    if (fieldsAnswers?.length >= questionType.maxAnswer) return
    appendAnswer({
      title: '',
    })
    setFocusEleIdx(fieldsAnswers?.length ?? 0)
  };

  const onDeleteAnswer = (index: number) => () => {
    if (fieldsAnswers?.length <= questionType?.minAnswer) return
    removeAnswer(index)
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return
    moveAnswer(source.index, destination.index)
  };

  useEffect(() => {
    if (!isOpen && !questionEdit) {
      clearForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, questionEdit])

  const _onClose = () => {
    onClose()
  }

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={() => _onClose()}
      classes={{ paper: classes.paper }}
    >
      <form className={classes.form} onSubmit={handleSubmit(_onSubmit)}>
        <DialogTitle>
          <Heading3 translation-key="setup_survey_popup_add_single_choice_title">
            {t("setup_survey_popup_add_single_choice_title")}
          </Heading3>
          <ButtonCLose
            onClick={() => _onClose()}>
          </ButtonCLose>
        </DialogTitle>
        <DialogContent dividers>
          <Grid className={classes.classForm}>
            <Heading5 translation-key="setup_survey_popup_question_title">
              {t("setup_survey_popup_question_title")}
            </Heading5>
            <InputTextfield
              className={classes.inputQuestion}
              translation-key-placeholder="setup_survey_popup_enter_question_placeholder"
              placeholder={t("setup_survey_popup_enter_question_placeholder")}
              startAdornment={
                <InputAdornment position="start">
                  <Tooltip
                    translation-key="setup_survey_popup_question_tooltip_icon"
                    title={t("setup_survey_popup_question_tooltip_icon")}
                  >
                    <div className={classes.iconLanguage}>{project?.surveyLanguage}</div>
                  </Tooltip>
                </InputAdornment>
              }
              type="text"
              autoComplete="off"
              autoFocus
              inputProps={{ tabIndex: 1 }}
              inputRef={register("title")}
              errorMessage={errors.title?.message}
            />
            <Grid sx={{ position: "relative", marginTop: "32px" }}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-list-single-choice-answer">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {fieldsAnswers?.map((field, index) => (
                        <Draggable
                          draggableId={field.id}
                          index={index}
                          key={field.id}
                        >
                          {(provided) => (
                            <div
                              className={classes.rowInputAnswer}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <DragIndicatorIcon className={classes.iconDotsDrag} />
                              <Grid sx={{ display: "flex", width: "100%" }}>
                                <input
                                  type="radio"
                                  name="radio_answer"
                                  disabled={true}
                                  className={classes.choiceAnswer}
                                />
                                <InputLineTextfield
                                  root={classes.inputAnswer}
                                  type="text"
                                  placeholder={t("setup_survey_popup_enter_answer_placeholder")}
                                  translation-key-placeholder="setup_survey_popup_enter_answer_placeholder"
                                  autoComplete="off"
                                  autoFocus={index === focusEleIdx}
                                  onFocus={() => setFocusEleIdx(-1)}
                                  inputProps={{ tabIndex: index + 2 }}
                                  inputRef={register(`answers.${index}.title`)}
                                  isShowError={!!errors.answers?.[index]?.title?.message}
                                />
                                {fieldsAnswers?.length >
                                  questionType?.minAnswer && (
                                    <CloseIcon
                                      className={classes.closeInputAnswer}
                                      onClick={onDeleteAnswer(index)}
                                    />
                                  )}
                              </Grid>
                              {!!errors.answers?.[index]?.title?.message && <ErrorMessage className={classes.errAns}>{errors.answers[index]?.title?.message}</ErrorMessage>}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Grid>
            {fieldsAnswers?.length < questionType?.maxAnswer && (
              <Grid className={classes.addList}>
                <div onClick={onAddAnswer} className={classes.addOptions}>
                  <PlaylistAddIcon className={classes.IconListAdd} />
                  <ParagraphBody $colorName="--eerie-black-65" translation-key="setup_survey_popup_add_answer_title">
                    {t("setup_survey_popup_add_answer_title")}
                  </ParagraphBody>
                </div>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions className={classes.footer}>
          <Grid className={classes.costContainer}>
            <Heading5 $colorName={"--cimigo-green-dark"}>{price?.show} ({price?.equivalent})</Heading5>
            <ParagraphExtraSmall $colorName={"--gray-90"}>Tax exclusive</ParagraphExtraSmall>
          </Grid>
          <Button
            btnType={BtnType.Raised}
            type="submit"
            translation-key="setup_survey_popup_save_question_title"
            children={<TextBtnSmall>{t("setup_survey_popup_save_question_title")}</TextBtnSmall>}
            className={classes.btnSave}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PopupSingleChoice;
