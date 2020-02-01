import styled from 'styled-components';

import { dataFont } from './variables.styles';

export const ProposalAndMemberCardDiv = styled.div`
  padding: 25px;
  border-top: 2px solid #eee;
`;

export const DataP = styled.p`
  font-family: ${dataFont};
  font-weight: 400;
  word-break: break-all;
  margin: 0;
`;

export const DataH2 = styled.h2`
  font-family: ${dataFont};
  font-weight: 400;
  word-break: break-all;
  margin: 0;
`;

export const OfferDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  div:first-child {
    margin-right: 25px;
  }
  h5 {
    margin: 0px;
  }
  h2 {
    margin: 0px;
  }
`;
