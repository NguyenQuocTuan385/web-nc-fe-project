import { Dispatch, memo, SetStateAction, SyntheticEvent } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import Images from "config/images";
import { IconButton } from "@mui/material";
import { CustomQuestion, ECustomQuestionType } from "models/custom_question";
import classes from "./styles.module.scss";
import { usePrice } from "helpers/price";

interface CustomQuestionDragListProps {
  questions: CustomQuestion[];
  setQuestions: Dispatch<SetStateAction<CustomQuestion[]>>;
  onUpdateOrderQuestion: (newList: CustomQuestion[]) => void;
  onEditQuestion: (question: CustomQuestion) => void;
  onShowConfirmDeleteQuestion: (question: CustomQuestion) => void;
  editableProject: boolean;
}

const CustomQuestionDragList = memo((props: CustomQuestionDragListProps) => {
  const {
    questions,
    setQuestions,
    onUpdateOrderQuestion,
    onEditQuestion,
    onShowConfirmDeleteQuestion,
    editableProject,
  } = props;

  const { getCustomQuestionItemCost } = usePrice()

  const getPrice = (customQuestion: CustomQuestion) => {
    return getCustomQuestionItemCost(customQuestion)
  }

  const reorder = (items, startIndex, endIndex) => {
    const result: CustomQuestion[] = Array.from(items);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return;
    }
    const result: CustomQuestion[] = reorder(
      questions,
      source.index,
      destination.index
    );
    setQuestions(result);
    onUpdateOrderQuestion(result);
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
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-list-custom-question">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {questions.map((item, index) => (
                <Draggable
                  draggableId={item.id.toString()}
                  index={index}
                  key={item.id}
                  isDragDisabled={!editableProject}
                >
                  {(provided) => (
                    <div
                      className={classes.listItem}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className={classes.listItemContent}>
                        {editableProject && (
                          <img
                            className={classes.hide}
                            src={Images.icDrag}
                            alt=""
                          />
                        )}
                        <div className={classes.question}>
                          <img src={handleIcon(item.typeId)} alt="" />
                          <p>{item.title}</p>
                          <span className={classes.hide}>
                            {getPrice(item)?.show}
                          </span>
                        </div>                       
                      </div>
                      {editableProject && (
                        <div>
                          <div className={classes.btnAction}>
                            <IconButton
                              onClick={(e) => handleEditQuestion(e, item)}
                              className={classes.iconAction}
                              edge="end"
                              aria-label="Edit"
                            >
                              <img src={Images.icRename} alt="" />
                            </IconButton>
                            <IconButton
                              onClick={(e) => handleDeleteQuestion(e, item)}
                              className={classes.iconAction}
                              edge="end"
                              aria-label="Delete"
                            >
                              <img src={Images.icDelete} alt="" />
                            </IconButton>
                          </div>
                        </div>
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
    </div>
  );
});

export default CustomQuestionDragList;
