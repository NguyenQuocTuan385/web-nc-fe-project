import { push } from "connected-react-router"
import { CreateOrUpdatePlanInput } from "models/Admin/plan"
import { memo } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import AdminPlanService from "services/admin/plan"
import FormContent from "../components/FormContent"

interface Props {

}

const Create = memo(({}: Props) => {

  const dispatch = useDispatch()

  const onSubmit = (data: CreateOrUpdatePlanInput) => {
    dispatch(setLoading(true))
    AdminPlanService.create(data)
    .then(() => {
      dispatch(push(routes.admin.plan.root))
    })
    .catch((e) => dispatch(setErrorMess(e)))
    .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <FormContent 
        onSubmit={onSubmit}
      />
    </>
  )
})

export default Create