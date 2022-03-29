import React, { useEffect, useState } from 'react';
import { Avatar, Text, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ethers, BigNumber, FixedNumber } from 'ethers';
import hausImg from '../assets/img/haus_icon.svg';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { fetchBalance } from '../utils/tokenValue';

const HausBalance = () => {
  const { address } = useInjectedProvider();
  const [balance, setBalance] = useState('0');
  const round = value => {
    return FixedNumber.fromString(ethers.utils.formatUnits(value), 18)
      .round(2)
      .toString();
  };

  useEffect(() => {
    const setUpBalance = async () => {
      const tokenAddress = '0xb0c5f3100a4d9d9532a4cfd68c55f1ae8da987eb';
      const gnosisBalance = await fetchBalance({
        address,
        chainID: '0x64',
        tokenAddress,
      });
      const mainnetBalance = await fetchBalance({
        address,
        chainID: '0x1',
        tokenAddress: '0xf2051511b9b121394fa75b8f7d4e7424337af687',
      });

      setBalance(
        round(
          BigNumber.from(gnosisBalance).add(BigNumber.from(mainnetBalance)),
        ),
      );
    };

    if (address) {
      setUpBalance();
    }
  }, [address]);

  return (
    <Link to='/haus'>
      <Flex
        background='#1A84DD'
        height='42px'
        justifyContent='center'
        alignItems='center'
        mr='38px'
        padding='11px'
        borderRadius='2px'
      >
        <Avatar name='Haus logo' src={hausImg} size='sm' />
        <Text fontSize='sm' fontFamily='Roboto Mono' ml={3}>
          {balance} Haus
        </Text>
      </Flex>
    </Link>
  );
};

export default HausBalance;
