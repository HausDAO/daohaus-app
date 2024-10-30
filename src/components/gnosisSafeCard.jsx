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
  minionDetails,
  safeDetails,
  targetChain,
  title = 'Gnosis Safe',
  vaultAddress,
  zodiacModules,
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
      {zodiacModules?.length && (
        <Box>
          <Text>Modules</Text>
          {zodiacModules.map(module => (
            <Flex direction='row' align='center' key={module} ml={2}>
              <Text fontWeight='bold'>{`- ${module.name}`}</Text>
              {module.address ? (
                <Link
                  href={`${chainConfig.block_explorer}/address/${module.address}`}
                  isExternal
                  ml={2}
                >
                  <Icon
                    as={RiExternalLinkLine}
                    name='explorer link'
                    color='secondary.300'
                    _hover={{ cursor: 'pointer' }}
                  />
                </Link>
              ) : (
                <Text size='xs'>
                  : (Pend. Approval
                  <Link
                    href={`https://gnosis-safe.io/app/${chainConfig.shortNamePrefix ||
                      chainConfig.short_name}:${
                      safeDetails.address
                    }/transactions/queue`}
                    isExternal
                  >
                    <Icon
                      as={RiExternalLinkLine}
                      name='explorer link'
                      color='secondary.300'
                      _hover={{ cursor: 'pointer' }}
                      ml={2}
                    />
                  </Link>
                  )
                </Text>
              )}
            </Flex>
          ))}
        </Box>
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
      {minionDetails}
    </Flex>
  );
};

export default GnosisSafeCard;
