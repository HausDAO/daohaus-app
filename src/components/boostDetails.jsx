import React, { useMemo } from 'react';
import { Button } from '@chakra-ui/button';
import Icon from '@chakra-ui/icon';
import { Box, Divider, Flex, Link } from '@chakra-ui/layout';
import { RiExternalLinkLine } from 'react-icons/ri';

import { BsArrowReturnRight } from 'react-icons/bs';
import { useParams } from 'react-router';
import { useFormModal } from '../contexts/OverlayContext';
import MemberIndicator from './memberIndicator';
import TextBox from './TextBox';
import TextIndicator from './textIndicator';

const BoostDetails = ({
  content = {},
  goToNext,
  next,
  userSteps,
  isAvailable,
}) => {
  const { closeModal } = useFormModal();
  const { daochain } = useParams();
  const {
    publisher = {},
    version,
    pars = [],
    externalLinks = [],
    header,
    title,
  } = content;
  const { name, daoData } = publisher;

  const handleNext = () => {
    if (next && goToNext) {
      goToNext(next);
    } else {
      closeModal();
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
        <TextIndicator
          label='Network'
          value={isAvailable ? 'Available' : 'Not Available'}
          size='sm'
          mb={3}
        />
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
      {userSteps?.length > 0 && (
        <UserStepIndicator userSteps={userSteps} label='Install Steps' />
      )}
      <Box>
        <Flex alignItems='flex-end' flexDir='column'>
          <Flex mb={2}>
            <Button onClick={handleNext} loadingText='Submitting'>
              {goToNext && next ? 'Next >' : 'Close'}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

const UserStepIndicator = ({ userSteps, label }) => {
  return (
    <>
      <Divider mb={4} />
      <Flex mb={4} flexDir='column'>
        <TextBox size='sm' mb={2}>
          {label}
        </TextBox>
        {userSteps?.map(({ stepLabel }) => (
          <Flex key={stepLabel} mb={2}>
            <Icon
              as={BsArrowReturnRight}
              h='20px'
              w='20px'
              // transform='translateY(1px)'
              mr={2}
            />
            <TextBox size='sm' variant='body'>
              {stepLabel}
            </TextBox>
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default BoostDetails;
