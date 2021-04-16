import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Text,
  Icon,
  Spinner,
  Stack,
  Link,
} from '@chakra-ui/react';
import {
  RiExternalLinkLine,
  RiErrorWarningLine,
  RiCheckLine,
} from 'react-icons/ri';
import ContentBox from './ContentBox';

import TextBox from './TextBox';
import { POPUP_CONTENT } from '../content/pending-tx-modal';
import { supportedChains } from '../utils/chain';

const SummonPending = ({ txHash, success, chainId, isUberHaus = false }) => {
  const { daoid, daochain } = useParams();
  return (
    <ContentBox
      m={[10, 'auto', 0, 'auto']}
      w={['100%', null, null, '600px']}
      textAlign='center'
    >
      <Box fontSize='xl' fontFamily='heading' fontWeight={700} mb={10}>
        {POPUP_CONTENT.summonMoloch.header}
      </Box>
      {txHash && !success ? (
        <Flex direction='column' align='center' my={6}>
          <Spinner size='xl' color='secondary.500' />
          <Text fontSize='xs' pt={3}>
            DAO is in the forge ...
          </Text>
        </Flex>
      ) : null}
      {!txHash && (
        <Text my={6}>Check your wallet for a transaction to confirm</Text>
      )}
      {txHash && success ? (
        <Flex align='center' direction='column' w='100%' my={6}>
          <Box
            borderColor='secondary.500'
            style={{
              width: '48px',
              height: '48px',
              padding: '6px',
              borderRadius: '50%',
              border: '2px solid',
            }}
          >
            <RiCheckLine
              style={{
                width: '36px',
                height: '36px',
                color: 'white',
              }}
            />
          </Box>
          <Text fontSize='xs' pt={3}>
            Confirmed
          </Text>
        </Flex>
      ) : null}

      {txHash ? (
        <Link
          href={`${supportedChains[chainId].block_explorer}/tx/${txHash}`}
          isExternal
          color='secondary.500'
          fontSize={['xs', null, null, 'sm']}
          fontWeight={600}
          textAlign='center'
        >
          <Box>{`${success ? 'View' : 'Watch'} Transaction`}</Box>
          <Icon as={RiExternalLinkLine} ml={2} />
        </Link>
      ) : null}

      {txHash && success ? (
        <Box my={6}>
          <Box fontSize='xl' fontFamily='heading' fontWeight={700}>
            {POPUP_CONTENT.summonMoloch.successText}
          </Box>
          <Button
            as={RouterLink}
            to={`/register/${chainId}/${success}${
              isUberHaus ? `?parentDao=${daoid}&parentChainId=${daochain}` : ''
            }`}
            mt={3}
          >
            CONFIGURE DAO
          </Button>
        </Box>
      ) : null}

      {txHash && !success && (
        <Box w='100%'>
          <Flex direction='column' maxW='300px' m='0 auto' justify='center'>
            {POPUP_CONTENT.summonMoloch.bodyText.map((text, idx) => (
              <Box
                fontSize={['xs', null, null, 'sm']}
                mt={5}
                fontWeight={400}
                key={idx}
                textAlign='left'
              >
                {text}
              </Box>
            ))}

            <Stack spacing={3} mt={5}>
              {POPUP_CONTENT.summonMoloch.links.map((link, idx) =>
                link.external ? (
                  <TextBox as={Link} key={idx} href={link.href}>
                    {link.text}
                    <Icon as={RiExternalLinkLine} ml={1} />
                  </TextBox>
                ) : (
                  <TextBox as={RouterLink} key={idx} to={link.href}>
                    {link.text}
                    <Icon as={RiErrorWarningLine} ml={1} />
                  </TextBox>
                ),
              )}
            </Stack>
            {!isUberHaus ? (
              <>
                <Box fontSize='xs' textAlign='left'>
                  {POPUP_CONTENT.summonMoloch.waitingText}
                </Box>
                <Button variant='outline' as={RouterLink} to='/' mt={5}>
                  GO TO HUB
                </Button>
              </>
            ) : null}
          </Flex>
        </Box>
      )}
    </ContentBox>
  );
};

export default SummonPending;
