import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Web3Service from '../../utils/Web3Service';
import { DaoServiceContext, DaoDataContext } from '../../contexts/Store';

import { phone, getAppDark, getAppLight } from '../../variables.styles';
import { DataH2 } from '../../App.styles';
import { OfferDivMemberCard } from './Member.styles';
import AddressProfileDisplay from '../shared/AddressProfileDisplay';
import ValueDisplay from '../shared/ValueDisplay';

const MemberCardDiv = styled.div`
  background-color: ${(props) => getAppLight(props.theme)};
  color: ${(props) => props.theme.baseFontColor};
  margin-top: 25px;
  border-top: 2px solid ${(props) => getAppDark(props.theme)};
  border-bottom: 2px solid ${(props) => getAppDark(props.theme)};
  transition: all 0.15s linear;
  padding: 25px;

  @media (min-width: ${phone}) {
    width: 320px;
    border: 2px solid ${(props) => getAppDark(props.theme)};
    margin-bottom: 25px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }

  &:hover {
    background-color: ${(props) => props.theme.primary};
    color: white;
    @media (min-width: ${phone}) {
      scale: 1.05;
    }
  }

  h3 {
    margin: 10px 0px;
  }

  .VotePower {
    margin-left: 25px;
  }
`;

const web3Service = new Web3Service();

const MemberCard = ({ member }) => {
  const [daoService] = useContext(DaoServiceContext);
  const [daoData] = useContext(DaoDataContext);

  const votingPower = (
    (member.shares / +member.moloch.totalShares) *
    100
  ).toFixed(2);

  return (
    <Link
      className="MemberLink"
      to={{
        pathname: '/dao/' + daoService.daoAddress + '/member/' + member.id,
      }}
    >
      <MemberCardDiv>
        <AddressProfileDisplay address={member.memberAddress} noCopy={true} />
        <OfferDivMemberCard>
          <div>
            <h5>Shares</h5>
            <DataH2>{member.shares}</DataH2>
          </div>
          <div>
            <h5>Loot</h5>
            <DataH2>{member.loot}</DataH2>
          </div>
          {+daoData.version !== 2 ? (
            <div>
              <h5>Tribute</h5>
              <DataH2>
                <ValueDisplay
                  value={web3Service.fromWei(member.tokenTribute)}
                />
              </DataH2>
            </div>
          ) : null}
          <div className="VotePower">
            <h5>Vote Power</h5>
            <DataH2>{votingPower} %</DataH2>
          </div>
        </OfferDivMemberCard>
      </MemberCardDiv>
    </Link>
  );
};

export default MemberCard;
