import React from 'react';
import { Box, Text, Button, Flex, Link, Textarea } from '@chakra-ui/react';
import { daoPresets } from '../../content/summon-presets';
import PresetCard from './PresetCard';
import { useNetwork } from '../../contexts/PokemolContext';

import {
  formatPeriodLength,
  formatDepositWei,
  periodsPerDayPreset,
} from '../../utils/helpers';
import { useState } from 'react/cjs/react.development';

const SummonSettings = ({ daoData, setDaoData, handleSummon }) => {
  const [network] = useNetwork();
  const [multiSummoners, setMultiSummoners] = useState(false);
  const selectPreset = (preset) => {
    setDaoData((prevState) => {
      return { ...prevState, ...preset };
    });
  };

  const renderPresets = () => {
    return daoPresets(network.network_id).map((preset) => {
      const isSelected = daoData.presetName === preset.presetName;
      return (
        <PresetCard
          preset={preset}
          isSelected={isSelected}
          selectPreset={selectPreset}
          key={preset.presetName}
        ></PresetCard>
      );
    });
  };

  const handleMultiSummonerChange = (e) => {
    const value = e.target.value;
    setDaoData((prevState) => {
      return { ...prevState, summonerAndShares: value };
    });
  };

  // needed if/when we allow editing setting inline
  // const handleReset = () => {
  //   console.log('reset');
  // };

  return (
    <Box>
      <Box
        d='flex'
        wrap='wrap'
        p='0px'
        bg='blackAlpha.800'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        borderRadius={5}
      >
        <Flex direction='column' w={['100%', null, null, null, '30%']}>
          {renderPresets()}
        </Flex>
        <Flex
          direction='column'
          w={['100%', null, null, null, '70%']}
          borderLeftWidth='1px'
          borderColor='whiteAlpha.200'
        >
          {daoData?.currency ? (
            <Box mt={4} p={6}>
              <Flex direction='row' justify='space-between'>
                <Text
                  as='h2'
                  fontFamily='heading'
                  fontSize='2xl'
                  style={{ color: daoData.color }}
                >
                  Settings
                </Text>
                {/* <Button variant='outline' onClick={() => handleReset(true)}>
                  Reset to Default
                </Button> */}
              </Flex>
              <Text my={5}>{daoData.presetDescription}</Text>

              <Text>
                Primary Token: <strong>{daoData.currency}</strong>
              </Text>
              <Text>
                Proposal Velocty:{' '}
                <strong>{periodsPerDayPreset(daoData.periodDuration)}</strong>
              </Text>
              <Text>
                Voting Period:{' '}
                <strong>
                  {formatPeriodLength(
                    daoData.votingPeriod,
                    daoData.periodDuration,
                  )}
                </strong>
              </Text>
              <Text>
                Grace Period:{' '}
                <strong>
                  {formatPeriodLength(
                    daoData.gracePeriod,
                    daoData.periodDuration,
                  )}
                </strong>
              </Text>
              <Text>
                Proposal Deposit:{' '}
                <strong>{`${formatDepositWei(daoData.proposalDeposit)} ${
                  daoData.currency
                }`}</strong>
              </Text>
              <Text>
                Proposal Reward:{' '}
                <strong>{`${formatDepositWei(daoData.processingReward)} ${
                  daoData.currency
                }`}</strong>
              </Text>

              {multiSummoners ? (
                <Text>
                  Summoners and Shares. Enter one address and amount of shares
                  on each line, and include yourself. Separate address and
                  amount with a space. Be sure to include yourself as desired.
                  <Textarea
                    className='inline-field'
                    name='summonerAndShares'
                    placeholder={`${daoData.summoner} 1`}
                    onChange={(e) => handleMultiSummonerChange(e)}
                  />{' '}
                </Text>
              ) : null}
              <Button
                variant='outline'
                my={5}
                onClick={() => setMultiSummoners(!multiSummoners)}
              >
                {!multiSummoners ? 'Add Multiple Summoners' : 'Cancel'}
              </Button>
              <Box className='StepControl'>
                <Button onClick={() => handleSummon()} disabled={false}>
                  Summon
                </Button>
              </Box>
            </Box>
          ) : (
            <Box p={6}>Select a preset</Box>
          )}
        </Flex>
      </Box>

      {network.network === 'mainnet' ? (
        <Text mt={10}>
          Transaction fees got you down? Check our{' '}
          <Link to='https://daohaus.club/help#xDAI'>Quick Start Guide</Link> on
          how to switch to xDAI for cheaper, faster interactions for your
          community.
        </Text>
      ) : null}
    </Box>
  );
};

export default SummonSettings;
