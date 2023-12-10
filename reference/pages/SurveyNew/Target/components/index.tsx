import { Box, Button, Grid } from "@mui/material";
import styled, { css } from "styled-components";


export const QuestionBoxContainer = styled(Box)`
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--gray-10);

`;

export const QuestionBoxHeader = styled(Box)`
  background: var(--gray-10);
  padding: 8px 16px;

`;

export const QuestionBoxSuggest = styled(Box)`
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--gray-20);
`;

export const QuestionBoxSuggestList = styled(Box)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-left: -16px;
  margin-top: -8px;
  > * {
    margin-top: 8px;
    margin-left: 16px;
  }
`;


export const QuestionBoxBody = styled(Box)`


`;

export const QuestionBoxContent = styled(Box)`
  display: flex;
`;

export const QuestionBoxLeftContent = styled(Box)`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  max-width: 300px;
  border-right: 1px solid var(--gray-20);
`;

interface ButtonGroupProps {
  $selected?: boolean;
  $expanded?: boolean;
}

export const ButtonGroup = styled(Button) <ButtonGroupProps>`
  padding: 8px;
  text-transform: unset;
  border-radius: 0px;
  .MuiTypography-root {
    flex: 1;
    text-align: left;
    color: var(--eerie-black);
  }
  .MuiButton-startIcon {
    width: 20px;
    height: 20px;
    margin-left: 0px;
    visibility: hidden;
    .MuiSvgIcon-root {
      font-size: 20px;
      color: var(--gray-80);
    }
  }
  .MuiButton-endIcon {
    visibility: hidden;
    .MuiSvgIcon-root {
      font-size: 20px;
      color: var(--cimigo-blue-light-1);
    }
  }
  ${props => props.$selected && css`
    .MuiButton-startIcon {
      visibility: visible;
    }
  `}
  ${props => props.$expanded && css`
    background: var(--cimigo-blue-light-4);
    .MuiTypography-root {
      color: var(--cimigo-blue);
    }
    .MuiButton-startIcon {
      .MuiSvgIcon-root {
        color: var(--cimigo-blue-dark-1);
      }
    }
    .MuiButton-endIcon {
      visibility: visible;
    }
  `}
  &:hover {
    background: var(--cimigo-blue-light-4);
    .MuiTypography-root {
      color: var(--cimigo-blue);
    }
    .MuiButton-startIcon {
      .MuiSvgIcon-root {
        color: var(--cimigo-blue-dark-1);
      }
    }
  }
`;

export const QuestionBoxRightContent = styled(Box)`
  padding: 0px 32px 24px;
  flex: 1;
`;

export const ExclusiveBox = styled(Box)`
  display: flex;
  align-items: center;
  padding: 8px 0px;
  border-bottom: 1px solid var(--gray-10);
`;


export const AnswerList = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: -16px;
  margin-left: -16px;
  > * {
    padding-top: 16px;
    padding-left: 16px;
  }
`;

interface AnswerListItemProps {
  small?: boolean;
}

export const AnswerListItem = styled(Grid) <AnswerListItemProps>`
  
`;

export const AnswerListMobile = styled(Box) <AnswerListItemProps>`
  display: flex;
  flex-wrap: wrap;
  margin-left: -24px;
  margin-top: -16px;
  > * {
    padding-top: 16px;
    padding-left: 24px;
  }
`;