import styled from 'styled-components';

import { dataFont, danger, dangerHover, phone } from './variables.styles';

// export const StyledA = styled.a`
//   color: $primary;
//   fill: $primary;
//   text-decoration: none;
//   transition: all 0.15s linear;
//   vertical-align: middle;
//   cursor: pointer;
//   svg {
//     display: inline-block;
//     margin: 0;
//     padding: 0px;
//     vertical-align: middle;
//     width: 24px;
//     height: 24px;
//     margin-top: -3px;
//     &.IconLeft {
//       margin-right: 5px;
//     }
//     &.IconRight {
//       margin-left: 5px;
//     }
//   }
//   &:hover {
//     color: $primary-hover;
//     fill: $primary-hover;
//   }
// `

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

export const DataButton = styled.button`
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

export const RiskyBizButton = styled.button`
  margin: 25px auto;
  font-weight: 500;
  background-color: ${danger};
  &:hover {
    background-color: ${dangerHover};
  }
  @media (max-width: ${phone}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    svg,
    span {
      margin: 5px auto;
    }
    border-radius: 0px;
  }
`;

export const FlexCenterDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const BackdropOpenDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: ${(props) =>
    props.blank ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.85)'};
  pointer-events: cursor;
`;

export const BackdropDiv = styled.div`
  background-color: rgba(0, 0, 0, 0);
  transition: all 0.15s linear;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  pointer-events: none;
`;

export const ViewDiv = styled.div`
  padding-bottom: 117px;
`;

export const PadDiv = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`;
