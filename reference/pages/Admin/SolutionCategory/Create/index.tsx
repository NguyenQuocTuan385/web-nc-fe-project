import { push } from "connected-react-router"
import { memo } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import AdminSolutionService from "services/admin/solution"
import SolutionCategoryForm, { SolutionCategoryFormData } from "../components/SolutionCategoryForm"

interface Props {

}

const Create = memo((props: Props) => {

  const dispatch = useDispatch()

  const onSubmit = (data: SolutionCategoryFormData) => {
    dispatch(setLoading(true))
    AdminSolutionService.createSolutionCategory({
      name: data.name
    })
    .then(() => {
      dispatch(push(routes.admin.solutionCategory.root))
    })
    .catch((e) => dispatch(setErrorMess(e)))
    .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <SolutionCategoryForm 
        title={'Create Solution Category'}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default Create