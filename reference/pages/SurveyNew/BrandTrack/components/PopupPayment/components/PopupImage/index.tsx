import styled from "styled-components";

export const ImageMain = styled.img`
  object-fit: contain;
  display: block;
  @media only screen and (max-width: 767px) {
    width: 80px;
    height: 80px;
  }
`;

export const ImageSecond = styled.img`
  object-fit: contain;
  display: block;
`;
