import { Typography, styled } from "@mui/material";

interface Props {
  colorName?: string;
  fontWeight?: number | string;
}

const ParagraphBody = styled(Typography)<Props>`
  font-family: "Inter";
  font-style: normal;
  font-weight: ${(props) => props.fontWeight || 400};
  color: ${(props) => `var(${props.colorName || "--eerie-black-00"})`};
  font-size: 16px;
  line-height: "24px";
`;

export default ParagraphBody;
