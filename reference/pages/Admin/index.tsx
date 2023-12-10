import { Grid } from "@mui/material";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import { useState } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { routes } from "routers/routes"
import { adminRouter } from "./config"
import classes from './styles.module.scss';

const switchRoutes = (
  <Switch>
    {
      adminRouter.map((route, key) => {
        if (route.layout === "/admin") {
          return (
            <Route
              path={route.path}
              component={route.component}
              key={key}
            />
          )
        }
        return null
      })
    }
    <Redirect from="/admin" to={routes.admin.project.root} />
  </Switch>
)

const Admin = () => {
  const [isOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!isOpen)
  }

  return (
    <Grid className={classes.root}>
      <Sidebar
        isOpen={isOpen}
        routes={adminRouter}
        handleDrawerToggle={handleDrawerToggle}
      />
      <div className={classes.mainPanel}>
        <Navbar
          handleDrawerToggle={handleDrawerToggle}
        />
        <div className={classes.content}>
          <div className={classes.container}>{switchRoutes}</div>
        </div>
      </div>
    </Grid>
  )
}

export default Admin;