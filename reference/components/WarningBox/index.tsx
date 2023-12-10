import { Box, BoxProps } from "@mui/material"
import clsx from "clsx"
import { memo } from "react"
import classes from "./styles.module.scss"

interface Props extends BoxProps {

}

const WarningBox = memo(({ className, children, ...rest }: Props) => {

  return (
    <Box
      className={clsx(classes.root, className)}
      {...rest}
    >
      {children}
    </Box>
  )
})

export default WarningBox