import { Typography, styled } from "@mui/material";

interface Props {
  colorName?: string;
  fontWeight?: number | string;
}

const Heading5 = styled(Typography)<Props>`
  font-family: "Montserrat";
  font-style: normal;
  font-weight: ${(props) => props.fontWeight || 600};
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => `var(${props.colorName || "--eerie-black-00"})`};
  @media only screen and (max-width: 767px) {
    font-size: 14px;
  }
`;

export default Heading5;
