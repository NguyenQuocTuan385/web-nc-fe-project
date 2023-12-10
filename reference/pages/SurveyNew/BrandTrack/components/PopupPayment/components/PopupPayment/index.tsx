import { Dialog } from "@mui/material";
import styled, { css } from "styled-components";

interface PopupPaymentProps {
  $maxWithUnset?: boolean;
}
const PopupPayment = styled(Dialog)<PopupPaymentProps>`
  ${(props) =>
    props.$maxWithUnset &&
    css`
      .MuiDialog-paper {
        max-width: unset !important;
      }
    `}
  @media only screen and (max-width: 767px) {
    width: 100%;
    margin: 0 !important;
    .MuiDialog-paper {
      margin: 0 !important;
    }
  }
`;
export default PopupPayment;
