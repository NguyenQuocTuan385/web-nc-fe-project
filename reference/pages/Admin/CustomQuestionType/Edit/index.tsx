import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import CustomQuestionTypeForm, { CustomQuestionTypeFormData } from "../components/CustomQuestionTypeForm"
import { AdminCustomQuestionTypeService } from "services/admin/custom_question_type";
import { CustomQuestionType, AdminUpdateCustomQuestionType } from "models/Admin/custom_question_type";

interface IQueryString {
  lang?: string;
}

interface Props {

}

const Edit = memo(({}: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<CustomQuestionType>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if(id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        AdminCustomQuestionTypeService.getCustomQuestionType(Number(id), lang)
        .then((res) => {
          setItemEdit(res)
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, lang, dispatch])

  const onSubmit = (data: CustomQuestionTypeFormData) => {
    dispatch(setLoading(true))
    const form: AdminUpdateCustomQuestionType = {
      title: data.title,
      order: data.order,
      price: data.price ?? 0,
      priceAttribute: data.priceAttribute ?? 0,
      minAnswer: data.minAnswer ?? 0,
      maxAnswer: data.maxAnswer ?? 0,
      maxAttribute: data.maxAttribute ?? 0,
      status: data.status.id
    }
    if (lang) form.language = lang
    AdminCustomQuestionTypeService.update(Number(id), form)
      .then(() => {
        dispatch(push(routes.admin.customQuestionType.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }
  
  return (
    <>
      <CustomQuestionTypeForm
        langEdit={lang}
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default Edit