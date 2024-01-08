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

            Userservice.getUserbyId(Number(localStorage.getItem(EStorageKey.uid.toString()))).then(
              (res) => {
                dispatch(setLogin({ user: res }));
                dispatch(loginStatus(true));
              }
            );
          })
          .catch((e) => {
            dispatch(loginStatus(false));
          })
      : setIsLoading(false);
  }, [token]);

  return <>{isLoading ? <p>Loading</p> : <Outlet />} </>;
};

export default PersistLogin;
