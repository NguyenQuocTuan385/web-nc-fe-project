import { Route, Redirect, RouteProps } from 'react-router-dom';
import { routes } from './routes';
import useAuth from 'hooks/useAuth';
import TagManager from 'react-gtm-module'

interface PublicRouteProps extends RouteProps {
  
}

const PublicRoute = ({component: Component, ...rest }: PublicRouteProps) => {
    const { isLoggedIn, isGuest } = useAuth()

    TagManager.dataLayer({
      dataLayerName: "PublicPage"
    })

    return (
        <Route
          {...rest}
          render={props => {
            if(!isLoggedIn || (isLoggedIn && isGuest)) return ( <Component {...props}/> )
            if ((props.location.state as any)?.from) return <Redirect to={(props.location.state as any)?.from} />
            return <Redirect to={routes.project.management} />
          }}
        />
    );
};

export default PublicRoute;