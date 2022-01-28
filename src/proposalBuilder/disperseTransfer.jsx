import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bold, ParaMd } from '../components/typography';
import { readableTokenBalance } from '../utils/proposalCardUtils';
import { fetchSpecificTokenData } from '../utils/tokenValue';
import { AsyncCardTransfer } from './proposalBriefPrimitives';

const DisperseTransfer = ({ minionAction }) => {
  const { daochain } = useParams();
  const [tokenData, setTokenData] = useState(null);
  const [recipientAmt, setRecipientAmt] = useState(null);

  useEffect(() => {
    let shouldUpdate = true;
    const fetchThatTokenData = async (tokenAddress, amt, amtRecip) => {
      const tokenData = await fetchSpecificTokenData(
        tokenAddress,
        { name: true, decimals: true },
        daochain,
      );
      if (tokenData && shouldUpdate) {
        setTokenData({
          name: tokenData?.name,
          decimals: tokenData?.decimals,
          balance: amt,
        });
        setRecipientAmt(amtRecip);
      }
    };
    const approveTx = minionAction?.decoded?.actions[0];
    const disperseTx = minionAction?.decoded?.actions[1];
    const tokenAddress = approveTx.to;

    const amt = disperseTx?.data?.params[2].value?.reduce(
      (acc, amt) => acc + Number(amt),
      0,
    );
    const amtRecipients = disperseTx?.data?.params[1]?.value?.length;
    if (tokenAddress) {
      console.log(
        'minionAction?.decoded?.actions',
        minionAction?.decoded?.actions,
      );
      fetchThatTokenData(tokenAddress, amt, amtRecipients);
    }
    return () => (shouldUpdate = false);
  }, [minionAction]);

  const customUI = tokenData && (
    <ParaMd>
      Dispersing{' '}
      <Bold>
        {readableTokenBalance({
          balance: tokenData.balance,
          decimals: tokenData?.decimals,
          symbol: tokenData?.name,
        })}{' '}
      </Bold>
      to <Bold>{recipientAmt} address</Bold>
    </ParaMd>
  );

  return <AsyncCardTransfer isLoaded={customUI} customUI={customUI} />;
};

export default DisperseTransfer;
