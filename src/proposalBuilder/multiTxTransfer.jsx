import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ParaMd } from '../components/typography';
import { AsyncCardTransfer } from './propBriefPrimitives';

const MultiTxTransfer = ({ minionAction, proposal }) => {
  const { proposalId } = proposal;
  const { daochain, daoid } = useParams();
  const customUI = (
    <ParaMd>
      Multicall x{minionAction?.decoded?.actions?.length} (
      <Link to={`/dao/${daochain}/${daoid}/proposals/${proposalId}`}>
        View Details
      </Link>
      )
    </ParaMd>
  );
  console.log(`minionAction`, minionAction);

  return (
    <AsyncCardTransfer
      outgoing
      isLoaded={minionAction?.decoded}
      customUI={customUI}
    />
  );
};

export default MultiTxTransfer;
