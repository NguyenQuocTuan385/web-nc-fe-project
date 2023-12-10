import { Tooltip, TooltipProps } from "@mui/material"
import clsx from "clsx"
import { memo } from "react"
import classes from "./styles.module.scss"

interface Props extends TooltipProps {
  popperClass?: string
}

const TooltipCustom = memo(({popperClass, ...rest}: Props) => {

  return (
    <Tooltip 
      PopperProps={{
        className: clsx(classes.popper, popperClass)
      }}
      {...rest}
    />
  )
})

export default TooltipCustom