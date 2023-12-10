import { push } from "connected-react-router"
import { ETypeVerifyCode } from "models/general"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { setLoading } from "redux/reducers/Status/actionTypes"
import { routes } from "routers/routes"
import UserService from "services/user"
import QueryString from 'query-string';

interface IQueryString {
  email?: string
}

interface Params {
  code: string
}

const CallbackForgotPassword = () => {
  const { code } = useParams<Params>()
  const { email }: IQueryString = QueryString.parse(window.location.search);

  const dispatch = useDispatch()

  useEffect(() => {
    if (!code) {
      dispatch(push(routes.login))
      return
    }
    const checkIsValidCode = () => {
      dispatch(setLoading(true))
      UserService.checkIsValidCode({
        code: code,
        type: ETypeVerifyCode.RESET_PASSWORD
      })
        .then(() => {
          dispatch(push({
            pathname: routes.resetPassword.replace(":code", code),
            search: email && `?email=${email}`
          }));
        })
        .catch(() => {
          dispatch(push(routes.invalidResetPassword))
        })
        .finally(() => dispatch(setLoading(false)))
    }
    checkIsValidCode()
  }, [code])
  return null
}

export default CallbackForgotPassword