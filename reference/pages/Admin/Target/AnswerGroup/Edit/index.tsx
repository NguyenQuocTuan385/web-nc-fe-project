import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import AnswerGroupForm, { AnswerGroupFormData } from "../components/AnswerGroupForm"
import { TargetAnswerGroup, UpdateAnswerGroupParams } from "models/Admin/target";
import { TargetAnswerGroupService } from "services/admin/target_answer_group";

interface IQueryString {
  lang?: string;
}

interface Props {

}

const EditAnswerGroup = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id: questionId, answerGroupId } = useParams<{ id: string, answerGroupId: string }>();
  const [itemEdit, setItemEdit] = useState<TargetAnswerGroup>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if (answerGroupId && !isNaN(Number(answerGroupId))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        TargetAnswerGroupService.getAnswerGroup(Number(answerGroupId), lang)
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [answerGroupId, lang, dispatch])

  const onSubmit = (data: AnswerGroupFormData) => {
    dispatch(setLoading(true))
    const form: UpdateAnswerGroupParams = {
      name: data.name,
      order: data.order,
    }
    if (lang) form.language = lang
    TargetAnswerGroupService.update(Number(answerGroupId), form)
      .then(() => {
        dispatch(push(routes.admin.target.question.answerGroup.root.replace(":id", questionId)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <AnswerGroupForm
        title="Edit Answer Group"
        questionId={Number(questionId)}
        langEdit={lang}
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default EditAnswerGroup