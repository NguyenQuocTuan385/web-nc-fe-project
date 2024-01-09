import { Typography, styled } from "@mui/material";

interface Props {
  colorName?: string;
  fontWeight?: number | string;
}

const Heading6 = styled(Typography)<Props>`
  font-family: "Montserrat";
  font-style: normal;
  font-weight: ${(props) => props.fontWeight || 600};
  font-size: 14px;
  line-height: 24px;
  color: ${(props) => `var(${props.colorName || "--eerie-black-00"})`};
`;

export default Heading6;
