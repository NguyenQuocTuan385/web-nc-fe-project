import { push } from "connected-react-router"
import { memo } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import AdminSolutionService from "services/admin/solution"
import SolutionForm from "../components/SolutionForm"

interface Props {

}

const CreateSolution = memo((props: Props) => {

  const dispatch = useDispatch()

  const onSubmit = (data: FormData) => {
    dispatch(setLoading(true))
    AdminSolutionService.createSolution(data)
      .then(() => {
        dispatch(push(routes.admin.solution.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <SolutionForm
        title="Create Solution"
        onSubmit={onSubmit}
      />
    </>
  )
})

export default CreateSolution