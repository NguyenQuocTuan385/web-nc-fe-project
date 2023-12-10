
import styled from 'styled-components';

const Container = styled('div')`
  width: auto;
  max-width: 1240px;
  margin: 0 auto;
  @media only screen and (max-width: 1520px) {
    max-width: 1240px !important;
    padding-left: 2.2857rem;
    padding-right: 2.2857rem;
  }
  @media only screen and (max-width: 1024px) {
    max-width: 1024px !important;
    padding-left: 2.2857rem;
    padding-right: 2.2857rem;
  }
  @media only screen and (max-width: 767px) {
    max-width: 550px !important;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }
`

export default Container