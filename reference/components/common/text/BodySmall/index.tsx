import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    $colorName?: string;
    $fontWeight?: number | string;
}

const BodySmall = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: ${props => props.$fontWeight || 500};
    font-size: 14px;
    line-height: 140%;
    color: ${props => `var(${props.$colorName || '--eerie-black'})`};
`

export default BodySmall;