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
import Userservice from "services/user";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector(selectToken);
  const user = useSelector(selectCurrentUser);
  const isLoggedIn = useSelector(selectLoginStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    const verifyRefreshToken = AuthenticationService.refresh;

    token === null && user === null && !isLoggedIn
      ? verifyRefreshToken()
          .then((res) => {
            const newToken = res.access_token;
            dispatch(setLogin({ token: newToken }));

            const email = jwtDecode(newToken).sub;
            console.log(newToken);

            api
              .get(`${API.USER.EMAIL.replace(":email", `${email}`)}`, {
                headers: { Authorization: `Bearer ${newToken}` }
              })
              .then((res) => {
                dispatch(setLogin({ user: res.data, token: newToken }));

                console.log(res.data);
                dispatch(loginStatus(true));
              })
              .catch((e) => {
                console.log(e);
              });
          })
          .catch((e) => {
            dispatch(loginStatus(false));
          })
      : setIsLoading(false);
  }, [token]);

  return <>{isLoading ? <p>Loading</p> : <Outlet />} </>;
};

export default PersistLogin;
