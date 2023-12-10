import { TableContainer } from "@mui/material";
import styled from "styled-components";


export const SetupTable = styled(TableContainer)`
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  .MuiTableHead-root {
    .MuiTableRow-root {
      .MuiTableCell-root {
        padding: 18px 16px;
        background: var(--gray-10);
        .MuiTypography-root {
          color: var(--gray-80);
        }
        &:first-child {
          padding-left: 38px;
        }
      }
    }
  }
  .MuiTableBody-root {
    .MuiTableRow-root {
      .MuiTableCell-root {
        padding: 12px 16px;
        background: #ffffff;
        > .MuiTypography-root { 
          color: #333333;
        }
        &:first-child {
          padding-left: 38px;
        }
      }
      &.edit-row {
        .MuiTableCell-root {
          padding-top: 8px;
          padding-bottom: 8px;
        }
      }
      &:hover {
        &:not(.edit-row, .action-row) {
          .MuiTableCell-root {
            background: var(--gray-5);
          }
        }
      }
    }
  }

`;