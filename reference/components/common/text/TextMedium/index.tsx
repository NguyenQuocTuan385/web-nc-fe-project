import { Typography } from '@mui/material';
import styled from 'styled-components';

interface Props {
  $colorName?: string
}

const TextMedium = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.1px;
    color: ${props => `var(${props.$colorName || '--eerie-black'})`};
`
export default TextMedium;