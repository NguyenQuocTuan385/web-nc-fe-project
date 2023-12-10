import { TabsProps } from '@mui/material';
import styled from 'styled-components';
import { Tabs } from '@mui/material';

interface Props extends TabsProps { }

const RegisterTabs = styled(Tabs) <Props>`
  position: absolute;
  top: 0;
  right: 24px;
  min-height: 48px;

  @media only screen and (max-width: 767px) {
    min-height: 24px;
  }

  & div {
    display: flex;
    gap: 8px;
    align-items: center;

    span {
      display: none;
    }
  }

  & button {
	background: #F4F4F4;
	min-height: 4px;
	min-width: 24px;
	border-radius: 4px;
	padding: 0;
	transition: all 0.2s ease;
  
	&[aria-selected="true"],
	&:not([aria-selected="true"]~button) {
	  background-color: #1F61A9;
	}
  }
`;

export default RegisterTabs