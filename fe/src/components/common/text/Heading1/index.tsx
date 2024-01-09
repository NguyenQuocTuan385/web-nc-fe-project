import { Typography, styled } from "@mui/material";

interface Props {
  colorName?: string;
  fontWeight?: number | string;
  fontSize?: string;
}

const Heading1 = styled(Typography)<Props>`
  font-family: "Inter";
  font-style: normal;
  font-weight: ${(props) => props.fontWeight || 600};
  font-size: ${(props) => props.fontSize || "32px"};
  line-height: 48px;
  color: ${(props) => `var(${props.colorName || "--eerie-black"})`};
  @media only screen and (max-width: 767px) {
    font-size: 18px;
    line-height: 24px;
  }
`;

export default Heading1;
