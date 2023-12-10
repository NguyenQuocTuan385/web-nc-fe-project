import classes from './styles.module.scss';
import { PersonOutline, Loop, Logout, Payment, KeyboardDoubleArrowLeft } from '@mui/icons-material';
import { Button, Grid, Icon, ListItem, MenuList, Popper, ClickAwayListener, Paper, IconButton, List, ListItemText, Divider } from "@mui/material"
import UseAuth from "hooks/useAuth";
import { matchPath, Redirect, Route, Switch, NavLink } from "react-router-dom";
import UserProfile from './UserProfile';
import { routes } from "routers/routes";
import clsx from 'clsx';
import { useState, useRef, memo, useMemo } from 'react';
import ChangePassword from './ChangePassword';
import PaymentInfo from './PaymentInfo';
import { useTranslation } from 'react-i18next';
import BasicLayout from 'layout/BasicLayout';
import { Helmet } from 'react-helmet';
interface Props {

}

// eslint-disable-next-line no-empty-pattern
const AccountPage = memo(({}: Props) => {
  const { t, i18n } = useTranslation();
  const { logout } = UseAuth();
  const [isOpen, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const activeRoute = (routeName: string, exact: boolean = false) => {
    const match = matchPath(window.location.pathname, {
      path: routeName,
      exact: exact
    })
    return !!match
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  const dataMenuList = useMemo(() => {
    return [
      {
        icon: PersonOutline,
        path: routes.account.userProfile,
        name: t("auth_user_profile"),
      },
      {
        icon: Loop,
        path: routes.account.changePassword,
        name: t("auth_change_password"),
      },
      {
        icon: Payment,
        path: routes.account.paymentInfo,
        name: t("auth_payment_info"),
      }
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const links = (
    <List>
      {dataMenuList.map((route, key) => {
        const active: boolean = activeRoute(route.path);
        return (
          <NavLink to={route.path} key={key} activeClassName="active" onClick={handleClose}>
            <ListItem button className={clsx(classes.border, { [classes.borderActive]: active })} >
              {typeof route.icon === 'string' ? (<Icon>{route.icon}</Icon>) : (<route.icon />)}
              <ListItemText 
                className={classes.routeName}
                primary={route.name}
                disableTypography={true}
              />
            </ListItem>
          </NavLink>
        );
      })}
      <Divider/>
      <Button className={classes.btnLogout} onClick={logout}>
        <Logout/>
        <p translation-key="auth_log_out">{t("auth_log_out")}</p>
      </Button>
    </List>
  );
  return (
    <BasicLayout 
      className={classes.root}
      HeaderProps={{ project: true }}
    >
      <Helmet>
        <title translation-key="common_name_page, auth_page_my_account">{t("common_name_page", {page: t("auth_page_my_account")})}</title>
      </Helmet>
      <Grid className={classes.main}>
        <div className={classes.menuList}>
          {links}
        </div>
        <div className={classes.content}>
          <Switch>
            <Route exact path={routes.account.userProfile} render={(routeProps) => <UserProfile {...routeProps} />} />
            <Route exact path={routes.account.changePassword} render={(routeProps) => <ChangePassword {...routeProps} />} />
            <Route exact path={routes.account.paymentInfo} render={(routeProps) => <PaymentInfo {...routeProps} />} />
            <Redirect from={routes.account.root} to={routes.account.userProfile} />
          </Switch>
          <div className={classes.toggleMenu}>
            <IconButton
              ref={anchorRef}
              onClick={handleToggle}
              className={classes.btnArrow}
            >
              <KeyboardDoubleArrowLeft/>
            </IconButton>
            <Popper className={classes.positionPopper}
              open={isOpen}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={isOpen}>{links}</MenuList>
                </ClickAwayListener>
              </Paper>
            </Popper>
          </div>
        </div>
      </Grid>
    </BasicLayout>
  );
})
export default AccountPage;

