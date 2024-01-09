import { Typography, styled } from "@mui/material";

interface Props {
  colorName?: string;
  fontSizeMobile?: string | number;
  $lineHeightMobile?: string | number;
}

const Heading2 = styled(Typography)<Props>`
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -0.03em;
  color: ${(props) => `var(${props.colorName || "--eerie-black"})`};
  @media only screen and (max-width: 767px) {
    font-size: ${(props) => props.fontSizeMobile || "22px"};
    line-height: ${(props) => props.$lineHeightMobile || "32px"};
  }
`;

export default Heading2;
