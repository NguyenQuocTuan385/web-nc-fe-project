import { Typography } from "@mui/material";
import styled from "styled-components";

const ErrorMessage = styled(Typography)`
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: var(--red-error) !important;
  white-space: initial;
`;

export default ErrorMessage;
