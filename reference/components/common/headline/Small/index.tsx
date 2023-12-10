import { Typography } from '@mui/material';
import styled from 'styled-components';

interface Props {
  $colorName?: string;
  $fontSizeMobile?: string | number;
  $lineHeightMobile?: string | number;
}

const HeadLineSmall = styled(Typography) <Props>`
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -0.03em;
	margin-bottom: 8px;
  color: ${props => `var(${props.$colorName || '--cimigo-blue'})`};
  @media only screen and (max-width: 767px) {
      font-size: ${props => props.$fontSizeMobile || "22px"};
      line-height: ${props => props.$lineHeightMobile || "32px"};
`
export default HeadLineSmall