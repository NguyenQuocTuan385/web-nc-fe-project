import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import QuotaTableForm, { QuotaTableFormData } from "../components/QuotaTableForm"
import { AdminQuotaService } from "services/admin/quota";
import { QuotaTable, UpdateQuotaTableParams } from "models/Admin/quota";

interface IQueryString {
  lang?: string;
}

interface Props {

}

const EditQuotaTable = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<QuotaTable>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if(id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        AdminQuotaService.getQuotaTable(Number(id), lang)
        .then((res) => {
          setItemEdit(res)
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, lang, dispatch])

  const onSubmit = (data: QuotaTableFormData) => {
    dispatch(setLoading(true))
    const form: UpdateQuotaTableParams = {
      title: data.title,
      titleCell: data.titleCell,
      order: data.order,
      questionIds: data.questionIds.map(it => it.id),
      calculations: data.calculations
    }
    if (lang) form.language = lang
    AdminQuotaService.updateQuotaTable(Number(id), form)
      .then(() => {
        dispatch(push(routes.admin.quotaTable.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }
  
  return (
    <>
      <QuotaTableForm
        langEdit={lang}
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default EditQuotaTable