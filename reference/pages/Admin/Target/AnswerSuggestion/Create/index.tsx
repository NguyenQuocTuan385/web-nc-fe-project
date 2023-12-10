import { push } from "connected-react-router"
import { memo } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import { TargetAnswerSuggestionService } from "services/admin/target_answer_suggestion"
import AnswerSuggestionForm, { AnswerSuggestionFormData } from "../components/AnswerSuggestionForm"

interface Props {

}

const CreateAnswerSuggestion = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id: questionId } = useParams<{ id: string }>();

  const onSubmit = (value: AnswerSuggestionFormData) => {
    dispatch(setLoading(true))
    TargetAnswerSuggestionService.create({
      name: value.name,
      order: value.order,
      questionId: Number(questionId),
      answerIds: value.answerIds?.map(it => it.id) || [],
      groupIds: value.groupIds?.map(it => it.id) || [],
    })
      .then(() => {
        dispatch(push(routes.admin.target.question.answerSuggestion.root.replace(":id", questionId)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <AnswerSuggestionForm
        title="Create Answer Suggestion"
        questionId={Number(questionId)}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default CreateAnswerSuggestion