import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    $colorName?: string;
    $fontWeight?: number | string;
}

const ParagraphSmall = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: ${props => props.$fontWeight || 400};
    font-size: 14px;
    line-height: 24px;
    color: ${props => `var(${props.$colorName || '--eerie-black-65'})`};
`

export default ParagraphSmall;