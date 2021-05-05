import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Flex,
  Box,
  Skeleton,
  Text,
  Avatar,
  Icon,
  useToast,
} from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';
import { FaCopy } from 'react-icons/fa';

import { useDao } from '../contexts/DaoContext';
import TextBox from './TextBox';
import { themeImagePath } from '../utils/metadata';

//  For QA.
//  This won't be refactored until we know the specs of
//  an UberHaus proposal.

const UberDaoInfo = ({ proposal }) => {
  const { daoMembers } = useDao();
  const toast = useToast();
  const [daoMinion, setDaoMinion] = useState(null);

  useEffect(() => {
    if (!daoMembers && !proposal) return;
    const minion = daoMembers.find(
      member =>
        member.memberAddress === proposal?.proposer ||
        member.delegateKey === proposal?.proposer,
    );
    if (minion?.isUberMinion) {
      setDaoMinion(minion);
    } else {
      setDaoMinion(false);
    }
  }, [proposal, daoMembers]);

  const copiedToast = () => {
    toast({
      title: 'Copied Address',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box key={proposal?.proposalType}>
      {daoMinion?.isUberMinion && (
        <TextBox size='xs' mb={2}>
          DAO
        </TextBox>
      )}
      <Skeleton isLoaded={proposal}>
        {daoMinion?.isUberMinion && (
          <Flex direction='row' alignItems='center'>
            <Avatar
              name={daoMinion?.uberMeta?.name}
              src={
                daoMinion?.uberMeta?.avatarImg
                  ? themeImagePath(daoMinion?.uberMeta?.avatarImg)
                  : makeBlockie(daoMinion?.uberMinion?.molochAddress)
              }
              size='sm'
            />
            <Flex>
              <Text fontSize='sm' fontFamily='heading' ml={3}>
                {daoMinion?.uberMeta?.name}
              </Text>
              <CopyToClipboard
                text={daoMinion.uberMinion.molochAddress}
                mr={4}
                onCopy={copiedToast}
              >
                <Icon
                  transform='translateY(2px)'
                  as={FaCopy}
                  color='secondary.300'
                  ml={2}
                  _hover={{ cursor: 'pointer' }}
                />
              </CopyToClipboard>
            </Flex>
          </Flex>
        )}
      </Skeleton>
    </Box>
  );
};

export default UberDaoInfo;
