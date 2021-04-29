import React, { useEffect, useState } from 'react';
import {
  Flex, Text, Box, Button,
} from '@chakra-ui/react';
import { useParams } from 'react-router';
import TextBox from './TextBox';
import { fetchNativeBalance } from '../utils/tokenExplorerApi';
import GenericModal from '../modals/genericModal';

const MinionNativeToken = ({ action }) => {
  const [nativeBalance, setNativeBalance] = useState();
  const { daochain, daoid, minion } = useParams();

  const handleClick = () => {
    action.sendNativeToken();
  };
  useEffect(() => {
    const getContractBalance = async () => {
      try {
        const native = await fetchNativeBalance(minion, daochain);
        setNativeBalance(native.result / 10 ** 18);
      } catch (err) {
        console.log(err);
      }
    };
    getContractBalance();
  }, [minion]);
  return (
    <Box>
      <TextBox size='md' align='center'>
        balance:
        {' '}
        {nativeBalance}
        <Button onClick={handleClick}>Send</Button>
      </TextBox>
      <GenericModal closeOnOverlayClick modalId='nativeTokenSend' />
    </Box>
  );
};

export default MinionNativeToken;
