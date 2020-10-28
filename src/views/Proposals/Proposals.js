import React from 'react';
import { Spinner } from '@chakra-ui/core';

import { useProposals } from '../../contexts/PokemolContext';
import ProposalsList from '../../components/Proposals/ProposalsList';

const Proposals = () => {
  const [proposals] = useProposals();

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
        </div>
      )}
    </div>
  );
};

export default Proposals;
