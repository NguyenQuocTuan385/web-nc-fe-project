import { memo } from "react"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import UserForm from "../components/UserForm"
import AdminUserService from "services/admin/user"

interface Props {

}

const Create = memo((props: Props) => {

  const dispatch = useDispatch()

  const onSubmit = (data: FormData) => {
    dispatch(setLoading(true))
    AdminUserService.create(data)
      .then(() => {
        dispatch(push(routes.admin.user.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <UserForm
        onSubmit={onSubmit}
      />
    </>
  )
})

export default Create