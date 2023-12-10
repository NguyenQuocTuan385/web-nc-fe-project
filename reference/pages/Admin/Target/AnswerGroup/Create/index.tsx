import { push } from "connected-react-router"
import { memo } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import { TargetAnswerGroupService } from "services/admin/target_answer_group"
import AnswerGroupForm, { AnswerGroupFormData } from "../components/AnswerGroupForm"

interface Props {

}

const CreateAnswerGroup = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id: questionId } = useParams<{ id: string }>();

  const onSubmit = (value: AnswerGroupFormData) => {
    dispatch(setLoading(true))
    TargetAnswerGroupService.create({
      name: value.name,
      order: value.order,
      questionId: Number(questionId)
    })
      .then(() => {
        dispatch(push(routes.admin.target.question.answerGroup.root.replace(":id", questionId)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <AnswerGroupForm
        title="Create Answer Group"
        questionId={Number(questionId)}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default CreateAnswerGroup