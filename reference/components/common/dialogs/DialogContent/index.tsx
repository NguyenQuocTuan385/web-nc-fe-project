import styled from "styled-components";
import {
  DialogContent as DialogContentMUI,
} from "@mui/material";

interface DialogContentConfirmprops {
 $padding?: string
}
export const DialogContent = styled(DialogContentMUI)`
  padding: 24px !important;
  border: none !important;
  @media only screen and (max-width: 767px) {
    overflow: auto;
  }
`

export const DialogContentConfirm = styled(DialogContentMUI)<DialogContentConfirmprops>`
  padding: ${(props) => props.$padding || "0px 24px 16px !important"};
  border: none !important;
  @media only screen and (max-width: 767px) {
    overflow: auto;
  }
`;