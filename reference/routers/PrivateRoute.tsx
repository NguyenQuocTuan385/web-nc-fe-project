import useAuth from 'hooks/useAuth';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { routes } from './routes';
import TagManager from 'react-gtm-module'

interface PrivateRouteProps extends RouteProps {
  isAllowGuest?: boolean;
}

const PrivateRoute = ({ component: Component, isAllowGuest, ...rest }: PrivateRouteProps) => {
  const { isLoggedIn, isGuest } = useAuth();

  TagManager.dataLayer({
    dataLayerName: "PrivatePage",
  });

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoggedIn) {
          if (isGuest) {
            if (isAllowGuest) return <Component {...props} />;
            return (
              <Redirect
                to={{
                  pathname: routes.project.management,
                }}
              />
            );
          } 
          return <Component {...props} />;
        }
        return (
          <Redirect
            to={{
              pathname: routes.login,
              state: {
                from: props.location,
              },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;