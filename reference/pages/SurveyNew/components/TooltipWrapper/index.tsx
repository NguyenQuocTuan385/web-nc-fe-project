import { Box, SvgIconProps, Tooltip } from "@mui/material";
import clsx from "clsx";
import Heading6 from "components/common/text/Heading6";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import { memo } from "react"
import classes from './styles.module.scss';

interface TooltipWrapperProps extends SvgIconProps {
  className?: string;
  tooltipPopper?: string;
  title: string;
  caption: string;
}

export const TooltipWrapper = memo(({ className, tooltipPopper, title, caption, children }: TooltipWrapperProps) => {
  return (
    <Tooltip
      placement="right"
      arrow
      className = {className}
      classes={{ popper: clsx(classes.tooltipPopper, tooltipPopper) }}
      title={(
        <>
          <Heading6 mb={0.5} $colorName={"var(--eerie-black)"}>{title}</Heading6>
          <ParagraphExtraSmall $colorName={"var(--eerie-black)"} variant="caption">
            {caption}
          </ParagraphExtraSmall>
        </>
      )}
    >
      <Box>
        {children}
      </Box>
    </Tooltip>

  )
})

export default TooltipWrapper