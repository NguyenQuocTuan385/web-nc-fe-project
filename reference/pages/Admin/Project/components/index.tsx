import { Table } from "@mui/material";
import styled, { css } from "styled-components";

export const TableCustom = styled(Table)`
  thead {
    td, th {
      color: #fff;
    }
    background: var(--cimigo-blue);
  }
`

export const ExclusiveBox = styled.span`
  background-color: #a6cc17;
  padding: 2px 6px;
  font-size: 12px;
  line-height: normal;
  letter-spacing: 0.015em;
  color: #293306;
  border-radius: 5px;
  margin: 0 5px;
  font-weight: 500;
`

interface SetupSurveyTextProps {
  $empty?: boolean;
}
export const SetupSurveyText = styled.strong<SetupSurveyTextProps>`
   ${props => props.$empty && css`
    color: var(--cimigo-danger) !important;
  `}
`