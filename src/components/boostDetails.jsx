import { Button } from '@chakra-ui/button';
import Icon from '@chakra-ui/icon';
import { Box, Flex, Link } from '@chakra-ui/layout';
import React from 'react';
import { RiExternalLinkLine } from 'react-icons/ri';
import { useFormModal } from '../contexts/OverlayContext';
import MemberIndicator from './memberIndicator';
import TextBox from './TextBox';

import TextIndicator from './textIndicator';

const BoostDetails = ({ content = {}, goToNext, next }) => {
  const { closeModal } = useFormModal();
  const {
    publisher = {},
    version,
    pars = [],
    externalLinks = [],
    header,
    title,
  } = content;
  const { name, daoData } = publisher;
  const handleGoTo = () => {
    if (typeof next === 'string') {
      goToNext(next);
    }
  };
  return (
    <Flex flexDirection='column'>
      <TextBox mb={6} size='lg'>
        {header || title}
      </TextBox>
      <Flex justifyContent='space-between' flexWrap='wrap'>
        <MemberIndicator
          link={`/dao/${daoData?.network}/${daoData?.address}`}
          label='Publisher'
          name={name}
          layoutProps={{ mb: '6' }}
          address={daoData?.address}
          shouldFetchProfile={false}
          onClick={closeModal}
        />
        <TextIndicator label='Network' value='Available' size='sm' mb={3} />
        <TextIndicator
          label='Version'
          value={version}
          size='sm'
          mb={3}
          numString
        />
      </Flex>
      <Flex flexDirection='column'>
        {pars?.length > 0 && (
          <Box mb={3}>
            {pars.map((par, index) => (
              <TextBox
                variant='body'
                mb={3}
                size='sm'
                key={`boostDetailsPar-${index}`}
              >
                {par}
              </TextBox>
            ))}
          </Box>
        )}
        {externalLinks?.length > 0 && (
          <Box mb={6}>
            {externalLinks.map(link => (
              <Box key={link.href} mb={3}>
                <Link href={link.href} isExternal>
                  <Flex>
                    <TextBox type='body' size='xs' color='secondary.400' mr={2}>
                      {link.label}
                    </TextBox>
                    <Icon as={RiExternalLinkLine} name='external link' />
                  </Flex>
                </Link>
              </Box>
            ))}
          </Box>
        )}
      </Flex>
      <Box>
        <Flex alignItems='flex-end' flexDir='column'>
          <Flex mb={2}>
            <Button onClick={handleGoTo} loadingText='Submitting'>
              Install
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default BoostDetails;
