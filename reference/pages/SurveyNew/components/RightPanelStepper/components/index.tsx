import { StepContent, Typography } from  '@mui/material';
import styled, { css } from 'styled-components';


export const RPStepTitle = styled(Typography)`
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.25px;
    color: var(--eerie-black);
`
interface RPStepSubtitleProps{
    $overflow?: boolean;
}

export const RPStepSubtitle = styled(Typography)<RPStepSubtitleProps>`
    color: var(--gray-60);
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.4px;
    font-weight: 400;
    white-space: nowrap;

    ${props => props.$overflow && css `
        overflow: hidden;
        text-overflow: ellipsis;
    `}
`
interface RPStepContentProps{
    $bold?: boolean;
}
export const RPStepTextContent = styled(Typography)<RPStepContentProps>`
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0.25px;
    color: var(--gray-90);
    ${props=> props.$bold && css`
        font-weight: 500;
        letter-spacing: 0.1px;
    `}
`