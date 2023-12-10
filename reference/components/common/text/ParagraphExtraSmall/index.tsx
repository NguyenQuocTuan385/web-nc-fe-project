import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    $colorName?: string;
    $fontWeight?: number;
}

const ParagraphExtraSmall = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: ${props => props.$fontWeight || 400};
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.015em;
    color: ${props => `var(${props.$colorName || '--gray-90'})`};
`

export default ParagraphExtraSmall;