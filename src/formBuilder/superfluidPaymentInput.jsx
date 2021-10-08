import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import PaymentInput from './paymentInput';
import { SF_ACTIVE_STREAMS } from '../graphQL/superfluid-queries';
import { graphQuery } from '../utils/apollo';
import { supportedChains } from '../utils/chain';

const SuperfluidPaymentInput = props => {
  const { daochain } = useParams();
  const { localForm } = props;
  const { setValue, watch, register } = localForm;

  const paymentToken = watch('paymentToken');
  const applicant = watch('applicant');
  const minion = watch('selectedMinion');

  useEffect(() => {
    register('activeStream');
  }, []);

  useEffect(() => {
    const checkActiveStream = async () => {
      const chainConfig = supportedChains[daochain];
      const accountStreams = await graphQuery({
        endpoint: chainConfig.superfluid.subgraph_url,
        query: SF_ACTIVE_STREAMS,
        variables: {
          ownerAddress: minion,
          recipientAddress: applicant.toLowerCase(),
        },
      });

      const activeStream = accountStreams?.account?.flowsOwned?.find(
        s => s.token?.underlyingAddress === paymentToken,
      );
      setValue('activeStream', activeStream);
    };

    if (paymentToken && applicant && minion) {
      checkActiveStream();
    }
  }, [applicant, paymentToken, minion]);

  return <PaymentInput {...props} />;
};
export default SuperfluidPaymentInput;
