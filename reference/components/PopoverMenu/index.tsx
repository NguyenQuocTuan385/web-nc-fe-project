import React, { memo } from 'react';
import { Popover, PopoverProps, Box } from '@mui/material';
import useStyles from "./styles";
import clsx from 'clsx';

interface PopoverMenuProps extends PopoverProps {
  children: React.ReactNode,
  width?: number,
  paperClass?: string,
  arrowClass?: string,
  
}

const PopoverMenu = memo(({ children, width, paperClass, arrowClass, ...other }: PopoverMenuProps) => {
  const classes = useStyles();

  return (
    <Popover
      // getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      classes={{
        root: classes.root,
        paper: clsx(classes.paper, paperClass)
      }}
      {...other}
    >
      <span className={clsx(classes.arrow, arrowClass)} />
      <Box sx={{ width: width, maxWidth: '100%' }}>{children}</Box>
    </Popover>
  );
})

export default PopoverMenu;
