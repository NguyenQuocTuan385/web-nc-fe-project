import styled from "styled-components";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

interface PropsType {
  width?: number | string;
}
const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ArrowRightIcon sx={{ color: "var(--cimigo-blue)" }} />} {...props} />
))(({ width }: PropsType) => ({
  width: width ?? "fit-content",
  justifyContent: "flex-start",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
}));
export default AccordionSummary;
