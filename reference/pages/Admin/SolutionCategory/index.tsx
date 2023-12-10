import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import List from "./List"

const SolutionCategory = () => {

  return (
    <>
     <Switch>
        <Route exact path={routes.admin.solutionCategory.root} component={List}/>
        <Route exact path={routes.admin.solutionCategory.create} component={Create}/>
        <Route exact path={routes.admin.solutionCategory.edit} component={Edit}/>
        
        <Redirect from={routes.admin.solutionCategory.root} to={routes.admin.solutionCategory.root} />
     </Switch>
    </>
  )
}

export default SolutionCategory