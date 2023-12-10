import { memo, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import UserForm from "../components/UserForm"
import AdminUserService from "services/admin/user"
import { User } from "models/user"

interface Props {

}

const Edit = memo((props: Props) => {

  const dispatch = useDispatch()
  const { id } = useParams<{ id: string }>();
  const [itemEdit, setItemEdit] = useState<User>(null);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        AdminUserService.getUser(Number(id))
          .then((res) => {
            setItemEdit(res)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    }
  }, [id, dispatch])

  const onSubmit = (data: FormData) => {
    dispatch(setLoading(true))
    AdminUserService.update(Number(id), data)
      .then(() => {
        dispatch(push(routes.admin.user.root))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      <UserForm
        itemEdit={itemEdit}
        onSubmit={onSubmit}
      />
    </>
  )
})

export default Edit