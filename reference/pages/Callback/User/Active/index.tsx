import { push } from "connected-react-router"
import { EKey } from "models/general"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { setUserLogin, setVerifiedSuccess } from "redux/reducers/User/actionTypes"
import { routes } from "routers/routes"
import UserService from "services/user"

interface Params {
  code: string
}

const CallbackActiveUser = () => {
  const { code } = useParams<Params>()
  const dispatch = useDispatch()
  
  useEffect(() => {
    if(!code) {
      dispatch(push(routes.login))
      return
    }
    const activeUser = async () => {
      dispatch(setLoading(true))
      UserService.active(code)
        .then((res) => {
          localStorage.setItem(EKey.TOKEN, res.token)
          dispatch(setUserLogin(res.user))
          dispatch(push(routes.project.management))
          dispatch(setVerifiedSuccess(true))
        })
        .catch((e) => {
          dispatch(push(routes.login))
          dispatch(setErrorMess(e))
        })
        .finally(() => dispatch(setLoading(false)))
    }
    activeUser()
  }, [code])
  return null
}

export default CallbackActiveUser