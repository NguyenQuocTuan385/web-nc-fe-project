import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
    $colorName?: string;
}

const ParagraphSmallUnderline2 = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: ${props => `var(${props.$colorName || '--cimigo-blue'})`};
    text-decoration: underline!important;
    text-underline-position: under;
    cursor: pointer;
`

export default ParagraphSmallUnderline2;