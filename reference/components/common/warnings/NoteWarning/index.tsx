import { memo } from "react";
import { Box, BoxProps } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface Props extends BoxProps {
  Icon?: any;
}

const NoteWarning = memo((props: Props) => {
  const { Icon = WarningAmberIcon, className, children, ...rest } = props;
  return (
    <Box mt={2} className={className} {...rest}>
      <Box sx={{ display: "flex" }}>
        <Icon sx={{ color: "var(--warning-dark)", verticalAlign: "middle", display: "inline-flex", mr: 1 }} />
        {children}
      </Box>
    </Box>
  );
});
export default NoteWarning;
