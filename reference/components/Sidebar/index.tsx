import classes from './styles.module.scss';
import {
  Drawer,
  Icon,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { memo } from 'react';
import { Link, matchPath, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { NavItem, routes } from 'routers/routes';
import cimigoLogo from 'assets/img/cimigo_logo.svg';

interface SidebarProps {
  isOpen: boolean;
  routes: NavItem[];
  handleDrawerToggle: () => void;
}

const Sidebar = memo((props: SidebarProps) => {
  const { isOpen, routes: routesList, handleDrawerToggle } = props;
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const activeRoute = (routeName: string) => {
    const match = matchPath(window.location.pathname, {
      path: routeName,
      exact: false
    })
    return !!match
  };

  const links = (
    <List className={classes.list}>
      {routesList.map((route, key) => {
        const active: boolean = activeRoute(route.path);
        return (
          <NavLink
            to={route.path}
            className={classes.item}
            activeClassName="active"
            key={key}
          >
            <ListItem
              button
              className={clsx(classes.itemLink, {
                [classes.itemLinkActive]: active
              })}
            >
              {typeof route.icon === 'string' ? (
                <Icon
                  className={clsx(classes.itemIcon, {
                    [classes.itemIconActive]: active
                  })}
                >
                  {route.icon}
                </Icon>
              ) : (
                <route.icon
                  className={clsx(classes.itemIcon, {
                    [classes.itemIconActive]: active
                  })}
                />
              )}
              <ListItemText
                primary={route.name}
                className={clsx(classes.itemText, {
                  [classes.itemTextActive]: active
                })}
                disableTypography={true}
              />
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );

  return (
    <div className={classes.root}>
      <Drawer
        variant={!isMobile ? 'permanent' : 'temporary'}
        anchor="left"
        open={isMobile ? isOpen : true}
        classes={{
          paper: classes.drawerPaper
        }}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: isMobile, // Better open performance on mobile.
        }}
      >
        <div className={classes.logo}>
          <div className={classes.logoImage}>
            <Link to={routes.project.management}>
              <img src={cimigoLogo} alt="logo" className={classes.img} />
            </Link>
          </div>
        </div>
        <div className={classes.sidebarWrapper}>{links}</div>
      </Drawer>
    </div>
  );
});

export default Sidebar;
