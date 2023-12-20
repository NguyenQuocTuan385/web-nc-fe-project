import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface Props {
  $colorName?: string;
  $fontWeight?: number | string;
  $lineHeight?: number | string;
}

const ParagraphBody = styled(Typography)<Props>`
  font-family: "Inter";
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight || 400};
  color: ${(props) => `var(${props.$colorName || "--eerie-black-00"})`};
  font-size: 16px;
  line-height: ${(props) => props.$lineHeight || "24px"};
`;

export default ParagraphBody;
