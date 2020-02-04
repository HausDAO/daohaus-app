import styled from 'styled-components';

import { OfferDiv } from '../../App.styles';

export const MemberCardIdentityDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const MemberCardImage = styled.div`
  margin-right: 10px;
`;

export const ProfileImgCard = styled.div`
  width: 50px;
  height: 50px;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 50%;
`;

export const OfferDivMemberCard = styled(OfferDiv)`
  margin-top: 25px;
  margin-bottom: 25px;
`;
