import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface Props {
  $colorName?: string;
  $fontWeight?: number | string;
}

const ParagraphSmall = styled(Typography)<Props>`
  font-family: "Inter";
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight || 400};
  font-size: 14px;
  line-height: 24px;
`;

export default ParagraphSmall;
