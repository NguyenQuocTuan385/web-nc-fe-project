import { User } from "models/user";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectCurrentUser, selectToken } from "reduxes/Auth";
import { routes } from "routes/routes";

interface PropsData {
  availableRole: number;
}

const RequireAuth = (props: PropsData) => {
  const token = useSelector(selectToken);
  const currentUser: User = useSelector(selectCurrentUser);
  const location = useLocation();
  let canOutlet = false;

  return token && currentUser.role.id === props.availableRole ? (
    <Outlet />
  ) : (
    <Navigate to={routes.admin.authentication.login} state={{ from: location }} replace />
  );
};

export default RequireAuth;
