import { Menu as MUIMenu } from "@mui/material"
import styled from 'styled-components';


interface MenuProps {
  $minWidth?: string | number;
}

export const Menu = styled(MUIMenu) <MenuProps>`
  .MuiPaper-root {
    background: #FFFFFF;
    box-shadow: 0px 0px 8px rgba(28, 28, 28, 0.12);
    border-radius: 4px;
    min-width: ${(props) => props.$minWidth || "256px"};
    .MuiList-root {
      padding: 8px 0px;
      .MuiMenuItem-root {
        padding: 8px 16px;
        .MuiListItemIcon-root {
          min-width: 32px;
          color: var(--gray-80);
        }
        .MuiTypography-root {
          color: var(--gray-80);
        }
        &:hover {
          background: var(--cimigo-blue-light-4);
          .MuiListItemIcon-root {
            color: var(--cimigo-blue-light-1);
          }
          .MuiTypography-root {
            color: var(--cimigo-blue-light-1);
          }
        }
      }
    }
  }
`;