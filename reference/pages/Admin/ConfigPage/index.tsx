import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Edit from "./Edit"
import List from "./List"

const ConfigPage = () => {

  return (
    <>
     <Switch>
        <Route exact path={routes.admin.config.root} component={List}/>
        <Route exact path={routes.admin.config.edit} component={Edit}/>
        
        <Redirect from={routes.admin.config.root} to={routes.admin.config.root} />
     </Switch>
    </>
  )
}

export default ConfigPage