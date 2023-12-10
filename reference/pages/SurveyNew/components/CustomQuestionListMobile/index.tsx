import { memo, SyntheticEvent, useState } from "react";
import clsx from "clsx";
import { CustomQuestion, ECustomQuestionType } from "models/custom_question";
import Images from "config/images";
import classes from "./styles.module.scss";
import { Button, Collapse, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { usePrice } from "helpers/price";

interface CustomQuestionListMobileProps {
  questions: CustomQuestion[];
  onEditQuestion: (question: CustomQuestion) => void;
  onShowConfirmDeleteQuestion: (question: CustomQuestion) => void;
  editableProject: boolean;
}

const CustomQuestionListMobile = memo(
  (props: CustomQuestionListMobileProps) => {
    const {
      questions,
      onEditQuestion,
      onShowConfirmDeleteQuestion,
      editableProject,
    } = props;
    const { t } = useTranslation();
    const [expandId, setExpandId] = useState<number>();

    const { getCustomQuestionItemCost } = usePrice()

    const getPrice = (customQuestion: CustomQuestion) => {
      return getCustomQuestionItemCost(customQuestion)
    }

    const handleClickQuestion = (id: number) => {
      setExpandId(id === expandId ? null : id);
    };

    const handleIcon = (typeId: number) => {
      switch (typeId) {
        case ECustomQuestionType.Open_Question: {
          return Images.icOpenQuestion;
        }
        case ECustomQuestionType.Single_Choice: {
          return Images.icSingleChoice;
        }
        case ECustomQuestionType.Multiple_Choices: {
          return Images.icMultipleChoices;
        }
        default: {
          return null;
        }
      }
    };

    const handleEditQuestion = (
      e: SyntheticEvent<EventTarget>,
      question: CustomQuestion
    ) => {
      e.stopPropagation();
      onEditQuestion(question);
    };

    const handleDeleteQuestion = (
      e: SyntheticEvent<EventTarget>,
      question: CustomQuestion
    ) => {
      e.stopPropagation();
      onShowConfirmDeleteQuestion(question);
    };

    return (
      <div className={classes.container}>
        {questions.map((item, index) => {
          const isExpanded = item.id === expandId;
          return (
            <Grid
              className={clsx(classes.item, { [classes.expand]: isExpanded, [classes.uneditable]: !editableProject })}
              key={index}
              onClick={() => {
                handleClickQuestion(item.id);
              }}
            >
              <Grid style={{ width: "100%" }}>
                {!isExpanded && (
                  <div className={classes.content}>
                    <img src={handleIcon(item.typeId)} alt="" />
                    <p>{item.title}</p>
                  </div>
                )}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <div className={classes.content}>
                    <img
                      src={
                        item.typeId === 1
                          ? Images.icOpenQuestion
                          : item.typeId === 2
                            ? Images.icSingleChoice
                            : Images.icMultipleChoices
                      }
                      alt=""
                    />
                    <p>{item.title}</p>
                  </div>
                  <div className={classes.price}>
                    <span>{getPrice(item)?.show}</span>
                  </div>
                  {editableProject && (
                    <div className={classes.buttons}>
                      <Button
                        className={classes.editButton}
                        onClick={(e) => handleEditQuestion(e, item)}
                        translation-key="common_edit"
                      >
                        {t("common_edit")}
                      </Button>
                      <Button
                        className={classes.deleteButton}
                        onClick={(e) => handleDeleteQuestion(e, item)}
                        translation-key="common_delete"
                      >
                        {t("common_delete")}
                      </Button>
                    </div>
                  )}
                </Collapse>
              </Grid>
            </Grid>
          );
        })}
      </div>
    );
  }
);

export default CustomQuestionListMobile;
