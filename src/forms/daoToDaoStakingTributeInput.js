import {
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Tooltip,
} from '@chakra-ui/react';
import { RiInformationLine } from 'react-icons/ri';
import { utils } from 'web3';

import React, { useState, useEffect } from 'react';
import TextBox from '../components/TextBox';
import { useDao } from '../contexts/DaoContext';
import { UBERHAUS_STAKING_TOKEN_SYMBOL } from '../utils/uberhaus';

const DaoToDaoStakingTributeInput = ({ register, setValue, stakingToken }) => {
  const [balance, setBalance] = useState(0);
  const [tokenData, setTokenData] = useState([]);
  const { daoOverview } = useDao();

  useEffect(() => {
    if (daoOverview && !tokenData.length) {
      const depositTokenAddress = daoOverview.depositToken?.tokenAddress;
      const depositToken = daoOverview.tokenBalances?.find(
        (token) =>
          token.guildBank && token.token.tokenAddress === depositTokenAddress,
      );
      const tokenArray = daoOverview.tokenBalances.filter(
        (token) =>
          token.guildBank && token.token.tokenAddress !== depositTokenAddress,
      );

      tokenArray.unshift(depositToken);
      setTokenData(
        tokenArray.map((token) => ({
          label: token.token.symbol || token.tokenAddress,
          value: token.token.tokenAddress,
          decimals: token.token.decimals,
          balance: token.tokenBalance,
        })),
      );
    }
  }, [daoOverview]);

  useEffect(() => {
    if (stakingToken) {
      getMax();
    }
  }, [stakingToken]);

  const handleChange = async () => {
    await getMax();
    return true;
  };

  const getMax = async () => {
    const max = stakingToken.balance;
    setBalance(max);
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
        label='Only tokens approved by the DAO are allowed here. Members can add more approved tokens with Token proposals'
        placement='top'
      >
        <TextBox as={FormLabel} size='xs' d='flex' alignItems='center'>
          Token Tribute <RiInformationLine style={{ marginLeft: 5 }} />
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
          Max: {balance && parseFloat(utils.fromWei(balance)).toFixed(4)}
        </Button>
        <Input
          name='tributeOffered'
          placeholder='0'
          mb={5}
          ref={register({
            validate: {
              inefficienFunds: (value) => {
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
          {UBERHAUS_STAKING_TOKEN_SYMBOL}
        </InputRightAddon>
      </InputGroup>
    </>
  );
};

export default DaoToDaoStakingTributeInput;
