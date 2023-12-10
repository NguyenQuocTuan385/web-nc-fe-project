import { FormControlLabel } from '@mui/material';
import styled, { css } from 'styled-components';

interface Props {
  hastooltip?: string | number;
  $cleanPadding?: boolean;
  $checkBoxTop?: boolean;
}

const ControlCheckbox = styled(FormControlLabel) <Props>`
  .MuiTypography-root {
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0.015em;
    color: var(--eerie-black);
    text-decoration: ${(props) => !!props.hastooltip ? 'underline dashed 1px #ccc' : 'unset'};
    text-underline-position: ${(props) => !!props.hastooltip ? 'under' : 'unset'};
  }
  &.Mui-disabled {
    .MuiTypography-root {
      color: var(--gray-40);
    }
  }
  ${(props) => props.$cleanPadding && css`
    margin: 0px;
    .MuiTypography-root {
      margin-left: 8px;
    }
    .MuiCheckbox-root {
      padding: 0px;
    }
  `}
  ${(props) => props.$checkBoxTop && css`
    align-items: flex-start;
    .MuiCheckbox-root {
      margin: 1px 0px;
    }
  `}
`
export default ControlCheckbox