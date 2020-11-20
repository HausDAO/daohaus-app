import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/core';

import { useDao } from '../../contexts/PokemolContext';
import BankOverviewChart from '../../components/Bank/BankOverviewChart';
import TokenList from '../../components/Shared/TokenList/TokenList';
import GraphFetchMore from '../../components/Shared/GraphFetchMore';
import { BANK_BALANCES } from '../../utils/apollo/bank-queries';
import ProposalFormModal from '../../components/Modal/ProposalFormModal';

const Bank = () => {
  const [dao] = useDao();
  const [tokenList, setTokenList] = useState(null);
  const [balances, setBalances] = useState();
  const [, setProposal] = useState(null);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (dao?.graphData?.tokenBalances) {
      setTokenList(dao.graphData.tokenBalances);
    }
  }, [dao]);

  return (
    <>
      <ProposalFormModal
        submitProposal={setProposal}
        isOpen={showModal}
        setShowModal={setShowModal}
        proposalType={'whitelist'}
        returnRoute={`/dao/${dao?.address}/bank`}
      />

      <Box w='100%' p={6}>
        <BankOverviewChart balances={balances} />
        <TokenList tokenList={tokenList} />

        {dao?.address && dao?.graphData ? (
          <GraphFetchMore
            query={BANK_BALANCES}
            setRecords={setBalances}
            entity='balances'
            variables={{
              molochAddress: dao.address,
            }}
            isStats={true}
          />
        ) : null}
      </Box>
    </>
  );
};

export default Bank;
