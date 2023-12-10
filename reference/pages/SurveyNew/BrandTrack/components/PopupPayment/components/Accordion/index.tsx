import { Accordion as AccordionRoot } from "@mui/material";
import styled, { css } from "styled-components";

interface Props {
  $accordionMain?: boolean;
  $accordionBankTransfer?: boolean;
  $accordionOrderSummary?: boolean;
}

const Accordion = styled(AccordionRoot)<Props>`
  ${(props) =>
    props.$accordionMain &&
    css`
      margin-top: 16px !important;
      box-shadow: unset;
      border: 1px solid var(--cimigo-blue-light-4);
      &::before {
        display: none;
      }
      .MuiAccordionSummary-root {
        padding: 8px 16px;
        min-height: unset;
      }
      .MuiAccordionDetails-root {
        padding: 0;
        background-color: var(--cimigo-blue-light-5);
      }
      [class~="MuiAccordionSummary-content"] {
        margin: 0;
      }
    `}
  ${(props) =>
    props.$accordionBankTransfer &&
    css`
        border: 1px solid var(--cimigo-blue-light-4);
        border-radius: 4px;
        .MuiAccordionSummary-root {
          padding: 8px 16px;
          border-radius: 4px;
          overflow: hidden;
          background-color: var(--cimigo-blue-light-4);
          &:hover {
            background-color: var(--cimigo-blue-light-3);
          }
        }
        [class~="Mui-expanded"] {
          border-bottom-left-radius: 0px;
          border-bottom-right-radius: 0px;
          p{
            font-weight: 600 !important;
          }
        }
        .MuiAccordionDetails-root {
          padding: 0px 16px;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    `}
     ${(props) =>
    props.$accordionOrderSummary &&
    css`
      margin-top: 16px !important;
      box-shadow: unset;
      border: 0;
      &::before {
        display: none;
      }
      .MuiAccordionSummary-root {
        padding: 0;
        margin: 0;
        min-height: unset;
      }
      .MuiAccordionDetails-root {
        padding: 0;
      }
      [class~="MuiAccordionSummary-content"] {
        margin: 0;
      }
    `}
`;

export default Accordion;
