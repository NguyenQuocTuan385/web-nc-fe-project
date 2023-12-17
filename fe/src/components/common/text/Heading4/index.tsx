import { Typography } from '@mui/material';
import styled from 'styled-components';

interface Props {
  $colorName?: string;
  $fontSizeMobile?: string;
  $lineHeightMobile?: string;
  $fontWeight?: number | string;
}

const Heading4 = styled(Typography) <Props>`
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: ${props => props.$fontWeight || 600};
    font-size: 18px;
    line-height: 24px;
    color: ${props => `var(${props.$colorName || '--gray-80'})`};
    @media only screen and (max-width: 767px) {
      font-size: ${props => props.$fontSizeMobile || "14px"};
      line-height: ${props => props.$lineHeightMobile || "24px"};
    }
`

export default Heading4;