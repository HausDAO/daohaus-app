import React, { useEffect, useState } from 'react';
import { Flex, Button, Spinner } from '@chakra-ui/react';
import { RiCheckboxCircleLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useTX } from '../contexts/TXContext';
import { useUser } from '../contexts/UserContext';
import { useOverlay } from '../contexts/OverlayContext';
import { SubmitFormError } from './staticElements';
import FieldWrapper from './fieldWrapper';
import { createPoll } from '../services/pollService';
import { NFTService } from '../services/nftService';
import { supportedChains } from '../utils/chain';

const NftApproval = props => {
  const [loading, setLoading] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const { localForm, name, error } = props;
  const { register, setValue, watch } = localForm;
  const { errorToast, successToast } = useOverlay();
  const { daochain, daoid } = useParams();
  const { injectedProvider, address } = useInjectedProvider();
  const { refreshDao } = useTX();
  const { cachePoll, resolvePoll } = useUser();

  const nftAddress = watch('nftAddress');
  const approved = watch(name);

  useEffect(() => {
    register(name);
  }, []);

  // Check isApprovedForAll
  useEffect(() => {
    if (nftAddress && injectedProvider && daochain) {
      const validAddress = /^0x[a-fA-F0-9]{40}$/.test(nftAddress);
      setIsValidAddress(validAddress);

      if (nftAddress && validAddress) {
        const escrow = supportedChains[daochain].escrow_minion;
        const args = [address, escrow];
        NFTService({
          web3: injectedProvider,
          chainID: daochain,
          tokenAddress: nftAddress,
        })('isApprovedForAll')({ args, address }).then(result => {
          setValue(name, result);
        });
      } else {
        setValue(name, false);
      }
    }
  }, [nftAddress, injectedProvider, daochain]);

  // Call setApprovalForAll on Escrow Minion
  const unlock = async () => {
    if (nftAddress && isValidAddress) {
      setLoading(true);
      const escrow = supportedChains[daochain].escrow_minion;
      const args = [escrow, 'true'];

      try {
        const poll = createPoll({ action: 'approveAllTokens', cachePoll })({
          daoID: daoid,
          chainID: daochain,
          tokenAddress: nftAddress,
          userAddress: address,
          controllerAddress: escrow,
          actions: {
            onError: (error, txHash) => {
              errorToast({
                title: 'There was an error.',
              });
              resolvePoll(txHash);
              console.error(`Could not find a matching proposal: ${error}`);
              setLoading(false);
            },
            onSuccess: txHash => {
              successToast({
                title: 'Tribute NFT unlocked',
              });
              refreshDao();
              resolvePoll(txHash);
              setValue(name, true);
              setLoading(false);
            },
          },
        });
        await NFTService({
          web3: injectedProvider,
          chainID: daochain,
          tokenAddress: nftAddress,
        })('setApprovalForAll')({ args, address, poll });
      } catch (err) {
        console.error('error:', err);
        setLoading(false);
      }
    }
  };

  return (
    <FieldWrapper>
      <Flex>
        <Button
          variant='outline'
          size='xs'
          onClick={unlock}
          disabled={!nftAddress || !isValidAddress || approved || loading}
          mt={0}
          mr={3}
        >
          Approve NFT Transfer
        </Button>
        {approved && (
          <RiCheckboxCircleLine
            style={{
              width: '25px',
              height: '25px',
            }}
          />
        )}
        {loading && <Spinner />}
      </Flex>
      {error && <SubmitFormError message={error.message} />}
    </FieldWrapper>
  );
};

export default NftApproval;
