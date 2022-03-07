import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useParams } from 'react-router-dom';
import { FaCopy } from 'react-icons/fa';
import { RiExternalLinkLine } from 'react-icons/ri';
import Icon from '@chakra-ui/icon';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { Link } from '@chakra-ui/react';

import StaticAvatar from './staticAvatar';
import { truncateAddr } from '../utils/general';
import { chainByID } from '../utils/chain';

const GnosisSafeCard = ({
  actionDetails,
  handleCopy,
  safeDetails,
  targetChain,
  title = 'Gnosis Safe',
  vaultAddress,
}) => {
  const { daochain } = useParams();
  const chainConfig = chainByID(targetChain || daochain);

  return (
    <Flex flex='1 1 0%' display='block'>
      <Text fontWeight='bold'>{title}</Text>
      <Flex mt={4} mb={4}>
        <StaticAvatar address={safeDetails.address} />
        <Link
          href={`https://gnosis-safe.io/app/${chainConfig.shortNamePrefix ||
            chainConfig.short_name}:${safeDetails.address}`}
          isExternal
        >
          <Icon
            as={RiExternalLinkLine}
            name='explorer link'
            color='secondary.300'
            _hover={{ cursor: 'pointer' }}
          />
        </Link>
      </Flex>
      <Text>Signers Threshold</Text>
      <Text fontWeight='bold'>
        {safeDetails.threshold}/{safeDetails.owners.length}
      </Text>
      {targetChain && (
        <>
          <Text>Network</Text>
          <Text fontWeight='bold'>{`${chainConfig.name}`}</Text>
        </>
      )}
      {vaultAddress && (
        <Box fontFamily='mono'>
          Minion Address (Do Not Send Funds)
          <CopyToClipboard text={vaultAddress} onCopy={handleCopy}>
            <Box color='secondary.300'>
              {truncateAddr(vaultAddress)}
              <Icon
                as={FaCopy}
                color='secondary.300'
                ml={2}
                _hover={{ cursor: 'pointer' }}
              />
            </Box>
          </CopyToClipboard>
        </Box>
      )}
      {actionDetails}
    </Flex>
  );
};

export default GnosisSafeCard;
