import { push } from "connected-react-router"
import UseAuth from "hooks/useAuth"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setCreateProjectRedirectReducer } from "redux/reducers/Project/actionTypes"
import { routes } from "routers/routes"
import QueryString from 'query-string';
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import UserService from "services/user"
import { EKey } from "models/general"
import { setUserLogin } from "redux/reducers/User/actionTypes"
import { v4 as uuidv4 } from 'uuid';
import { ProjectService } from "services/project"
interface IQueryString {
  solution?: string
  plan?: string
}

const CallbackTryCreateProject = () => {
  const { isLoggedIn } = UseAuth()
  const { solution, plan }: IQueryString = QueryString.parse(window.location.search);

  const dispatch = useDispatch()

  const getUuid = () => {
    let uuid = localStorage.getItem(EKey.BROWSER_ID);
    if (!uuid) {
      uuid = uuidv4();
      localStorage.setItem(EKey.BROWSER_ID, uuid);
    }
    return uuid;
  }
  const checkParam = async (solutionId?: string, planId?: string) => {
    if (!solutionId && !planId) {
      dispatch(push(routes.project.management))
      return;
    }
    dispatch(setLoading(true));
    ProjectService.checkParamsCreateProject({
      solutionId: Number(solutionId) || null,
      planId: Number(planId) || null
    })
      .then((res) => {
        if (res.data?.solutionId) {
          dispatch(setCreateProjectRedirectReducer({
            solutionId: Number(solution) || null,
            planId: Number(res.data?.planId) || null
          }))
          dispatch(push(routes.project.create))
        }
        else dispatch(push(routes.project.management))
      })
      .catch((e) => {
        dispatch(push(routes.project.create))
      })
      .finally(() => dispatch(setLoading(false)));

  }
  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(setLoading(true));
      UserService.getInfoUserGuest({
        uuid: getUuid(),
      })
        .then((res) => {
          localStorage.setItem(EKey.TOKEN_GUEST, res.data.token);
          dispatch(setUserLogin(res.data.user))
          checkParam(solution, plan)
        })
        .catch((e) => {
          dispatch(setErrorMess(e))
          dispatch(push(routes.login))
        })
        .finally(() => dispatch(setLoading(false)));
    }
    else {
      checkParam(solution, plan)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solution, plan, isLoggedIn])
  return null
}

export default CallbackTryCreateProject