import React, { useContext, useEffect, useState } from 'react';
import ApolloClient from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import { GET_TRANSMUTATION } from '../../../utils/Queries';
import ErrorMessage from '../../../components/shared/ErrorMessage';
import Loading from '../../../components/shared/Loading';
import TransmutationForm from '../../../components/proposal-v2/TransmutationForm';
import {
  DaoDataContext,
  Web3ConnectContext,
  CurrentUserContext,
  BoostContext,
} from '../../../contexts/Store';
import { BcProcessorService } from '../../../utils/BcProcessorService';
import { TransmutationService } from '../../../utils/TransmutationService';

const transClient = new ApolloClient({
  uri:
    'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-transmutation',
});

const Transmutation = () => {
  const [daoData] = useContext(DaoDataContext);
  const [web3Connect] = useContext(Web3ConnectContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [boosts] = useContext(BoostContext);

  const [transmutationService, setTransmutationService] = useState();

  const options = {
    client: transClient,
    variables: { contractAddr: daoData.contractAddress },
  };

  const { loading, error, data } = useQuery(GET_TRANSMUTATION, options);

  useEffect(() => {
    const setService = async () => {
      const bcProcessor = new BcProcessorService(web3Connect.web3);

      const setupValues = {
        ...boosts.transmutation.metadata,
        ...data.transmutations[0],
      };
      const service = new TransmutationService(
        web3Connect.web3,
        currentUser.username,
        setupValues,
        bcProcessor,
      );

      setTransmutationService(service);
    };

    if (data && data.transmutations[0]) {
      setService();
    }

    // eslint-disable-next-line
  }, [data]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      {transmutationService ? (
        <TransmutationForm transmutationService={transmutationService} />
      ) : null}
    </>
  );
};

export default Transmutation;
