import { Typography } from '@mui/material';
import styled from 'styled-components';

interface TextTitleProps {
  invalid?: string
}

const TextTitle = styled(Typography)<TextTitleProps>`
  color: ${(props) => props.invalid ? '#af1c10' : 'rgba(28, 28, 28, 0.9)'};
  font-size: 14px;
  font-weight: 500;
  line-height: 140%;
  letter-spacing: 0.015em;
  padding-bottom: 5px;
  margin: 0;
`
export default TextTitle