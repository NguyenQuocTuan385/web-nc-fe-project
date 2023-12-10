import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
    $colorName?: string;
}

const ParagraphSmallUnderline = styled(Link)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    align-items: center;
    text-decoration: underline!important;
    text-underline-position: under;
    color: ${props => `var(${props.$colorName || '--cimigo-blue'})`};
`

export default ParagraphSmallUnderline;