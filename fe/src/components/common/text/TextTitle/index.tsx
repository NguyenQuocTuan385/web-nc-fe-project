import { Typography, styled } from "@mui/material";

interface TextTitleProps {}

const TextTitle = styled(Typography)<TextTitleProps>`
  color: var(--eerie-black-00);
  font-size: 16px;
  font-weight: 600;
  font-family: "Inter";
  letter-spacing: 0.015em;
  line-height: normal;
  margin: 0;
`;
export default TextTitle;
