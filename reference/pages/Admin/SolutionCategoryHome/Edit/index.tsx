import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import AdminSolutionService from "services/admin/solution"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import { SolutionCategoryHome } from "models/Admin/solution"
import SolutionForm from "../components/SolutionForm"

interface IQueryString {
  lang?: string;
}

interface Props {

}

const Edit= memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<SolutionCategoryHome>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if(id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        AdminSolutionService.getSolutionCategoryHome(Number(id), lang)
        .then((res) => {
          setItemEdit(res)
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, lang, dispatch])

  const onSubmit = (data: FormData) => {
    dispatch(setLoading(true))
    AdminSolutionService.updateSolutionCategoryHome(Number(id), data)
      .then(() => {
        dispatch(push(routes.admin.solutionCategoryHome.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }
  
  return (
    <>
       <SolutionForm
        title="Edit Solution Category Home"
        langEdit={lang}
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default Edit