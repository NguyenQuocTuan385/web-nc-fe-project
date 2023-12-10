import { Box } from '@mui/material';
import styled from 'styled-components';

interface Props {
  $height?: string | number;
  $width?: string | number;
  $colorName?: string;
}

export const Dot = styled(Box) <Props>`
  height: ${(props) => props.$height || "4px"};
  width: ${(props) => props.$width || "4px"};
  border-radius: 50%;
  background-color: ${props => `var(${props.$colorName || '--gray-40'})`};
`;