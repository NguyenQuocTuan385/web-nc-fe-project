import { Box, Grid } from "@mui/material";
import ParagraphBody from "components/common/text/ParagraphBody";
import styled from "styled-components";


export const ImageMain = styled.img`
  margin: 32px auto 16px auto;
  width: 135px;
  height: 135px;
  object-fit: contain;
  display: block;
  @media only screen and (max-width: 767px) {
    margin: 16px auto 24px auto;
    width: 80px;
    height: 80px;
  }
`;

export const InforBox = styled(Box)`
  width: 100%;
  padding: 24px;
  background: var(--gray-5);
  border: 1px solid var(--gray-40);
  border-radius: 5px;
  > * {
    margin-top: -16px;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      left: -1px;
      top: 0px;
      width: 3px;
      height: 100%;
      background-color: var(--gray-5);
    }
  }
  @media only screen and (max-width: 767px) {
    padding: 24px 4px 24px;
  }
`

export const InforBoxItem = styled(Grid)`
  border-left: 1px solid var(--gray-20);
  padding: 0px 24px !important;
  margin-top: 16px;
  > * {
    :not(:first-child) {
      margin-top: 2px;
    }
  }
  @media only screen and (max-width: 767px) {
    padding: 0px 16px !important;
  }
`

export const DownLoadItem = styled(Grid)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:not(:first-child) {
    margin-left: 24px;
  }
  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    margin-bottom: 4px;
  }
`

export const ParagraphBodyBlueNestedA = styled(ParagraphBody)`
 > a {
  font-weight: 600;
  color: var(--cimigo-blue);
 }
`