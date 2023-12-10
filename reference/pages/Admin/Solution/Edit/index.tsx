import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import AdminSolutionService from "services/admin/solution"
import QueryString from 'query-string';
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import { Solution } from "models/Admin/solution"
import SolutionForm from "../components/SolutionForm"

interface IQueryString {
  lang?: string;
}

interface Props {

}

const EditSolution = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<Solution>(null);
  const { lang }: IQueryString = QueryString.parse(window.location.search);

  useEffect(() => {
    if(id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        AdminSolutionService.getSolution(Number(id), lang)
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
    AdminSolutionService.updateSolution(Number(id), data)
      .then(() => {
        dispatch(push(routes.admin.solution.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }
  
  return (
    <>
       <SolutionForm
        title="Edit Solution"
        langEdit={lang}
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default EditSolution