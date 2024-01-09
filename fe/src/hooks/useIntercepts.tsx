import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginStatus, selectLoginStatus, selectToken, setLogin } from "reduxes/Auth";
import { AuthenticationService } from "services/authentication";
import api, { apiAuth } from "services/configApi";
import { jwtDecode } from "jwt-decode";
import { API } from "config/constant";

const useIntercepts = () => {
  const accessToken = useSelector(selectToken);
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
          const email = jwtDecode(newAccessToken).sub;
          const userResponse = await apiAuth.get(
            `${API.USER.EMAIL.replace(":email", `${email}`)}`,
            {
              headers: { Authorization: `Bearer ${newAccessToken}` }
            }
          );

          dispatch(setLogin({ user: userResponse.data, token: newAccessToken }));
          dispatch(loginStatus(true));

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
  }, []);

  return api;
};

export default useIntercepts;
