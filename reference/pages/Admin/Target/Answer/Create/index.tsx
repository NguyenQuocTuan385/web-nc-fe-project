import { push } from "connected-react-router"
import { memo } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import { TargetAnswerService } from "services/admin/target_answer"
import AnswerForm, { AnswerFormData } from "../components/AnswerForm"

interface Props {

}

const CreateAnswer = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id: questionId } = useParams<{ id: string }>();

  const onSubmit = (value: AnswerFormData) => {
    dispatch(setLoading(true))
    TargetAnswerService.create({
      name: value.name,
      order: value.order,
      code: value.code,
      description: value.description,
      exclusive: value.exclusive,
      groupId: value.groupId?.id,
      questionId: Number(questionId)
    })
      .then(() => {
        dispatch(push(routes.admin.target.question.answer.root.replace(":id", questionId)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <AnswerForm
        title="Create Answer"
        questionId={Number(questionId)}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default CreateAnswer