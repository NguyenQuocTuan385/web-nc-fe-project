import { Typography } from  '@mui/material';
import styled from 'styled-components';

interface Props {
  $colorName?: string;
  $fontWeight?: number | string;
  $textDecoration?: string;
}

const ParagraphBodyUnderline = styled(Typography)<Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: ${props => props.$fontWeight || 400};
    font-size: 16px;
    line-height: 24px;
    cursor: pointer;
    text-decoration: ${props => props.$textDecoration || "underline!important"};
    text-underline-position: under;
    color: ${props => `var(${props.$colorName || '--cimigo-blue'})`};
    @media only screen and (max-width: 767px) {
      font-size: 14px;
    }
`

export default ParagraphBodyUnderline;