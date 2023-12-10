import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Grid,
  Dialog,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CreateOrEditCustomQuestionInput,
  CustomQuestion,
  CustomQuestionType,
  ECustomQuestionType,
} from "models/custom_question";

import classes from "./styles.module.scss";
import { Project } from "models/project";
import { useTranslation } from "react-i18next";
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import Heading3 from "components/common/text/Heading3";
import ButtonCLose from "components/common/buttons/ButtonClose";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading5 from "components/common/text/Heading5";
import { usePrice } from "helpers/price";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import InputTextfield from "components/common/inputs/InputTextfield";

interface OpenQuestionForm {
  title: string;
}

interface Props {
  isOpen: boolean;
  project: Project;
  questionEdit: CustomQuestion;
  questionType: CustomQuestionType;
  onClose: () => void;
  onSubmit: (data: CreateOrEditCustomQuestionInput) => void;
}

const PopupOpenQuestion = (props: Props) => {
  const { t, i18n } = useTranslation();

  const { isOpen, questionEdit, questionType, project, onClose, onSubmit } = props;

  const schema = useMemo(() => {
    return yup.object().shape({
      title: yup.string().required("Question title is required"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionType, i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OpenQuestionForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { getCustomQuestionOpenQuestionCost } = usePrice()

  const price = useMemo(() => {
    if (!questionType) return
    return getCustomQuestionOpenQuestionCost(questionType, project)
  }, [questionType, project, getCustomQuestionOpenQuestionCost])

  useEffect(() => {
    if (questionEdit) {
      reset({
        title: questionEdit.title,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionEdit]);

  const _onSubmit = (value: OpenQuestionForm) => {
    const data: CreateOrEditCustomQuestionInput = {
      projectId: project.id,
      title: value.title,
      typeId: ECustomQuestionType.Open_Question,
    }
    onSubmit(data)
  };

  const clearForm = () => {
    reset({
      title: "",
    });
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
      <form onSubmit={handleSubmit(_onSubmit)} className={classes.form}>
        <DialogTitle>
          <Heading3 translation-key="setup_survey_popup_add_open_question_title">
            {t("setup_survey_popup_add_open_question_title")}
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

export default PopupOpenQuestion;
