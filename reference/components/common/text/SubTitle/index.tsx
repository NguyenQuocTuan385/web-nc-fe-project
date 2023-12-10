import { Typography } from '@mui/material';
import styled from 'styled-components';

interface Props {
  $colorName?: string
}

const SubTitle = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.015em;
    color: ${props => `var(${props.$colorName || '--eerie-black'})`};
`
export default SubTitle;