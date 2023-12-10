import { useState, useMemo, useEffect } from "react";
import {
  Grid,
  Dialog,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import classes from "./styles.module.scss";
import * as yup from "yup";
import Toggle from "components/Toggle";
import { useTranslation } from "react-i18next";
import ParagraphBody from "components/common/text/ParagraphBody"
import Heading5 from "components/common/text/Heading5"
import Heading3 from "components/common/text/Heading3"
import InputLineTextfield from "components/common/inputs/InputLineTextfield"
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import ButtonCLose from "components/common/buttons/ButtonClose"
import Button, { BtnType } from "components/common/buttons/Button"
import TextBtnSmall from "components/common/text/TextBtnSmall"
import InputTextfield from "components/common/inputs/InputTextfield"
import { CreateOrEditCustomQuestionInput, CustomQuestion, CustomQuestionType, ECustomQuestionType } from "models/custom_question";
import { Project } from "models/project";
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import ErrorMessage from "components/common/text/ErrorMessage";
import { usePrice } from "helpers/price";


export interface NumericScaleForm {
  title: string;
  scaleRangeFrom?: number;
  scaleRangeTo?: number;
  customQuestionAttributes?: {
    id?: number;
    leftLabel?: string;
    rightLabel?: string;
  }[],
}
interface Props {
  isOpen: boolean;
  project: Project;
  questionEdit: CustomQuestion;
  questionType: CustomQuestionType;
  onClose: () => void;
  onSubmit: (data: CreateOrEditCustomQuestionInput) => void;
}

const PopupNumericScale = (props: Props) => {

  const { t, i18n } = useTranslation();

  const { isOpen, project, questionEdit, questionType, onClose, onSubmit } = props;

  const [focusEleIdx, setFocusEleIdx] = useState(-1);

  const schema = useMemo(() => {
    return yup.object().shape({
      title: yup.string().required(t("setup_survey_popup_numeric_scale_question_validate")),
      scaleRangeFrom: yup.number()
        .typeError(t("setup_survey_popup_numeric_scale_from_validate_required"))
        .integer(t("setup_survey_popup_numeric_scale_from_validate_integer"))
        .required(t("setup_survey_popup_numeric_scale_from_validate_required")),
      scaleRangeTo: yup.number()
        .typeError(t("setup_survey_popup_numeric_scale_to_validate_required"))
        .integer(t("setup_survey_popup_numeric_scale_to_validate_integer"))
        .required(t("setup_survey_popup_numeric_scale_to_validate_required"))
        .min(yup.ref("scaleRangeFrom"), t("setup_survey_popup_numeric_scale_validate_min")),
      customQuestionAttributes: yup
        .array(yup.object({
          id: yup.number().transform(value => (isNaN(value) ? undefined : value)).notRequired(),
          leftLabel: yup.string().required(t("setup_survey_popup_numeric_scale_validate_left_label")),
          rightLabel: yup.string().required(t("setup_survey_popup_numeric_scale_validate_right_label")),
        }))
        .required(),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NumericScaleForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { fields: fieldsAttributes, append: appendAttribute, remove: removeAttribute, move: moveAttribute } = useFieldArray({
    control,
    name: "customQuestionAttributes"
  });

  const isShowMultiAttributes = useMemo(() => !!fieldsAttributes?.length, [fieldsAttributes])

  const { getCustomQuestionNumericScaleCost, getCostCurrency } = usePrice()

  const price = useMemo(() => {
    if (!questionType) return
    return getCustomQuestionNumericScaleCost(questionType, fieldsAttributes.length, project)
  }, [questionType, fieldsAttributes, getCustomQuestionNumericScaleCost, project])

  const onAddAttribute = () => {
    if (fieldsAttributes?.length >= questionType.maxAttribute) return

    appendAttribute({
      leftLabel: '',
      rightLabel: '',
    })
    setFocusEleIdx(fieldsAttributes?.length ?? 0)
  };

  const onToggleMultipleAttributes = () => {
    if (isShowMultiAttributes) {
      removeAttribute()
    } else {
      onAddAttribute()
    }
  }

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return
    moveAttribute(source.index, destination.index)
  };

  const clearForm = () => {
    reset({
      title: "",
      scaleRangeFrom: null,
      scaleRangeTo: null,
      customQuestionAttributes: [],
    })
  };

  const _onSubmit = (value: NumericScaleForm) => {
    const data: CreateOrEditCustomQuestionInput = {
      projectId: project.id,
      title: value.title,
      scaleRangeFrom: value.scaleRangeFrom,
      scaleRangeTo: value.scaleRangeTo,
      typeId: ECustomQuestionType.Numeric_Scale,
      customQuestionAttributes: value.customQuestionAttributes?.map(it => ({
        id: it.id,
        leftLabel: it.leftLabel,
        rightLabel: it.rightLabel
      }))
    }
    onSubmit(data)
  };

  const onDeleteAttribute = (index: number) => () => {
    removeAttribute(index)
  };

  const _onClose = () => {
    onClose()
  }

  useEffect(() => {
    if (questionEdit) {
      reset({
        title: questionEdit.title,
        scaleRangeFrom: questionEdit.scaleRangeFrom,
        scaleRangeTo: questionEdit.scaleRangeTo,
        customQuestionAttributes: questionEdit.customQuestionAttributes?.map(it => ({
          id: it.id,
          leftLabel: it.leftLabel,
          rightLabel: it.rightLabel
        })),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [questionEdit])

  useEffect(() => {
    if (!isOpen && !questionEdit) {
      clearForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, questionEdit])

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={() => _onClose()}
      classes={{ paper: classes.paper }}
    >
      <form className={classes.form} onSubmit={handleSubmit(_onSubmit)}>
        <DialogTitle>
          <Heading3 translation-key="setup_survey_popup_add_numeric_scale_title">
            {t("setup_survey_popup_add_numeric_scale_title")}
          </Heading3>
          <ButtonCLose
            onClick={() => _onClose()}>
          </ButtonCLose>
        </DialogTitle>
        <DialogContent dividers>
          <Grid className={classes.classForm}>
            <ParagraphBody $colorName="--eerie-black" translation-key="setup_survey_popup_advice_subtitle" className={classes.titleAdvice} >
              {t("setup_survey_popup_advice_subtitle", { firstPrice: getCostCurrency(questionType?.price || 0)?.show, secondPrice: getCostCurrency(questionType?.priceAttribute || 0)?.show })}
            </ParagraphBody>
            <Heading5
              translation-key="setup_survey_popup_question_title"
            >
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
            <Grid className={classes.scaleRangeContainer}>
              <Heading5 translation-key="setup_survey_popup_numeric_scale_range">{t("setup_survey_popup_numeric_scale_range")}</Heading5>
              <div className={classes.contentScaleRange}>
                <ParagraphBody $colorName="--eerie-black-65"
                  translation-key="setup_survey_popup_numeric_scale_from">{t("setup_survey_popup_numeric_scale_from")}</ParagraphBody>
                <InputLineTextfield
                  root={classes.inputScaleRange}
                  fullWidth
                  type="number"
                  translation-key-placeholder="setup_survey_popup_numeric_scale_from_placeholder"
                  placeholder={t("setup_survey_popup_numeric_scale_from_placeholder")}
                  autoComplete="off"
                  inputProps={{ tabIndex: 2 }}
                  inputRef={register("scaleRangeFrom")}
                  isShowError={!!errors.scaleRangeFrom?.message}
                />
                <ParagraphBody $colorName="--eerie-black-65"
                  translation-key="setup_survey_popup_numeric_scale_to">{t("setup_survey_popup_numeric_scale_to")}</ParagraphBody>
                <InputLineTextfield
                  root={classes.inputScaleRange}
                  fullWidth
                  type="number"
                  translation-key-placeholder="setup_survey_popup_numeric_scale_to_placeholder"
                  placeholder={t("setup_survey_popup_numeric_scale_to_placeholder")}
                  autoComplete="off"
                  inputProps={{ tabIndex: 3 }}
                  inputRef={register("scaleRangeTo")}
                  isShowError={!!errors.scaleRangeTo?.message}
                />
              </div>
            </Grid>
            {!!errors.scaleRangeFrom?.message && <ErrorMessage>{errors.scaleRangeFrom?.message}</ErrorMessage>}
            {!!errors.scaleRangeTo?.message && <ErrorMessage>{errors.scaleRangeTo?.message}</ErrorMessage>}
            <Grid>
              <div className={classes.multiAttributeControl}>
                <Heading5 $colorName={!isShowMultiAttributes && "--gray-60"} translation-key="setup_survey_popup_multiple_attributes_title">
                  {t("setup_survey_popup_multiple_attributes_title")}
                </Heading5>
                <Toggle
                  checked={isShowMultiAttributes}
                  className={classes.toggleMultipleAttributes}
                  onChange={onToggleMultipleAttributes}
                />
              </div>
              <ParagraphBody $colorName={isShowMultiAttributes ? "--gray-80" : "--gray-60"} translation-key="setup_survey_popup_multiple_attributes_subtitle">
                {t("setup_survey_popup_multiple_attributes_subtitle")}
              </ParagraphBody>
              {!!fieldsAttributes?.length && (
                <Grid sx={{ position: "relative", marginTop: "24px" }}>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable-list-multiple-attributes">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {fieldsAttributes?.map((field, index) => (
                            <Draggable
                              draggableId={field.id}
                              index={index}
                              key={field.id}
                            >
                              {(provided) => (
                                <div
                                  className={classes.rowInputAttributeControl}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div className={classes.rowInputAttribute}>
                                    <DragIndicatorIcon className={classes.iconDotsDrag} />
                                    <ParagraphBody $colorName="--gray-80"
                                      translation-key="setup_survey_popup_attribute_serial"
                                      className={classes.attributeTitle}>{t("setup_survey_popup_attribute_serial")} {index + 1}</ParagraphBody>
                                    <Grid
                                      container
                                      rowSpacing={1}
                                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                    >
                                      <Grid
                                        item
                                        xs={6}
                                        className={classes.inputContainer}
                                      >
                                        <InputLineTextfield
                                          className={classes.inputAttribute}
                                          type="text"
                                          translation-key-placeholder="setup_survey_popup_attribute_left_label_placeholder"
                                          placeholder={t("setup_survey_popup_attribute_left_label_placeholder")}
                                          autoComplete="off"
                                          inputProps={{ tabIndex: index + 4 }}
                                          autoFocus={index === focusEleIdx}
                                          onFocus={() => setFocusEleIdx(-1)}
                                          inputRef={register(`customQuestionAttributes.${index}.leftLabel`)}
                                          errorMessage={errors.customQuestionAttributes?.[index]?.leftLabel?.message}
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        className={classes.inputContainer}
                                      >
                                        <InputLineTextfield
                                          className={classes.inputAttribute}
                                          type="text"
                                          translation-key-placeholder="setup_survey_popup_attribute_right_label_placeholder"
                                          placeholder={t("setup_survey_popup_attribute_right_label_placeholder")}
                                          autoComplete="off"
                                          inputProps={{ tabIndex: index + 5 }}
                                          inputRef={register(`customQuestionAttributes.${index}.rightLabel`)}
                                          errorMessage={errors.customQuestionAttributes?.[index]?.rightLabel?.message}
                                        />
                                      </Grid>
                                    </Grid>
                                  </div>
                                  {fieldsAttributes?.length > 1 && (
                                    <CloseIcon
                                      type="button"
                                      className={classes.closeInputAttribute}
                                      onClick={onDeleteAttribute(index)}
                                    >
                                    </CloseIcon>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  {fieldsAttributes?.length < questionType.maxAttribute && (
                    <Grid className={classes.addList}>
                      <div onClick={onAddAttribute} className={classes.addOptions}>
                        <PlaylistAddIcon className={classes.IconListAdd} />
                        <ParagraphBody $colorName="--eerie-black-65" translation-key="setup_survey_popup_add_answer_title">
                          {t("setup_survey_popup_add_answer_title")}
                        </ParagraphBody>
                      </div>
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.footer}>
          <Grid className={classes.costContainer}>
            <Heading5 $colorName="--cimigo-green-dark">{price?.show} ({price?.equivalent})</Heading5>
            <ParagraphExtraSmall $colorName="--gray-90" translation-key="setup_survey_popup_tax_exclusive">{t("setup_survey_popup_tax_exclusive")}</ParagraphExtraSmall>
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

export default PopupNumericScale;
