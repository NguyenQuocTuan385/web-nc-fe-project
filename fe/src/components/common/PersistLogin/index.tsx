import { API } from "config/constant";
import { jwtDecode } from "jwt-decode";
import { EStorageKey } from "models/general";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import {
  selectLoginStatus,
  selectCurrentUser,
  selectToken,
  setLogin,
  loginStatus
} from "reduxes/Auth";
import { AuthenticationService } from "services/authentication";
import api, { apiAuth } from "services/configApi";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector(selectToken);
  const user = useSelector(selectCurrentUser);

  const dispatch = useDispatch();

  useEffect(() => {
    const verifyRefreshToken = AuthenticationService.refresh;

    token === null && user === null
      ? verifyRefreshToken()
          .then(async (res) => {
            const newToken = res.access_token;
            const email = jwtDecode(newToken).sub;
            const userResponse = await api.get(`${API.USER.EMAIL.replace(":email", `${email}`)}`, {
              headers: { Authorization: `Bearer ${newToken}` }
            });

            dispatch(setLogin({ user: userResponse.data, token: newToken }));
            dispatch(loginStatus(true));
          })
          .catch((e) => {
            dispatch(loginStatus(false));
          })
          .finally(() => {
            setIsLoading(false);
          })
      : setIsLoading(false);
  }, []);

  return <>{isLoading ? <p>Loading</p> : <Outlet />} </>;
};

export default PersistLogin;
