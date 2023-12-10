import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import AdminPlanService from "services/admin/plan"
import FormContent from "../components/FormContent"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import { CreateOrUpdatePlanInput, Plan } from "models/Admin/plan"

interface IQueryString {
  lang?: string
}

interface Props {

}

const Edit = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<Plan>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        AdminPlanService.getPlan(Number(id), lang)
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, lang, dispatch])



  const onSubmit = (data: CreateOrUpdatePlanInput) => {
    dispatch(setLoading(true))
    AdminPlanService.update(Number(id), data)
      .then(() => {
        dispatch(push(routes.admin.plan.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <FormContent
        langEdit={lang}
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default Edit