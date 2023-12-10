import { Tooltip, TooltipProps } from "@mui/material";
import { memo } from "react";
import classes from './styles.module.scss';

interface BasicTooltipProps extends TooltipProps{
  
}

const BasicTooltip = memo(({children, ...rest}: BasicTooltipProps) => {

  return (
    <Tooltip
      {...rest}
      classes={{ popper: classes.tooltipPopper }}
    >
      {children}
    </Tooltip>
  )
})

export default BasicTooltip