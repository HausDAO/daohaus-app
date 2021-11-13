import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Flex, Box, Text, Button } from '@chakra-ui/react';

import MainViewLayout from '../components/mainViewLayout';
import useBoost from '../hooks/useBoost';
import { getReadableBalance } from '../utils/tokenValue';
import { useAppModal } from '../hooks/useModals';
import { BOOSTS } from '../data/boosts';
import { FIELD } from '../data/fields';

const prepareFormLegoForUpdate = () => {
  // TODO: Review - editing this feel gross. maybe jsut create a new lego
  const spamEditForm = JSON.parse(JSON.stringify(BOOSTS.SPAM_FILTER));
  delete spamEditForm.steps.DISPLAY;
  spamEditForm.steps.STEP1.start = true;
  spamEditForm.steps.STEP1.form.fields[0] = [
    ...spamEditForm.steps.STEP1.form.fields,
    { ...FIELD.BASIC_SWITCH, label: 'Spam filter active?', name: 'active' },
  ];
  spamEditForm.steps.STEP2.stepLabel = 'Sign';
  spamEditForm.metaFields = [...spamEditForm.metaFields, 'active'];

  return spamEditForm;
};

const SpamFilterSettings = ({ daoMetaData, daoOverview }) => {
  const { daoid, daochain } = useParams();
  const { isActive, isLaunched } = useBoost();
  const { boostModal } = useAppModal();

  const handleEditClick = () => {
    boostModal(prepareFormLegoForUpdate());
  };

  return (
    <MainViewLayout header='Spam Filter' isDao>
      {isLaunched('SPAM_FILTER') && daoOverview && (
        <Flex direction='column' justify='flex-start' fontSize='lg'>
          <Flex mt={5}>
            Proposal list spam filter is{' '}
            <Text fontWeight='700' ml={2}>
              {isActive('SPAM_FILTER') ? 'ON' : 'OFF'}
            </Text>
          </Flex>

          <Box mt={5}>
            When on, proposals without a minimum tribute will be filtered out of
            the proposal list and only visible on the spam page. Minimum
            tribute:
            <Text fontWeight='700'>
              {`${getReadableBalance({
                balance:
                  daoMetaData.boosts.SPAM_FILTER.metadata.paymentRequested,
                decimals: daoOverview.depositToken.decimals,
              })} ${daoOverview.depositToken.symbol}`}
            </Text>
          </Box>

          <Flex mt={5}>
            The new proposal button is{' '}
            <Text fontWeight='700' mx={2}>
              {daoMetaData.boosts.SPAM_FILTER.metadata.membersOnly
                ? 'HIDDEN'
                : 'SHOWING'}
            </Text>{' '}
            for non DAO members.
          </Flex>

          <Flex mt={10}>
            <Button onClick={handleEditClick}>Edit</Button>
            {isActive('SPAM_FILTER') && (
              <Button
                to={`/dao/${daochain}/${daoid}/proposals/spam`}
                as={Link}
                variant='outline'
                ml={5}
              >
                View spam page
              </Button>
            )}
          </Flex>
        </Flex>
      )}
    </MainViewLayout>
  );
};

export default SpamFilterSettings;
