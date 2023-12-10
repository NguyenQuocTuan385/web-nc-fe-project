import { Box, Chip, Grid, IconButton, StepConnector, StepContent, StepLabel, Stepper, Tabs, Typography } from '@mui/material';
import Button from 'components/common/buttons/Button';
import { PROJECT_DETAIL_SECTION } from 'models/project';
import styled, { css } from 'styled-components';

export const PageRoot = styled(Grid)`
  flex: 1;
  display: flex;
  min-width: 0;
  min-height: 0;
`

export const LeftContent = styled(Grid)`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
`
interface RightContentProps {
  $toggleOutlineMobile?: boolean;
  $quotasOutline?: boolean;
}
export const RightContent = styled(Grid)<RightContentProps>`
  width: 342px;
  @media only screen and (max-width: 1024px) {
    ${props => props.$toggleOutlineMobile && css`
      display: block !important;
      position: absolute !important;
      left: 0px;
      bottom: 106px;
      width: 100% !important;
      z-index: 11;
  `}
  ${props => !props.$toggleOutlineMobile && css`
      display: none;
  `}
  ${props => props.$quotasOutline && css`
      bottom: 145px;
  `}
  }
`

export const PageTitle = styled(Grid)`
  height: 52px;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--gray-10);
  @media only screen and (max-width: 767px) {
    display: none;
    height: auto;
    flex-direction: column;
    align-items: stretch;
    padding: 24px 16px 12px;
    border-bottom: none;
    flex-wrap: wrap;
  }
`;

export const PageTitleLeft = styled(Grid)`
  display: flex;
  align-items: center;
  margin-right: 8px;
  @media only screen and (max-width: 767px) {
    margin-right: 0;
    justify-content: space-between;
  }
`;

export const PageTitleRight = styled(Grid)`
  display: flex;
  align-items: center;
  @media only screen and (max-width: 767px) {
    margin-top: 8px;
    margin-left: auto;
    > svg {
      display: none;
    }
  }
`;

export const PageTitleText = styled(Typography)`
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--eerie-black);
  > span {
    text-transform: lowercase;
  }
`;


export const Content = styled(Grid)`
  flex: 1;
  overflow: auto;
  min-width: 0;
  min-height: 0;
  padding: 32px 48px 96px;
  @media only screen and (max-width: 767px) {
    padding: 12px 16px 85px;
  }
`;

Content.defaultProps = {
  id: PROJECT_DETAIL_SECTION.content
}

export const MobileAction = styled(Grid)`
  display: none;
  padding: 24px 34px;
  box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.25);
  @media only screen and (max-width: 1024px) {
    display: block;
    position: relative;
  }
`;

export const RightPanel = styled(Box)`
  background: var(--gray-1);
  border-left: 1px solid var(--gray-10);
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const TabRightPanel = styled(Tabs)`
  height: 52px;
  border-bottom: 1px solid var(--gray-10);
  .MuiTabs-flexContainer {
    height: 100%;
    > * {
      flex: 1;
      min-height: unset;
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: var(--gray-40);
      text-transform: unset;
      &.Mui-selected {
        color: var(--gray-90);
      }
    }
  }
  .MuiTabs-indicator {
    display: none;
  }
`;

export const RightPanelContent = styled(Box)`
  padding: 0;
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

export const RightPanelBody = styled(Box)`
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  padding: 16px 24px 12px;
`;

export const RightPanelAction = styled(Box)`
  padding: 12px 24px 24px;
  @media only screen and (max-width: 1024px) {
    display: none;
  }
`;

export const RPStepper = styled(Stepper)`
  
`;

export const RPStepConnector = styled(StepConnector)`
  margin-left: 16px;
  .MuiStepConnector-line {
    border-color: var(--gray-20);
    min-height: 16px;
  }
`;


export const RPStepLabel = styled(StepLabel)`
  min-height: 48px;
  cursor: pointer !important;
  > .MuiStepLabel-iconContainer {
    padding: 0;
    margin-right: 16px;
  }
  > .MuiStepLabel-labelContainer{
    overflow: hidden;

    > .MuiStepLabel-label {
      .title{
        color: var(--eerie-black);
        font-weight: 400;
      }
      &.Mui-active {
        .title {
          font-weight: 500;
          letter-spacing: 0.1px;
        }
      }
    }
  }
`;

export const RPStepContent = styled(StepContent)`
  margin-left: 16px;
  border-left: 1px solid var(--gray-20);
  padding-left: 32px;
`;

interface RPStepIconBoxProps {
  $active?: boolean;
}

export const RPStepIconBox = styled(Box) <RPStepIconBoxProps>`
  background: ${(props) => props.$active ? 'var(--cimigo-theme-blue)' : 'var(--white)'};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border:  ${(props) => props.$active ? '1px solid var(--cimigo-theme-blue)' : '1px solid var(--gray-20)'} ;
  width: 32px;
  height: 32px;
  font-size: 14px;
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  color: ${(props) => props.$active ? 'var(--white)' : 'var(--gray-60)'
  }
`;

export const MaxChip = styled(Chip)`
  background: #F4F4F4;
  border-radius: 30px;
  height: 24px;
`;

export const Tip = styled(Grid)`
  display: flex;
  align-items: flex-start;
  > svg {
    margin-top: 3px;
    margin-right: 8px;
    color: var(--eerie-black-40);
    font-size: 24px;
  }
  .MuiTypography-root {
    margin: 0;
    padding-left: 12px;
    border-left: 1px solid var(--eerie-black-40);
    span {
      font-weight: 700;
    }
    color: var(--eerie-black);
    @media only screen and (max-width: 767px) {
      font-size: 10px;
      line-height: 12px;
    }
  }
`;

export const PriceChip = styled(Chip)`
  background: var(--cimigo-green-dark-1);
  border-radius: 30px;
  height: 24px;
  .MuiChip-label {
    padding: 0px 16px;
    > * {
      color: var(--ghost-white)
    }
  }
  &.disabled {
    background: var(--gray-10);
    .MuiChip-label {
      > * {
        color: var(--gray-40)
      }
    }
  }
`;

export const MobileOutline = styled(Box)`
  display: none;
  @media only screen and (max-width: 1024px){
    display: block;
    position: absolute;
    top: -31px;
    right: 8px;
    display: flex;
    align-items: center;
    background-color: var(--cimigo-blue-light-4);
    padding: 4px 16px;
    border-radius: 2px 0px 0px 0px;
    z-index: 10;
    cursor: pointer;
    svg {
        color: var(--cimigo-blue);
        margin-left: 6px;
    }
  }
`;

export const ButtonViewQuestionnaire = styled(Button)`
  background-color: var(--gray-5);
  padding: 8px 16px 8px 19px !important;
  .MuiTypography-root{
    letter-spacing: 0.25px
  }
`;
interface ModalProps {
  $toggleOutlineMobile?: boolean;
  $quotasOutline?: boolean;
}

export const ButtonHowToSetup = styled(IconButton)`
  color: var(--gray-60);
  cursor: pointer;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  border-radius: 50%;
  margin-left: 16px;
  
  &:hover{
    border: 1px solid var(--gray-5);
    background: var(--gray-5);
  }
  .MuiSvgIcon-root{
    color: var(--gray-80);
    width: 14px;
    height: 16px;
    font-size: 16px;
  }
`
export const ModalMobile = styled.div<ModalProps>`
  display: none;
  @media only screen and (max-width: 1024px) {
    ${props => props.$toggleOutlineMobile && css`
    display: block;
    position: fixed;
    background: rgba(28, 28, 28, 0.2);
    top: 0px;
    right: 0px;
    left:0px;
    bottom: 106px;
  `}
  ${props => !props.$toggleOutlineMobile && css`
      display: none;
  `}
  ${props => props.$quotasOutline && css`
      bottom: 145px;
  `}
  }
`

export const RPPriceWrapper = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`
interface PriceChipStepProps{
  $active?:boolean
}
export const PriceChipStep = styled(Chip) <PriceChipStepProps>`
  border-radius: 4px;
  height: 24px;
  background: var(--gray-5);
  margin: 4px 0px;

  > .MuiChip-label {
    padding: 4px 8px;
    >.MuiTypography-root {
      color: var(--gray-60);
      letter-spacing: 0.4px;
    }
  }
  ${ (props)=> props.$active && css`
    background: var(--gray-10);
    margin: 0 0 4px 0;
    .MuiTypography-root {
      color: var(--gray-80);
    }` 
  }
`

interface WarningWrapperProps{
  $active?: boolean 
}
export const WarningWrapper = styled(Box)<WarningWrapperProps>`
  ${props=> props.$active && css`
    color: var(--red-error)
  `}
`