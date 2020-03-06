import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';

import { DaoServiceContext, DaoDataContext } from '../../contexts/Store';
import { getAppDark } from '../../variables.styles';

const StackedVoteDiv = styled.div`
  position: ${(props) =>
    props.page === 'ProposalCard' ? 'relative' : 'absolute'};
  left: ${(props) => (props.page === 'ProposalCard' ? '0' : '50%')};
  transform: ${(props) =>
    props.page === 'ProposalCard' ? 'translateX(0%)' : 'translateX(-50%)'};
  bottom: ${(props) => (props.page === 'ProposalCard' ? '0px' : '47px')};
  width: ${(props) =>
    props.page === 'ProposalCard' ? '100%' : 'calc(100% - 150px)'};
`;

const FullBarDiv = styled.div`
  width: ${(props) =>
    props.page === 'ProposalCard' ? 'calc(100%)!important' : '100%'};
  height: 5px;
  position: relative;
  margin-top: ${(props) => (props.page === 'ProposalCard' ? '50px' : 'auto')};
`;

const LabelsDiv = styled.div`
  position: relative;
  min-height: 5px;
  width: 100%;
`;

const YesLabelSpan = styled.span`
  width: ${(props) =>
    props.page === 'ProposalCard' ? 'auto !important' : '65px'};
  padding: 0px;
  position: absolute;
  top: ${(props) =>
    props.page === 'ProposalCard' ? '-25px !important' : '-50px'};
  left: ${(props) =>
    props.page === 'ProposalCard' ? '0px !important' : '-62px'};
  text-align: ${(props) =>
    props.page === 'ProposalCard' ? 'right' : 'center'};
  background-color: transparent;
  font-weight: 900;
  color: ${(props) => props.theme.primary};
`;

const NoLabelSpan = styled.span`
  width: ${(props) =>
    props.page === 'ProposalCard' ? 'auto !important' : '65px'};
  padding: 0px;
  position: absolute;
  top: ${(props) =>
    props.page === 'ProposalCard' ? '-25px !important' : '-50px'};
  right: ${(props) =>
    props.page === 'ProposalCard' ? '0px !important' : '-62px'};
  text-align: ${(props) =>
    props.page === 'ProposalCard' ? 'right' : 'center'};
  background-color: transparent;
  font-weight: 900;
  color: ${(props) => props.theme.tertiary};
`;

const BaseBarDiv = styled.div`
  width: 100%;
  height: 5px;
  position: absolute;
  background-color: ${(props) => getAppDark(props.theme)};
`;

const YesBarDiv = styled.div`
  height: 5px;
  position: absolute;
  background-color: ${(props) => props.theme.primary};
  left: 0px;
  width: ${(props) => props.percentageShares + '%'};
`;

const NoBarDiv = styled.div`
  height: 5px;
  right: 0px;
  position: absolute;
  background-color: ${(props) => props.theme.tertiary};
  width: ${(props) => props.percentageShares + '%'};
`;

const QuorumBarDiv = styled.div`
  width: 2px;
  height: 5px;
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

const StackedVote = ({ id, currentYesVote, currentNoVote, page }) => {
  const [noVoteShares, setNoVoteShares] = useState(0);
  const [yesVoteShares, setYesVoteShares] = useState(0);
  const [percentageSharesYes, setPercentageSharesYes] = useState(0);
  const [percentageSharesNo, setPercentageSharesNo] = useState(0);
  const [daoService] = useContext(DaoServiceContext);
  const [daoData] = useContext(DaoDataContext);

  if (currentYesVote === undefined) {
    currentYesVote = 0;
  }
  if (currentNoVote === undefined) {
    currentNoVote = 0;
  }

  useEffect(() => {
    const currentProposal = async () => {
      // TODO: why am i doing this? should be using the subgraph
      const info =
        +daoData.version === 2
          ? await daoService.mcDao.proposals(id)
          : await daoService.mcDao.proposalQueue(id);

      const noVoteShares = parseInt(info.noVotes) + currentNoVote;
      const yesVoteShares = parseInt(info.yesVotes) + currentYesVote;
      const totalVoteShares = noVoteShares + yesVoteShares;
      const percentageSharesYes = (yesVoteShares / totalVoteShares) * 100 || 0;
      const percentageSharesNo = (noVoteShares / totalVoteShares) * 100 || 0;

      setNoVoteShares(noVoteShares);
      setYesVoteShares(yesVoteShares);
      setPercentageSharesYes(percentageSharesYes);
      setPercentageSharesNo(percentageSharesNo);
    };

    currentProposal();

    // eslint-disable-next-line
  }, [daoService, id, currentYesVote, currentNoVote]);

  return (
    <StackedVoteDiv page={page}>
      <FullBarDiv page={page}>
        <LabelsDiv page={page}>
          <YesLabelSpan page={page}>{yesVoteShares}</YesLabelSpan>
          <NoLabelSpan page={page}>{noVoteShares}</NoLabelSpan>
        </LabelsDiv>
        <BaseBarDiv />
        <YesBarDiv percentageShares={percentageSharesYes} />
        <NoBarDiv percentageShares={percentageSharesNo} />
        <QuorumBarDiv />
      </FullBarDiv>
    </StackedVoteDiv>
  );
};

export default StackedVote;
