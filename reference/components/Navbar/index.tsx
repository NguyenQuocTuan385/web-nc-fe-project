import { Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, Hidden, IconButton, MenuItem, Toolbar, Menu } from '@mui/material';
import { memo, useState } from 'react';
import classes from './styles.module.scss';
import images from "config/images";
import UseAuth from 'hooks/useAuth';
import clsx from 'clsx';

interface NavbarProps {
  handleDrawerToggle: () => void;
}

const Navbar = memo((props: NavbarProps) => {
  const { handleDrawerToggle } = props;

  const { logout, user } = UseAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.container}>
        <Hidden mdUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <div className={classes.flex}></div>
        <div className={classes.boxRight}>
          <div className={classes.item}>
            <IconButton onClick={handleClick} className={classes.itemBtn}>
              <img src={user?.avatar || images.icProfile} alt="avatar" className={clsx(classes.avatar, { [classes.avatarEmpty]: !user?.avatar })} referrerPolicy="no-referrer"/>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              classes={{ paper: classes.menuProfile }}
            >
              <MenuItem className={classes.itemAciton}>
                <img src={images.icProfile} alt="" />
                <p>My account</p>
              </MenuItem>
              <MenuItem className={classes.itemAciton} onClick={logout}>
                <img src={images.icLogout} alt="" />
                <p>Log out</p>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
});

export default Navbar;
