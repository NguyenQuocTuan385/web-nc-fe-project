import { Button, Grid } from "@mui/material";
import styled from "styled-components";

export const PageRoot = styled(Grid)`
  max-width: 1048px;
  margin: auto;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 96px;
  @media only screen and (max-width: 767px) {
    padding-bottom: 85px;
  }
`

export const PageBody = styled(Grid)`
  border: 1px solid var(--gray-40);
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;
  @media only screen and (max-width: 992px) {
    background: #ffffff;
    border: none;
    border-radius: 0px;
    padding: 0px;
    margin-top: 0px;
  }
`

export const BodyContent = styled(Grid)`
  display: flex;
  justify-content: space-between;
  > * {
    &:not(:first-child) {
      margin-left: 16px;
    }
    flex: 1;
  }
  @media only screen and (max-width: 992px) {
    display: flex;
    flex-direction: column;
    justify-content: unset;
    > * {
      &:not(:first-child) {
        margin-left: 0px;
      }
      &:not(:last-child) {
        border-bottom: 1px solid #dddddd;
      }
      flex: unset;
    }
  }
`

export const RowItem = styled(Grid)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:not(:first-child) {
    margin-top: 32px;
  }

  @media only screen and (max-width: 992px) {
    padding: 16px 0px;
    &:not(:last-child) {
      border-bottom: 1px solid #dddddd;
    }
    &:not(:first-child) {
      margin-top: 0px;
    }
  }
`

export const LeftItem = styled(Grid)`
  flex: 45%;

  @media only screen and (max-width: 992px) {
    flex: unset;
  }
`

export const RightItem = styled(Grid)`
  flex: 55%;
  display: flex;
  .solutionImg {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    object-fit: contain;
  }

  @media only screen and (max-width: 992px) {
    flex: unset;
  }
`

export const RowItemBox = styled(RowItem)`
  flex-direction: column;
  align-items: unset;
  justify-content: unset;

  @media only screen and (max-width: 992px) {
    flex: unset;
  }
`

export const ItemHead = styled(Grid)`
  display: flex;
  align-items: center;

  @media only screen and (max-width: 992px) {
    justify-content: space-between;
  }
`

export const ItemContent = styled(Grid)`
  margin-top: 16px;
  margin-left: 8px;
  padding-left: 16px;
  border-left: 1px dashed var(--gray-20);
`

export const ItemSubBox = styled(Grid)`
  display: flex;
  &:not(:first-child) {
    margin-top: 16px;
  }
`

export const ItemSubLeft = styled(Grid)`
  flex: 1;
`

export const ItemSubRight = styled(Grid)`
  margin-left: 16px;
  flex: 1;

  > p {
    word-break: normal;
    overflow-wrap: anywhere;
    &:not(:first-child) {
      margin-top: 8px;
    }
  }
`

export const ItemSubRightCustom = styled(ItemSubRight)`
  @media only screen and (max-width: 992px) {
    > p {
      color: var(--eerie-black-65);
      > span {
        color: var(--eerie-black);
        display: block;
      }
    }
  }
`

export const ButtonGoTo = styled(Button)`
  white-space: nowrap;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 29px;
  border-radius: 4px;
  background: var(--cultured-gray);
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: var(--cimigo-blue-dark-2);
  text-transform: unset;
  margin-left: 24px;

  svg {
    font-size: 12px !important;
  }
  &:hover {
    background-color: var(--cimigo-blue-light-4);
  }
  @media only screen and (max-width: 992px) {
    font-size: 12px;
    line-height: 15px;
    height: 27px;
  }
`