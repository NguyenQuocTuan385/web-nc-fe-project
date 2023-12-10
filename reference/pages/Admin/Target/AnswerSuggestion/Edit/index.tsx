import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import AnswerSuggestionForm, { AnswerSuggestionFormData } from "../components/AnswerSuggestionForm"
import { TargetAnswerSuggestion, UpdateAnswerSuggestionParams } from "models/Admin/target";
import { TargetAnswerSuggestionService } from "services/admin/target_answer_suggestion";

interface IQueryString {
  lang?: string;
}

interface Props {

}

const EditAnswerSuggestion = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id: questionId, answerSuggestionId } = useParams<{ id: string, answerSuggestionId: string }>();
  const [itemEdit, setItemEdit] = useState<TargetAnswerSuggestion>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if (answerSuggestionId && !isNaN(Number(answerSuggestionId))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        TargetAnswerSuggestionService.getAnswerSuggestion(Number(answerSuggestionId), lang)
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [answerSuggestionId, lang, dispatch])

  const onSubmit = (data: AnswerSuggestionFormData) => {
    dispatch(setLoading(true))
    const form: UpdateAnswerSuggestionParams = {
      name: data.name,
      order: data.order,
      questionId: Number(questionId),
      answerIds: data.answerIds?.map(it => it.id) || [],
      groupIds: data.groupIds?.map(it => it.id) || [],
    }
    if (lang) form.language = lang
    TargetAnswerSuggestionService.update(Number(answerSuggestionId), form)
      .then(() => {
        dispatch(push(routes.admin.target.question.answerSuggestion.root.replace(":id", questionId)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <AnswerSuggestionForm
        title="Edit Suggestion"
        questionId={Number(questionId)}
        langEdit={lang}
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default EditAnswerSuggestion