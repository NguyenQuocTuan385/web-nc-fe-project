import { Switch as SwitchMUI } from "@mui/material";
import styled from "styled-components";

const Switch = styled(SwitchMUI)`
  width: 46px;
  height: 24px;
  overflow: unset;
  padding: 5px 12px 5px 0px;
  .MuiSwitch-switchBase {
    padding: 2px 0px;
    &:hover {
      background-color: transparent;
    }
    .MuiSwitch-thumb {
      color: #F8F8FB;
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
    }
    .MuiSwitch-track {
      background-color: var(--eerie-black-40);
    }
    &.Mui-checked {
      .MuiSwitch-thumb {
        color: var(--cimigo-green-dark-1);
      }
      + .MuiSwitch-track {
        background-color: var(--cimigo-green);
      }
    }
  }

`;

export default Switch;