import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import Create from "./Create"
import Edit from "./Edit"
import List from "./List"

const AttributeCategory = () => {

  return (
    <>
      <Switch>
        <Route exact path={routes.admin.attribute.category.root} component={List} />
        <Route exact path={routes.admin.attribute.category.create} component={Create} />
        <Route exact path={routes.admin.attribute.category.edit} component={Edit} />

        <Redirect from={routes.admin.attribute.category.root} to={routes.admin.attribute.category.root} />
      </Switch>
    </>
  )
}

export default AttributeCategory