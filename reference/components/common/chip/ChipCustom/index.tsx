import { Chip, ChipProps } from "@mui/material";
import clsx from "clsx";
import { memo } from "react";
import styled from "styled-components";

const ChipStyled = styled(Chip)`
  
  .MuiChip-label {
    padding: 0px 16px;
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    color: var(--gray-90);
  }
  .MuiChip-deleteIcon { 
    font-size: 20px;
    color: var(--gray-40)
  }
  &.MuiChip-deletable {
    .MuiChip-deleteIcon { 
      margin: 0px 8px 0px -8px;
    }
  }
  &.MuiChip-filled {
    background-color: var(--gray-10);
    &:hover {
      background-color: var(--gray-30);
      .MuiChip-deleteIcon { 
        color: var(--gray-60)
      }
    }
    &.Mui-disabled {
      background-color: var(--gray-5);
      opacity: 1;
      .MuiChip-label {
        color: var(--gray-20);
      }
      .MuiChip-deleteIcon {
        color: var(--gray-20);
      }
    }
    &.selected:not(.Mui-disabled), &:hover:not(.Mui-disabled) {
      background: var(--cimigo-blue-light-4);
      .MuiChip-label {
        color: var(--cimigo-blue);
      }
      .MuiChip-deleteIcon {
        color: var(--cimigo-blue-light-2);
      }
    }
    &.selected:hover:not(.Mui-disabled) {
      .MuiChip-deleteIcon {
        color: var(--cimigo-blue-light-1);
      }
    }
  }
  &.MuiChip-outlined {
    background-color: var(--gray-5);
    border: 1px solid var(--gray-30);
    &:hover {
      background-color: var(--gray-10);
      .MuiChip-deleteIcon { 
        color: var(--gray-60)
      }
    }
    &.Mui-disabled {
      background-color: #ffffff;
      border: 1px solid var(--gray-10);
      opacity: 1;
      .MuiChip-label {
        color: var(--gray-20);
      }
      .MuiChip-deleteIcon {
        color: var(--gray-20);
      }
    }
    &.selected:not(.Mui-disabled), &:hover:not(.Mui-disabled) {
      background: var(--cimigo-blue-light-4);
      border: 1px solid var(--cimigo-blue-light-2);
      .MuiChip-label {
        color: var(--cimigo-blue);
      }
      .MuiChip-deleteIcon {
        color: var(--cimigo-blue-light-2);
      }
    }
    &.selected:hover:not(.Mui-disabled) {
      .MuiChip-deleteIcon {
        color: var(--cimigo-blue-light-1);
      }
    }
  }
  
`

interface Props extends ChipProps {
  selected?: boolean;
}

const ChipCustom = memo(({ selected, ...rest }: Props) => {

  return (
    <ChipStyled
      className={clsx({ "selected": selected })}
      {...rest}
    />
  )
})

export default ChipCustom