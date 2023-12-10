import { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Dialog,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import * as yup from "yup";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading3 from "components/common/text/Heading3";
import Heading5 from "components/common/text/Heading5";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphBody from "components/common/text/ParagraphBody"
import TextBtnSmall from "components/common/text/TextBtnSmall";
import { Project } from "models/project";
import { arrayEmojis, emojiFaces, FaceType } from "models/custom_question";
import { usePrice } from "helpers/price";
import { CreateOrEditCustomQuestionInput, CustomQuestion, CustomQuestionType, ECustomQuestionType } from "models/custom_question";
import Button, { BtnType } from "components/common/buttons/Button";
import InputTextfield from "components/common/inputs/InputTextfield";
import InputLineTextfield from "components/common/inputs/InputLineTextfield";
import InputSelect from "components/common/inputs/InputSelect";
import ButtonCLose from "components/common/buttons/ButtonClose";
import Emoji from "components/common/images/Emojis";
import classes from "./styles.module.scss";
import Toggle from "components/Toggle";
import { OptionItem } from "models/general";
import { useTranslation } from "react-i18next";

export interface SmileyRatingForm {
  title: string;
  invertScale: boolean;
  customQuestionEmojis: {
    id?: number;
    label: string;
    emojiId: number;
  }[],
  customQuestionAttributes?: {
    id?: number;
    attribute?: string;
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

const PopupSmileyRating = (props: Props) => {

  const { t, i18n } = useTranslation();

  const { onClose, project, questionEdit, questionType, isOpen, onSubmit } = props;

  const [focusEleIdx, setFocusEleIdx] = useState(-1);

  const schema = useMemo(() => {
    return yup.object().shape({
      title: yup.string().required("Question is required"),
      invertScale: yup.boolean().required(),
      customQuestionEmojis: yup
        .array(
          yup.object({
            id: yup.number().transform(value => (isNaN(value) ? undefined : value)).notRequired(),
            label: yup.string().required("Label is required"),
            emojiId: yup.number().transform(value => (isNaN(value) ? undefined : value)).notRequired(),
          })
        ),
      customQuestionAttributes: yup
        .array(
          yup.object({
            id: yup.number().transform(value => (isNaN(value) ? undefined : value)).notRequired(),
            attribute: yup.string().required("Attribute is required"),
          })
        )
        .required(),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const convertToEmojis = (data: OptionItem[]) => {
    return data.map(it => ({ emojiId: it.id, label: '' }))
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<SmileyRatingForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      invertScale: false,
      customQuestionEmojis: convertToEmojis(arrayEmojis)
    }
  });

  const { fields: fieldsAttributes, append: appendAttribute, remove: removeAttribute, move: moveAttribute } = useFieldArray({
    control,
    name: "customQuestionAttributes"
  });
  const { fields: fieldsEmojis, append: appendEmojis, remove: removeEmojis } = useFieldArray({
    control,
    name: "customQuestionEmojis"
  });

  const invertScale = watch("invertScale")

  const onChangeOption = (item: OptionItem) => {
    let emojis = []
    switch (item.id) {
      case FaceType.FIVE:
        emojis = convertToEmojis(arrayEmojis)
        break;
      case FaceType.THREE:
        emojis = convertToEmojis([arrayEmojis[0], arrayEmojis[2], arrayEmojis[4]]);
        break;
    }
    if (invertScale) emojis = emojis.reverse()
    removeEmojis();
    appendEmojis(emojis)
  }

  const isShowMultiAttributes = useMemo(() => !!fieldsAttributes?.length, [fieldsAttributes])

  const { getCustomQuestionSmileyRatingCost, getCostCurrency } = usePrice()

  const price = useMemo(() => {
    if (!questionType) return
    return getCustomQuestionSmileyRatingCost(questionType, fieldsAttributes.length, project)
  }, [questionType, fieldsAttributes, getCustomQuestionSmileyRatingCost, project])

  const onAddAttribute = () => {
    if (fieldsAttributes?.length >= questionType.maxAttribute) return

    appendAttribute({
      attribute: ''
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
      invertScale: false,
      customQuestionAttributes: [],
      customQuestionEmojis: convertToEmojis(arrayEmojis)
    })
  };

  const _onSubmit = (value: SmileyRatingForm) => {
    const data: CreateOrEditCustomQuestionInput = {
      projectId: project.id,
      title: value.title,
      invertScale: value.invertScale,
      typeId: ECustomQuestionType.Smiley_Rating,
      customQuestionEmojis: value.customQuestionEmojis?.map(it => ({
        id: it.id,
        label: it.label,
        emojiId: it.emojiId
      })),
      customQuestionAttributes: value.customQuestionAttributes?.map(it => ({
        id: it.id,
        attribute: it.attribute
      }))
    }
    onSubmit(data);
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
        invertScale: questionEdit.invertScale,
        customQuestionEmojis: questionEdit.customQuestionEmojis?.map(it => ({
          id: it.id,
          label: it.label,
          emojiId: it.emojiId
        })),
        customQuestionAttributes: questionEdit.customQuestionAttributes?.map(it => ({
          id: it.id,
          attribute: it.attribute
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

  const smileyScale = useMemo(() => {
    const numberFace = fieldsEmojis.length
    switch (numberFace) {
      case FaceType.THREE:
        return emojiFaces.find(it => it.id === FaceType.THREE)
      case FaceType.FIVE:
        return emojiFaces.find(it => it.id === FaceType.FIVE)
    }
  }, [fieldsEmojis])

  const onChangeInvertScale = () => {
    const customQuestionEmojis = [...getValues("customQuestionEmojis")].reverse()
    removeEmojis()
    appendEmojis(customQuestionEmojis)
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
          <Heading3 translation-key="setup_survey_popup_add_smiley_rating_title">
            {t("setup_survey_popup_add_smiley_rating_title")}
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
            <Grid className={classes.smileyRatingContainer}>
              <Grid className={classes.emojiHeader}>
                <Heading5 translation-key="setup_survey_popup_smiley_rating_scale">{t("setup_survey_popup_smiley_rating_scale")}</Heading5>
                <InputSelect
                  className={classes.selectBox}
                  bindLabel="translation"
                  selectProps={{
                    options: emojiFaces,
                    value: smileyScale,
                    onChange: (val: any, _: any) => onChangeOption(val)
                  }}
                />
              </Grid>
              <Grid className={classes.emojiContainer} spacing={3} container>
                {fieldsEmojis?.map((field, index) => (
                  <Grid item className={classes.emojiContent} key={field.id}>
                    <Grid className={classes.emojiItem}>
                      <Emoji emojiId={field.emojiId} />
                      <InputLineTextfield
                        className={classes.inputEmojis}
                        type="text"
                        translation-key-placeholder="setup_survey_popup_label_emoji_placeholder"
                        placeholder={t("setup_survey_popup_label_emoji_placeholder")}
                        autoComplete="off"
                        inputProps={{ tabIndex: 2 }}
                        autoFocus
                        inputRef={register(`customQuestionEmojis.${index}.label`)}
                        errorMessage={errors.customQuestionEmojis?.[index]?.label?.message}
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
                      />
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid className={classes.invertScaleContainer}>
              <Heading5 $colorName={!invertScale && "--gray-60"} translation-key="setup_survey_popup_invert_scale">
                {t("setup_survey_popup_invert_scale")}
              </Heading5>
              <Controller
                name="invertScale"
                control={control}
                render={({ field }) =>
                  <Toggle
                    checked={field.value}
                    className={classes.toggle}
                    onChange={(e) => {
                      onChangeInvertScale()
                      field.onChange(e)
                    }}
                  />}
              />
            </Grid>
            <Grid>
              <div className={classes.multiAttributeControl}>
                <Heading5 $colorName={!isShowMultiAttributes && "--gray-60"} translation-key="setup_survey_popup_multiple_attributes_title">
                  {t("setup_survey_popup_multiple_attributes_title")}
                </Heading5>
                <Toggle
                  checked={isShowMultiAttributes}
                  className={classes.toggle}
                  onChange={onToggleMultipleAttributes}
                />
              </div>
              <ParagraphBody
                $colorName={isShowMultiAttributes ? "--gray-80" : "--gray-60"} translation-key="setup_survey_popup_multiple_attributes_subtitle">
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
                                    <Grid className={classes.inputContainer}>
                                      <InputLineTextfield
                                        className={classes.inputAttribute}
                                        type="text"
                                        translation-key-placeholder="setup_survey_popup_attribute_label_placeholder"
                                        placeholder={t("setup_survey_popup_attribute_label_placeholder")}
                                        autoComplete="off"
                                        inputProps={{ tabIndex: 3 }}
                                        autoFocus={index === focusEleIdx}
                                        onFocus={() => setFocusEleIdx(-1)}
                                        inputRef={register(`customQuestionAttributes.${index}.attribute`)}
                                        errorMessage={errors.customQuestionAttributes?.[index]?.attribute?.message}
                                      />
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

export default PopupSmileyRating;
