import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import QuestionForm, { QuestionFormData } from "../components/QuestionForm"
import { TargetQuestionService } from "services/admin/target_question";
import { TargetQuestion, UpdateQuestionParams } from "models/Admin/target";

interface IQueryString {
  lang?: string;
}

interface Props {

}

const EditQuestion = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<TargetQuestion>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        TargetQuestionService.getQuetion(Number(id), lang)
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, lang, dispatch])

  const onSubmit = (data: QuestionFormData) => {
    dispatch(setLoading(true))
    const form: UpdateQuestionParams = {
      name: data.name,
      title: data.title,
      order: data.order,
      code: data.code,
      typeId: data.typeId.id,
      renderTypeId: data.renderTypeId.id,
      answerGroupName: data.answerGroupName,
      showOptionAll: data.showOptionAll
    }
    if (lang) form.language = lang
    TargetQuestionService.update(Number(id), form)
      .then(() => {
        dispatch(push(routes.admin.target.question.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <QuestionForm
        title="Edit Question"
        langEdit={lang}
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default EditQuestion