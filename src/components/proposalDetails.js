import React, { useEffect, useState } from 'react';
import { utils } from 'web3';
import {
  Flex,
  Box,
  Skeleton,
  Badge,
  Text,
  Image,
  Link,
  Icon,
} from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { AddressZero } from '@ethersproject/constants';

import TextBox from '../components/TextBox';
import ContentBox from '../components/ContentBox';
import UserAvatar from '../components/userAvatar';

import {
  getProposalCountdownText,
  getProposalDetailStatus,
  memberVote,
} from '../utils/proposalUtils';
import { handleGetProfile } from '../utils/3box';
import { numberWithCommas } from '../utils/general';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const urlify = (text) => {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
    return (
      '<a rel="noopener noreferrer" target="_blank" href="' +
      url +
      '"> link </a>'
    );
  });
};

const hasImage = (string) => {
  const imageExtensions = ['.jpg', '.png', '.gif'];
  return imageExtensions.some((o) => string.includes(o));
};

const ProposalDetails = ({ proposal }) => {
  const [proposer, setProposer] = useState(null);
  const [applicant, setApplicant] = useState(null);
  const { address } = useInjectedProvider();

  useEffect(async () => {
    if (proposal) {
      const proposerProfile = await handleGetProfile(proposal.proposer);
      const applicantProfile = await handleGetProfile(
        proposal?.applicant !== AddressZero
          ? proposal.applicant
          : proposal.proposer,
      );
      setProposer({
        memberAddress: proposal.proposer,
        ...proposerProfile,
      });
      if (proposal.applicant !== AddressZero) {
        setApplicant({
          memberAddress: proposal.applicant,
          ...applicantProfile,
        });
      } else {
        setApplicant({
          memberAddress: proposal.proposer,
          ...applicantProfile,
        });
      }
    }
  }, [proposal]);

  return (
    <Box pt={6}>
      <ContentBox>
        <Box>
          <Box>
            <Flex justify='space-between'>
              <TextBox size='xs'>{proposal?.proposalType}</TextBox>

              <Box>
                {proposal?.proposalIndex ? (
                  <>
                    {proposal?.status
                      ? getProposalDetailStatus(proposal)
                      : '--'}
                  </>
                ) : (
                  <>
                    <Skeleton isLoaded={proposal?.status}>
                      <Badge>
                        {proposal?.status
                          ? getProposalCountdownText(proposal)
                          : '--'}
                      </Badge>
                    </Skeleton>
                  </>
                )}
              </Box>
            </Flex>

            <Skeleton isLoaded={proposal?.title || proposal?.minionAddress}>
              {proposal?.title ? (
                <Text fontSize='3xl'>{proposal?.title}</Text>
              ) : proposal?.minionAddress ? null : (
                '-'
              )}
            </Skeleton>
          </Box>

          {proposal?.minionAddress ? (
            // <ProposalMinionCard proposal={proposal} />
            <Box>Minion Details</Box>
          ) : (
            <Skeleton isLoaded={proposal?.description}>
              {proposal?.description ? (
                proposal?.description.indexOf('http') > -1 ? (
                  <Box
                    w='100%'
                    dangerouslySetInnerHTML={{
                      __html: urlify(proposal?.description),
                    }}
                  />
                ) : (
                  <Box w='100%'>{proposal?.description}</Box>
                )
              ) : null}
            </Skeleton>
          )}
          <Box mt={proposal?.link || proposal?.minionAddress ? 6 : 2}>
            {proposal?.link &&
            !ReactPlayer.canPlay(proposal?.link) &&
            !hasImage(proposal?.link) ? (
              <TextBox size='xs'>Link</TextBox>
            ) : null}
            {proposal?.link !== '' && (
              <Skeleton isLoaded={proposal?.link || proposal?.minionAddress}>
                {proposal?.link ? (
                  proposal?.link ? (
                    ReactPlayer.canPlay(proposal?.link) ? (
                      <Box width='100%'>
                        <ReactPlayer
                          url={proposal?.link}
                          playing={false}
                          loop={false}
                          width='100%'
                        />
                      </Box>
                    ) : hasImage(proposal?.link) ? (
                      <Image
                        src={`https://${proposal?.link}`}
                        maxW='100%'
                        margin='0 auto'
                        alt='link image'
                      />
                    ) : (
                      <Link href={`https://${proposal?.link}`} target='_blank'>
                        {proposal?.link ? proposal?.link : '-'}{' '}
                        <Icon as={RiExternalLinkLine} color='primary.50' />
                      </Link>
                    )
                  ) : null
                ) : proposal?.minionAddress ? null : (
                  '--'
                )}
              </Skeleton>
            )}
          </Box>
        </Box>
        <Flex w='100%' justify='space-between' mt={6}>
          {(proposal?.tributeOffered > 0 || !proposal?.tributeOffered) && (
            <Box>
              <TextBox size='xs'>Tribute</TextBox>
              <Skeleton isLoaded={proposal?.tributeOffered}>
                <TextBox size='lg' variant='value'>
                  {proposal?.tributeOffered
                    ? `${numberWithCommas(
                        utils.fromWei(proposal.tributeOffered.toString()),
                      )} ${proposal.tributeTokenSymbol || 'WETH'}`
                    : '--'}
                </TextBox>
              </Skeleton>
            </Box>
          )}
          {proposal?.paymentRequested > 0 && ( // don't show during loading
            <Box>
              <TextBox size='xs'>Payment Requested</TextBox>
              <Skeleton isLoaded={proposal?.paymentRequested}>
                <TextBox size='lg' variant='value'>
                  {proposal?.paymentRequested
                    ? `${numberWithCommas(
                        utils.fromWei(proposal.paymentRequested.toString()),
                      )} ${proposal.paymentTokenSymbol || 'WETH'}`
                    : '--'}
                </TextBox>
              </Skeleton>
            </Box>
          )}
          {(proposal?.sharesRequested > 0 || !proposal?.sharesRequested) && (
            <Box>
              <TextBox size='xs'>Shares</TextBox>
              <Skeleton isLoaded={proposal?.sharesRequested}>
                <TextBox size='lg' variant='value'>
                  {proposal?.sharesRequested
                    ? numberWithCommas(proposal.sharesRequested)
                    : '--'}
                </TextBox>
              </Skeleton>
            </Box>
          )}
          {proposal?.lootRequested > 0 && ( // don't show during loading
            <Box>
              <TextBox size='xs'>Loot</TextBox>
              <Skeleton isLoaded={proposal?.lootRequested}>
                <TextBox size='lg' variant='value'>
                  {proposal?.lootRequested
                    ? numberWithCommas(proposal.lootRequested)
                    : '--'}
                </TextBox>
              </Skeleton>
            </Box>
          )}
        </Flex>
        <Flex
          mt={6}
          justify='space-between'
          direction={['column', 'row']}
          pr={memberVote(proposal, address) !== null && '5%'}
          w='100%'
        >
          <Box>
            <TextBox size='xs' mb={2}>
              Submitted By
            </TextBox>
            <Skeleton isLoaded={proposer}>
              {proposer ? <UserAvatar user={proposer} /> : '--'}
            </Skeleton>
          </Box>
          <Box>
            <TextBox size='xs' mb={2}>
              Recipient
            </TextBox>
            <Skeleton isLoaded={applicant}>
              {applicant ? <UserAvatar user={applicant} /> : '--'}
            </Skeleton>
          </Box>
          <Flex align='center'>
            {memberVote(proposal, address) !== null &&
              (+memberVote(proposal, address) === 1 ? (
                <Flex
                  pl={6}
                  w='40px'
                  borderColor='secondary.500'
                  borderWidth='2px'
                  borderStyle='solid'
                  borderRadius='40px'
                  p={1}
                  h='40px'
                  justify='center'
                  align='center'
                  m='0 auto'
                >
                  <Icon as={FaThumbsUp} color='secondary.500' />
                </Flex>
              ) : (
                <Flex
                  pl={6}
                  w='40px'
                  borderColor='secondary.500'
                  borderWidth='2px'
                  borderStyle='solid'
                  borderRadius='40px'
                  p={1}
                  h='40px'
                  justify='center'
                  align='center'
                  m='0 auto'
                >
                  <Icon as={FaThumbsDown} color='secondary.500' />
                </Flex>
              ))}
          </Flex>
        </Flex>
      </ContentBox>
    </Box>
  );
};

export default ProposalDetails;
