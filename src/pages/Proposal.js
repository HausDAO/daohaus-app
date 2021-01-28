import React from 'react';
import { useParams } from 'react-router-dom';
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
import ActivitiesFeed from '../components/activitiesFeed';
import { getProposalHistories } from '../utils/activities';
import { RiExternalLinkLine } from 'react-icons/ri';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import ReactPlayer from 'react-player';

import { numberWithCommas } from '../utils/general';
import TextBox from '../components/TextBox';
import ContentBox from '../components/ContentBox';
// import ProposalVote from '../components/proposalVote';

import {
  getProposalCountdownText,
  getProposalDetailStatus,
} from '../utils/proposalUtils';

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

// const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const hasImage = (string) => {
  const imageExtensions = ['.jpg', '.png', '.gif'];
  return imageExtensions.some((o) => string.includes(o));
};

const Proposal = ({ activities }) => {
  const { propid } = useParams();
  const currentProposal = activities
    ? activities?.proposals?.find((proposal) => proposal.proposalId === propid)
    : null;

  const memberVote = currentProposal
    ? currentProposal?.votes?.find(
        (vote) =>
          vote.memberAddress === currentProposal.memberAddress.toLowerCase(),
      )
    : null;

  return (
    <Box>
      <Flex wrap='wrap'>
        <Flex
          direction='column'
          w={['100%', null, null, null, '60%']}
          pr={[0, null, null, null, 6]}
        >
          <Box pt={6}>
            <ContentBox>
              <Box>
                <Box>
                  <Flex justify='space-between'>
                    <TextBox size='xs'>{currentProposal.proposalType}</TextBox>

                    <Box>
                      {currentProposal?.proposalIndex ? (
                        <>
                          {currentProposal?.status
                            ? getProposalDetailStatus(currentProposal)
                            : '--'}
                        </>
                      ) : (
                        <>
                          <Skeleton isLoaded={currentProposal?.status}>
                            <Badge>
                              {currentProposal?.status
                                ? getProposalCountdownText(currentProposal)
                                : '--'}
                            </Badge>
                          </Skeleton>
                        </>
                      )}
                    </Box>
                  </Flex>

                  <Skeleton
                    isLoaded={
                      currentProposal?.title || currentProposal?.minionAddress
                    }
                  >
                    {currentProposal?.title ? (
                      <Text fontSize='3xl'>{currentProposal?.title}</Text>
                    ) : currentProposal?.minionAddress ? null : (
                      '-'
                    )}
                  </Skeleton>
                </Box>

                {currentProposal?.minionAddress ? (
                  // <ProposalMinionCard proposal={proposal} />
                  <Box>Minion Details</Box>
                ) : (
                  <Skeleton isLoaded={currentProposal?.description}>
                    {currentProposal?.description ? (
                      currentProposal?.description.indexOf('http') > -1 ? (
                        <Box
                          w='100%'
                          dangerouslySetInnerHTML={{
                            __html: urlify(currentProposal?.description),
                          }}
                        />
                      ) : (
                        <Box w='100%'>{currentProposal?.description}</Box>
                      )
                    ) : null}
                  </Skeleton>
                )}
                <Box
                  mt={
                    currentProposal?.link || currentProposal?.minionAddress
                      ? 6
                      : 2
                  }
                >
                  {currentProposal?.link &&
                  !ReactPlayer.canPlay(currentProposal?.link) &&
                  !hasImage(currentProposal?.link) ? (
                    <TextBox size='xs'>Link</TextBox>
                  ) : null}
                  <Skeleton
                    isLoaded={
                      currentProposal?.link || currentProposal?.minionAddress
                    }
                  >
                    {currentProposal?.link ? (
                      currentProposal?.link ? (
                        ReactPlayer.canPlay(currentProposal?.link) ? (
                          <Box width='100%'>
                            <ReactPlayer
                              url={currentProposal?.link}
                              playing={false}
                              loop={false}
                              width='100%'
                            />
                          </Box>
                        ) : hasImage(currentProposal?.link) ? (
                          <Image
                            src={`https://${currentProposal?.link}`}
                            maxW='100%'
                            margin='0 auto'
                            alt='link image'
                          />
                        ) : (
                          <Link
                            href={`https://${currentProposal?.link}`}
                            target='_blank'
                          >
                            {currentProposal?.link
                              ? currentProposal?.link
                              : '-'}{' '}
                            <Icon as={RiExternalLinkLine} color='primary.50' />
                          </Link>
                        )
                      ) : null
                    ) : currentProposal?.minionAddress ? null : (
                      '--'
                    )}
                  </Skeleton>
                </Box>
              </Box>
              <Flex w='100%' justify='space-between' mt={6}>
                {(currentProposal?.tributeOffered > 0 ||
                  !currentProposal?.tributeOffered) && (
                  <Box>
                    <TextBox size='xs'>Tribute</TextBox>
                    <Skeleton isLoaded={currentProposal?.tributeOffered}>
                      <TextBox size='lg' variant='value'>
                        {currentProposal?.tributeOffered
                          ? `${numberWithCommas(
                              utils.fromWei(
                                currentProposal.tributeOffered.toString(),
                              ),
                            )} ${currentProposal.tributeTokenSymbol || 'WETH'}`
                          : '--'}
                      </TextBox>
                    </Skeleton>
                  </Box>
                )}
                {currentProposal?.paymentRequested > 0 && ( // don't show during loading
                  <Box>
                    <TextBox size='xs'>Payment Requested</TextBox>
                    <Skeleton isLoaded={currentProposal?.paymentRequested}>
                      <TextBox size='lg' variant='value'>
                        {currentProposal?.paymentRequested
                          ? `${numberWithCommas(
                              utils.fromWei(
                                currentProposal.paymentRequested.toString(),
                              ),
                            )} ${currentProposal.paymentTokenSymbol || 'WETH'}`
                          : '--'}
                      </TextBox>
                    </Skeleton>
                  </Box>
                )}
                {(currentProposal?.sharesRequested > 0 ||
                  !currentProposal?.sharesRequested) && (
                  <Box>
                    <TextBox size='xs'>Shares</TextBox>
                    <Skeleton isLoaded={currentProposal?.sharesRequested}>
                      <TextBox size='lg' variant='value'>
                        {currentProposal?.sharesRequested
                          ? numberWithCommas(currentProposal.sharesRequested)
                          : '--'}
                      </TextBox>
                    </Skeleton>
                  </Box>
                )}
                {currentProposal?.lootRequested > 0 && ( // don't show during loading
                  <Box>
                    <TextBox size='xs'>Loot</TextBox>
                    <Skeleton isLoaded={currentProposal?.lootRequested}>
                      <TextBox size='lg' variant='value'>
                        {currentProposal?.lootRequested
                          ? numberWithCommas(currentProposal.lootRequested)
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
                pr={!memberVote && '20%'}
                w='100%'
              >
                <Box>
                  <TextBox size='xs' mb={2}>
                    Submitted By
                  </TextBox>
                  <Skeleton isLoaded={currentProposal?.proposer}>
                    {currentProposal?.proposer ? (
                      // memberProfile(members, proposal?.proposer).profile ? (
                      //   <MemberAvatar
                      //     member={memberProfile(members, proposal?.proposer)}
                      //   />
                      // ) : (
                      //   <UserAvatar
                      //     user={memberProfile(members, proposal?.proposer)}
                      //   />
                      // )
                      <Box>{currentProposal?.proposer}</Box>
                    ) : (
                      '--'
                    )}
                  </Skeleton>
                </Box>
                <Box>
                  <TextBox size='xs' mb={2}>
                    Recipient
                  </TextBox>
                  <Skeleton isLoaded={currentProposal?.applicant}>
                    {currentProposal?.applicant ? (
                      // memberProfile(
                      //   members,
                      //   currentProposal?.applicant !== ZERO_ADDRESS
                      //     ? currentProposal?.applicant
                      //     : currentProposal?.proposer,
                      // ).profile ? (
                      //   <MemberAvatar
                      //     member={memberProfile(
                      //       members,
                      //       currentProposal?.applicant !== ZERO_ADDRESS
                      //         ? currentProposal?.applicant
                      //         : currentProposal?.proposer,
                      //     )}
                      //   />
                      // ) : (
                      //   <UserAvatar
                      //     user={memberProfile(
                      //       members,
                      //       proposal?.applicant !== ZERO_ADDRESS
                      //         ? proposal?.applicant
                      //         : proposal?.proposer,
                      //     )}
                      //   />
                      // )
                      <Box>{currentProposal?.applicant}</Box>
                    ) : (
                      '--'
                    )}
                  </Skeleton>
                </Box>
                <Flex align='center'>
                  {memberVote &&
                    (+memberVote.uintVote === 1 ? (
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
        </Flex>
        <Flex
          direction='column'
          w={['100%', null, null, null, '40%']}
          pt={[6, 0]}
        >
          <Box>
            {!currentProposal?.cancelled && (
              <TextBox size='md'>Actions</TextBox>
            )}
          </Box>
          <Box pt={6}>
            {/* {!currentProposal?.cancelled && (
              <ProposalVote proposal={currentProposal} />
            )} */}
            <ActivitiesFeed
              limit={6}
              activities={currentProposal}
              hydrateFn={getProposalHistories}
            />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Proposal;
