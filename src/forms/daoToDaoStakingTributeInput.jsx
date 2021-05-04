import {
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  Tooltip,
  Icon,
} from '@chakra-ui/react';
import { RiInformationLine } from 'react-icons/ri';
import { utils } from 'web3';

import React, { useState, useEffect } from 'react';
import TextBox from '../components/TextBox';
import { useDao } from '../contexts/DaoContext';
import { UBERHAUS_DATA } from '../utils/uberhaus';

const DaoToDaoStakingTributeInput = ({ register, setValue, stakingToken }) => {
  const [balance, setBalance] = useState(0);
  const [tokenData, setTokenData] = useState([]);
  const { daoOverview } = useDao();

  useEffect(() => {
    if (daoOverview && !tokenData.length) {
      const depositTokenAddress = daoOverview.depositToken?.tokenAddress;
      const depositToken = daoOverview.tokenBalances?.find(
        token =>
          token.guildBank && token.token.tokenAddress === depositTokenAddress,
      );
      const tokenArray = daoOverview.tokenBalances.filter(
        token =>
          token.guildBank && token.token.tokenAddress !== depositTokenAddress,
      );

      tokenArray.unshift(depositToken);
      setTokenData(
        tokenArray.map(token => ({
          label: token.token.symbol || token.tokenAddress,
          value: token.token.tokenAddress,
          decimals: token.token.decimals,
          balance: token.tokenBalance,
        })),
      );
    }
  }, [daoOverview]);

  const getMax = async () => {
    const max = stakingToken.balance;
    setBalance(max);
  };

  useEffect(() => {
    if (stakingToken) {
      getMax();
    }
  }, [stakingToken]);

  const handleChange = async () => {
    await getMax();
    return true;
  };

  const setMax = async () => {
    setValue(
      'tributeOffered',
      stakingToken.balance / 10 ** stakingToken.decimals,
    );
    handleChange();
  };

  const noWhitelistOrBalance = !stakingToken || !stakingToken.balance;

  return (
    <>
      <Tooltip
        hasArrow
        shouldWrapChildren
        label='DAOs must stake HAUS to join UberHAUS. Your UberHAUS minion will need to have HAUS before this proposal can be executed.'
        placement='top'
      >
        <TextBox as={FormLabel} size='xs' d='flex' alignItems='center'>
          Token Tribute
          <Icon as={RiInformationLine} ml={2} />
        </TextBox>
      </Tooltip>
      <InputGroup>
        <Button
          onClick={() => setMax()}
          size='xs'
          variant='outline'
          position='absolute'
          right='0'
          top='-30px'
          disabled={noWhitelistOrBalance}
        >
          {`Max: ${balance && parseFloat(utils.fromWei(balance)).toFixed(4)}`}
        </Button>
        <Input
          name='tributeOffered'
          placeholder='0'
          mb={5}
          ref={register({
            validate: {
              inefficienFunds: value => {
                if (+value > +utils.fromWei(balance)) {
                  return 'Insufficient Funds';
                }
                return true;
              },
            },
            pattern: {
              value: /[0-9]/,
              message: 'Tribute must be a number',
            },
          })}
          color='white'
          focusBorderColor='secondary.500'
          onChange={handleChange}
          disabled={noWhitelistOrBalance}
        />
        <InputRightAddon background='primary.500' p={2}>
          {UBERHAUS_DATA.STAKING_TOKEN_SYMBOL}
        </InputRightAddon>
      </InputGroup>
      {noWhitelistOrBalance ? (
        <Text my={2} size='sm'>
          send haus to
        </Text>
      ) : null}
    </>
  );
};

export default DaoToDaoStakingTributeInput;
