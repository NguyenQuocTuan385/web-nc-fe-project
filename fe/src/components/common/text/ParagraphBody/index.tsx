import { Typography } from "@mui/material";
import styled from "styled-components";

interface Props {
  $colorName?: string;
  $fontWeight?: number | string;
}

const ParagraphBody = styled(Typography)<Props>`
  font-family: "Inter";
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight || 400};
  font-size: 16px;
  line-height: 24px;
  @media only screen and (max-width: 767px) {
    font-size: 14px;
  }
`;

export default ParagraphBody;
