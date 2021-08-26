import React, { useState } from 'react';
import { Divider, Flex, Link, Spinner, Button, Box } from '@chakra-ui/react';
import { BsCheckCircle } from 'react-icons/bs';

import { useParams } from 'react-router';
import ProgressIndicator from './progressIndicator';
import Header from '../formBuilder/header';
import TextBox from './TextBox';
import { FORM } from '../data/forms';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { addBoost } from '../utils/metadata';
import { chainByID } from '../utils/chain';

const Signer = props => {
  const { playlist, boostData, goToNext, finish } = props;
  const { daochain } = useParams();
  const { daoProposals, daoMetaData, refetchMetaData } = useMetaData();
  const { injectedProvider, address } = useInjectedProvider();

  const [state, setState] = useState(null);
  const handleAddBoost = async () => {
    setState('signing');
    await addBoost({
      meta: daoMetaData,
      injectedProvider,
      address,
      network: chainByID(daochain).network,
      boostData,
      proposalConfig: playlist && daoProposals,
    });
    setState('signed');
    refetchMetaData();
  };

  return (
    <Flex flexDirection='column'>
      <Header>Member Signature</Header>

      {!playlist && (
        <TextBox variant='body' mb={6}>
          This boost is ready to launch. Sign with metamask to prove DAO
          membership.
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
                  <TextBox mb={2}>{form.title}</TextBox>
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
      {state === 'signing' && (
        <ProgressIndicator prepend={<Spinner mr={3} />} text='Processing...' />
      )}
      {state === 'signed' && (
        <ProgressIndicator icon={BsCheckCircle} text='Boost Added!' />
      )}
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
