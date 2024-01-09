import { Typography, styled } from "@mui/material";

interface Props {
  colorName?: string;
  fontSizeMobile?: string;
  $lineHeightMobile?: string;
  fontWeight?: number | string;
}

const Heading4 = styled(Typography)<Props>`
  font-family: "Inter";
  font-style: normal;
  font-weight: ${(props) => props.fontWeight || 600};
  font-size: 18px;
  line-height: 24px;
  color: ${(props) => `var(${props.colorName || "--eerie-black-00"})`};
  @media only screen and (max-width: 767px) {
    font-size: ${(props) => props.fontSizeMobile || "14px"};
    line-height: ${(props) => props.$lineHeightMobile || "24px"};
  }
`;

export default Heading4;
