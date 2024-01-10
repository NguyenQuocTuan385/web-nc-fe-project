import { User } from "models/user";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { loginStatus, selectCurrentUser, selectToken } from "reduxes/Auth";
import { routes } from "routes/routes";

interface PropsData {
  availableRoles: number[];
}

const RequireAuth = (props: PropsData) => {
  const token = useSelector(selectToken);
  const currentUser: User = useSelector(selectCurrentUser);
  const location = useLocation();

  return currentUser?.role && props.availableRoles.includes(currentUser.role.id) ? (
    <Outlet />
  ) : token ? (
    <Navigate to={routes.general.unAuthorized} state={{ from: location }} replace />
  ) : (
    <Navigate to={routes.admin.authentication.login} state={{ from: location }} replace />
  );
};

export default RequireAuth;
