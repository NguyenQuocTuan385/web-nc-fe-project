import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import AnswerForm, { AnswerFormData } from "../components/AnswerForm"
import { TargetAnswer, UpdateAnswerParams } from "models/Admin/target";
import { TargetAnswerService } from "services/admin/target_answer";

interface IQueryString {
  lang?: string;
}

interface Props {

}

const EditAnswer = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id: questionId, answerId } = useParams<{ id: string, answerId: string }>();
  const [itemEdit, setItemEdit] = useState<TargetAnswer>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if (answerId && !isNaN(Number(answerId))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        TargetAnswerService.getAnswer(Number(answerId), lang)
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [answerId, lang, dispatch])

  const onSubmit = (data: AnswerFormData) => {
    dispatch(setLoading(true))
    const form: UpdateAnswerParams = {
      name: data.name,
      order: data.order,
      code: data.code,
      description: data.description,
      exclusive: data.exclusive,
      groupId: data.groupId?.id,
      questionId: Number(questionId)
    }
    if (lang) form.language = lang
    TargetAnswerService.update(Number(answerId), form)
      .then(() => {
        dispatch(push(routes.admin.target.question.answer.root.replace(":id", questionId)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <AnswerForm
        title="Edit Answer"
        questionId={Number(questionId)}
        langEdit={lang}
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default EditAnswer