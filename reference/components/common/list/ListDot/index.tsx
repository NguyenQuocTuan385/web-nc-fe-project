import { Box } from "@mui/material";
import styled from "styled-components";


const ListDot = styled(Box)`
  color: var(--gray-80);
  list-style-position: outside;
  padding-left: 16px;
  li {
    &::marker {
      font-size: 10px;
      color: var(--gray-80);
    }
  }
`

export default ListDot;