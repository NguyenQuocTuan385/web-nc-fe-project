import { Typography, styled } from "@mui/material";

interface Props {
  colorName?: string;
  fontWeight?: string | number;
}

const ParagraphExtraSmall = styled(Typography)<Props>`
  font-family: "Inter";
  font-style: normal;
  font-weight: ${(props) => props.fontWeight || 400};
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.015em;
  color: ${(props) => `var(${props.colorName || "--eerie-black-00"})`};
`;

export default ParagraphExtraSmall;
