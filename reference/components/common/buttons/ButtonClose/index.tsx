import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';

interface Props {
    $backgroundColor?: string;
    $colorName?: string;
}

const ButtonCLose = styled(CloseIcon)<Props>`
    width: 32px;
    height: 32px;
    padding: 4px;
    background-color: ${props => `var(${props.$backgroundColor || '--ghost-white'})`};
    border-radius: 100%;
    color: ${props => `var(${props.$colorName || '--cimigo-blue-dark-1'})`};
    cursor: pointer;
`

export default ButtonCLose;