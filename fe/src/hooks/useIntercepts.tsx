import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectToken, setLogin } from "reduxes/Auth";
import { AuthenticationService } from "services/authentication";
import api from "services/configApi";

const useIntercepts = () => {
  const accessToken = useSelector(selectToken);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      (request) => {
        if (!request.headers.Authorization) {
          request.headers.Authorization = `Bearer ${accessToken}`;
        }

        return request;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const prevRequest = error?.config;

        if (error.response.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;

          const res = await AuthenticationService.refresh();
          const newAccessToken = res["access_token"];

          dispatch(setLogin({ user: currentUser, token: newAccessToken }));

          prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(prevRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken]);

  return api;
};

export default useIntercepts;
