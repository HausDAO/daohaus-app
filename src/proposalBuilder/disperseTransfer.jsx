import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bold, ParaMd } from '../components/typography';
import { handleNounCase, NOUN } from '../utils/general';
import { readableTokenBalance } from '../utils/proposalCardUtils';
import { fetchSpecificTokenData } from '../utils/tokenValue';
import { AsyncCardTransfer } from './proposalBriefPrimitives';

const displayToken = async ({
  minionAction,
  daochain,
  setTokenData,
  setRecipientAmt,
  shouldUpdate,
}) => {
  const approveTx = minionAction?.decoded?.actions[0];
  const disperseTx = minionAction?.decoded?.actions[1];
  const tokenAddress = approveTx?.to;

  const amt = disperseTx?.data?.params[2].value?.reduce(
    (acc, amt) => acc + Number(amt),
    0,
  );
  const amtRecipients = disperseTx?.data?.params[1]?.value?.length;
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
    setRecipientAmt(amtRecipients);
  }
};

const displayEth = ({
  minionAction,
  setTokenData,
  setRecipientAmt,
  shouldUpdate,
}) => {
  const disperseTx = minionAction?.decoded?.actions[0];
  const amt = disperseTx?.data?.params[1].value?.reduce(
    (acc, amt) => acc + Number(amt),
    0,
  );
  const amtRecipients = disperseTx?.data?.params[0]?.value?.length;
  if (amt && amtRecipients && shouldUpdate) {
    setTokenData({
      name: 'ETH',
      decimals: 18,
      balance: amt,
    });
    setRecipientAmt(amtRecipients);
  }
};

const DisperseTransfer = ({ minionAction }) => {
  const { daochain } = useParams();
  const [tokenData, setTokenData] = useState(null);
  const [recipientAmt, setRecipientAmt] = useState(null);

  useEffect(() => {
    let shouldUpdate = true;

    if (!minionAction) return;

    if (minionAction) {
      const isDisperseEth = minionAction?.decoded?.actions?.some(
        action => action?.data?.name === 'disperseEther',
      );
      if (isDisperseEth) {
        displayEth({
          minionAction,
          setTokenData,
          setRecipientAmt,
          shouldUpdate,
        });
      } else {
        displayToken({
          minionAction,
          daochain,
          setTokenData,
          setRecipientAmt,
          shouldUpdate,
        });
      }
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
      to{' '}
      <Bold>
        {recipientAmt} {handleNounCase(recipientAmt, NOUN.ADDRESSES)}{' '}
      </Bold>
    </ParaMd>
  );

  return <AsyncCardTransfer isLoaded={customUI} customUI={customUI} />;
};

export default DisperseTransfer;
