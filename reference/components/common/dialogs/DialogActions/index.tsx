import styled from "styled-components";
import {
  DialogActions as DialogActionsMUI,
} from "@mui/material";

export const DialogActions = styled(DialogActionsMUI)`
  padding: 24px 24px 32px;
  @media only screen and (max-width: 767px) {
    padding-bottom: 24px;
  }
`

export const DialogActionsConfirm = styled(DialogActionsMUI)`
  padding: 16px 24px 24px;
  > button {
    &:not(:first-child) {
      margin-left: 16px;
    }
  }
  @media only screen and (max-width: 767px) {
    flex-direction: column-reverse;
    > button {
      width: 100%;
      &:not(:first-child) {
        margin-left: 0;
        margin-bottom: 16px;
      }
    }
  }
`