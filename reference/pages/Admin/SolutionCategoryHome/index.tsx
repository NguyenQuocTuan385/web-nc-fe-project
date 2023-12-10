import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import List from "./List"

const SolutionCategoryHome = () => {

  return (
    <>
     <Switch>
        <Route exact path={routes.admin.solutionCategoryHome.root} component={List}/>
        <Route exact path={routes.admin.solutionCategoryHome.create} component={Create}/>
        <Route exact path={routes.admin.solutionCategoryHome.edit} component={Edit}/>
        
        <Redirect from={routes.admin.solutionCategoryHome.root} to={routes.admin.solutionCategoryHome.root} />
     </Switch>
    </>
  )
}

export default SolutionCategoryHome