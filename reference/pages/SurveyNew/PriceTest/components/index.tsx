import { Box, Divider, StepLabel, Typography } from '@mui/material';
import styled, { css } from 'styled-components';

export const RightDivider = styled(Divider)`
  &::before {
    width: 0%;
  }
  .MuiDivider-wrapper {
    padding: 0;
  }
`;
export const DesciptionSampleText = styled(Typography)`
  color: var(--eerie-black);
  font-size: 16px;
  font-style: italic;
  font-weight: 400;
  line-height: 32px;
`;

interface StepProps {
  $isTips?: boolean;
  $isMidpoint?: boolean;
}
export const PriceStepLabel = styled(StepLabel)<StepProps>`
  width: 12px;
  height: 12px;
  justify-content: center;
  align-items: center;
  &:hover {
    .MuiBox-root {
      border-color: var(--gray-80);
      background-color: var(--gray-40);
      cursor: pointer;
    }
  }

  .MuiBox-root {
    width: 8px;
    height: 8px;
    margin: 2px;
    border-radius: 50%;
    border: 1px solid;
    border-color: var(--gray-40);
    background-color: var(--gray-10);
  }

  ${(props) =>
    props.$isTips &&
    css`
      width: 14px;
      .MuiBox-root {
        width: 10px;
        height: 10px;
        border-color: var(--gray-60);
        background-color: var(--gray-40);
      }
    `}
  ${(props) =>
    props.$isMidpoint &&
    css`
      width: 20px;
      .MuiStepLabel-iconContainer {
        border: 1px solid var(--gray-40);
        border-radius: 50%;
      }
      &:hover {
        .MuiStepLabel-iconContainer {
          border: 1px solid var(--gray-80);
        }
      }
      .MuiBox-root {
        width: 12px;
        height: 12px;
        margin: 4px;
        border-color: var(--gray-80);
        background-color: var(--gray-80) !important;
      }
    `}
`;

interface ContentProps {
  $filled?: boolean;
  $error?: boolean;
}
export const Content = styled(Typography)<ContentProps>`
  padding: 4px 6px;
  max-width: 100%;
  border: 1px dashed var(--gray-20);
  color: var(--gray-60);
  word-break: break-word;
  font-size: 16px;
  font-style: italic;
  font-weight: 400;
  line-height: 24px;

  &:hover {
    border: 1px dashed var(--gray-80);
    background: var(--gray-2);
  }

  ${(props) =>
    props.$filled &&
    css`
      border: 1px dashed var(--cimigo-blue);
      color: var(--cimigo-blue-light-1);
      &:hover {
        background: var(--cimigo-blue-light-4);
        color: var(--cimigo-blue);
      }
    `}

  ${(props) =>
    props.$error &&
    css`
      border-color: var(--red-error) !important;
    `}
`;
