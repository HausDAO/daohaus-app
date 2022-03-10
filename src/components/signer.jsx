import React, { useState } from 'react';
import { BsCheckCircle } from 'react-icons/bs';
import { BiErrorCircle } from 'react-icons/bi';
import { useParams } from 'react-router-dom';
import { Divider, Flex, Link, Button, Box } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { useOverlay } from '../contexts/OverlayContext';
import ProgressIndicator from './progressIndicator';
import TextBox from './TextBox';
import { FORM } from '../data/formLegos/forms';
import { addBoost } from '../utils/metadata';
import { chainByID } from '../utils/chain';
import { useTX } from '../contexts/TXContext';

const indicatorStates = {
  signing: {
    spinner: true,
    title: 'Signing...',
  },
  signed: {
    icon: BsCheckCircle,
    title: 'Signed!',
  },
  error: {
    icon: BiErrorCircle,
    title: 'Error updating DAO Metadata',
    errorMessage: true,
  },
};

const Signer = props => {
  const {
    playlist,
    boostData,
    goToNext,
    finish,
    stepperStorage,
    daoRefetch,
  } = props;
  const { daochain } = useParams();
  const { successToast, errorToast } = useOverlay();
  const { daoProposals, daoMetaData, refetchMetaData } = useMetaData();
  const { refreshDao } = useTX();
  const { injectedProvider, address } = useInjectedProvider();
  const [state, setState] = useState(null);

  console.log('daoRefetch', daoRefetch, props);

  const handleAddBoost = async () => {
    setState('signing');
    await addBoost({
      meta: daoMetaData,
      injectedProvider,
      address,
      network: chainByID(daochain).network,
      boostData,
      proposalConfig: playlist && daoProposals,
      extraMetaData: stepperStorage,
      onError(error) {
        setState('error');
        errorToast({
          title: 'Error updating DAO Metadata',
          description: error?.message,
        });
      },
      onSuccess() {
        setState('signed');
        successToast({
          title: 'Updated DAO Metadata',
        });
        refetchMetaData();
        if (daoRefetch) {
          const skipVaults = true;
          refreshDao(skipVaults);
        }
      },
    });
  };

  return (
    <Flex flexDirection='column'>
      {!playlist && (
        <TextBox variant='body' mb={6}>
          This boost is ready. Sign with metamask to prove DAO membership.
        </TextBox>
      )}

      {playlist && (
        <>
          <TextBox variant='body' mb={6}>
            This boost adds a proposal playlist.{' '}
            <Link
              href='https://daohaus.club/docs/users/minion-faq'
              color='secondary.400'
              isExternal
            >
              Learn more about playlists here.
            </Link>
          </TextBox>
          <TextBox size='xs' mb={2}>
            Playlist Name
          </TextBox>
          <TextBox variant='body' mb={6}>
            {playlist.name}
          </TextBox>
          <TextBox size='xs' mb={4}>
            Proposals ({playlist?.forms?.length})
          </TextBox>
          {playlist?.forms.map(formID => {
            const form = FORM[formID];
            return (
              <Box key={formID}>
                <Flex mb={4} flexDir='column'>
                  <TextBox mb={2} variant='body'>
                    {form.title}
                  </TextBox>
                  <TextBox variant='body' size='sm'>
                    {form.description}
                  </TextBox>
                </Flex>
                <Divider mb={2} />
              </Box>
            );
          })}
        </>
      )}

      <ProgressIndicator states={indicatorStates} currentState={state} />

      <Flex mt={6} justifyContent='flex-end'>
        {state === 'signed' ? (
          <Button onClick={goToNext}>{finish ? 'Finish' : 'Next >'}</Button>
        ) : (
          <Button
            onClick={handleAddBoost}
            isLoading={state === 'signing'}
            loadingText='Signing'
          >
            Sign
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Signer;
