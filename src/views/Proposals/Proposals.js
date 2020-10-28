import { Spinner } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';

import GraphFetchMore from '../../components/Shared/GraphFetchMore';
import { useDao, useProposals } from '../../contexts/PokemolContext';
import { PROPOSALS_LIST } from '../../utils/apollo/proposal-queries';
import ProposalsList from '../../components/Proposals/ProposalsList';

const Proposals = () => {
  const [proposalGraphData, setProposalGraphData] = useState();
  const [dao] = useDao();
  const [proposals, updateProposals] = useProposals();

  useEffect(() => {
    if (proposalGraphData) {
      updateProposals(proposalGraphData);
    }
  }, [proposalGraphData]);

  console.log('proposalGraphData', proposalGraphData);

  return (
    <div>
      {!proposals ? (
        <Spinner />
      ) : (
        <div>
          {proposals ? (
            <>
              <ProposalsList proposals={proposals} />
            </>
          ) : null}

          {dao ? (
            <GraphFetchMore
              query={PROPOSALS_LIST}
              setRecords={setProposalGraphData}
              entity='proposals'
              variables={{ contractAddr: dao.address }}
              context={{ currentPeriod: dao.currentPeriod }}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Proposals;
