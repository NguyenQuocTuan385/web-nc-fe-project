import useAuth from 'hooks/useAuth';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { routes } from './routes';

interface PrivateRouteProps extends RouteProps {
}

const AdminRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
  const { isLoggedIn, isAdmin, isSuperAdmin } = useAuth()
  return (
    <Route
      {...rest}
      render={props => {
        if (isLoggedIn && (isAdmin || isSuperAdmin)) return (<Component {...props} />)
        if (isLoggedIn) {
          return <Redirect
            to={{
              pathname: routes.project.management,
              state: {
                from: props.location
              }
            }}
          />
        }
        return <Redirect
          to={{
            pathname: routes.login,
            state: {
              from: props.location
            }
          }}
        />
      }}
    />
  );
};

export default AdminRoute;