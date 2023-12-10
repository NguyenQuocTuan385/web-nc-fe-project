
import styled from 'styled-components';


interface Props {
  $color?: string;
}

const Separator = styled.div<Props>`
padding: 24px 0px;
display: flex;
align-items: center;
font-size: 16px;

&:before,:after{
  content: ' ';
  flex: 1;
  border-bottom: 1px solid ${props=>props.$color || 'rgba(28, 28, 28, 0.2)'};
}

&:before {
  
  margin-right: 11px;
}

&:after {
  margin-left: 11px;
}
`;

export default Separator