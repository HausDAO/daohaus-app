import React, { useState, useEffect } from 'react';
import {
  Badge,
  Flex,
  Box,
  Icon,
  Link,
  Skeleton,
  Text,
  Image,
} from '@chakra-ui/react';
import ContentBox from '../Shared/ContentBox';
import { RiExternalLinkLine } from 'react-icons/ri';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { utils } from 'web3';
import ReactPlayer from 'react-player';

import { useMembers, useMemberWallet } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import {
  memberProfile,
  proposalDetails,
  numberWithCommas,
} from '../../utils/helpers';
import {
  getProposalCountdownText,
  getProposalDetailStatus,
} from '../../utils/proposal-helper';
import ProposalMinionCard from './ProposalMinionCard';
import TextBox from '../Shared/TextBox';
import MemberAvatar from '../Members/MemberAvatar';
import UserAvatar from '../Shared/UserAvatar';
import { ZERO_ADDRESS } from '../../utils/constants';

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

const ProposalDetail = ({ proposal }) => {
  const [members] = useMembers();
  const [theme] = useTheme();

  const details = proposalDetails(proposal?.details);

  const [memberWallet] = useMemberWallet();
  const [memberVote, setMemberVote] = useState();

  useEffect(() => {
    if (proposal?.votes && memberWallet && memberWallet?.activeMember) {
      setMemberVote(
        proposal.votes.find(
          (vote) =>
            vote.memberAddress === memberWallet.memberAddress.toLowerCase(),
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberWallet, proposal]);

  return (
    <ContentBox>
      <Box>
        <Box>
          <Flex justify='space-between'>
            <TextBox size='xs'>
              {proposal ? proposal.proposalType : theme.daoMeta.proposal}
            </TextBox>

            <Box>
              {proposal?.proposalIndex ? (
                <>
                  {proposal?.status ? getProposalDetailStatus(proposal) : '--'}
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

          <Skeleton
            isLoaded={
              (details && Object.keys(details).length > 0) ||
              proposal?.minionAddress
            }
          >
            {details && Object.keys(details).includes('title') ? (
              <Text fontSize='3xl'>{details.title}</Text>
            ) : proposal?.minionAddress ? null : (
              '-'
            )}
          </Skeleton>

          {proposal?.minionAddress ? (
            <ProposalMinionCard proposal={proposal} />
          ) : (
            <Skeleton isLoaded={details?.description}>
              {details && Object.keys(details).includes('description') ? (
                details?.description?.indexOf('http') > -1 ? (
                  <Box
                    w='100%'
                    dangerouslySetInnerHTML={{
                      __html: urlify(details?.description),
                    }}
                  />
                ) : (
                  <Box w='100%'>{details?.description}</Box>
                )
              ) : null}
            </Skeleton>
          )}
          <Box
            mt={
              (details && Object.keys(details).length > 0) ||
              proposal?.minionAddress
                ? 6
                : 2
            }
          >
            {details &&
            Object.keys(details).includes('link') &&
            !ReactPlayer.canPlay(details?.link) &&
            !hasImage(details?.link) ? (
              <TextBox size='xs'>Link</TextBox>
            ) : null}
            <Skeleton
              isLoaded={
                (details && Object.keys(details).length > 0) ||
                proposal?.minionAddress
              }
            >
              {details ? (
                Object.keys(details).includes('link') ? (
                  ReactPlayer.canPlay(details?.link) ? (
                    <Box width='100%'>
                      <ReactPlayer
                        url={details?.link}
                        playing={false}
                        loop={false}
                        width='100%'
                      />
                    </Box>
                  ) : hasImage(details?.link) ? (
                    <Image
                      src={`https://${details?.link}`}
                      maxW='100%'
                      margin='0 auto'
                      alt='link image'
                    />
                  ) : (
                    <Link href={`https://${details?.link}`} target='_blank'>
                      {details?.link ? details.link : '-'}{' '}
                      <Icon as={RiExternalLinkLine} color='primary.50' />
                    </Link>
                  )
                ) : null
              ) : proposal?.minionAddress ? null : (
                '--'
              )}
            </Skeleton>
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
        </Box>
      </Box>

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
          <Skeleton isLoaded={members && proposal?.proposer}>
            {members && proposal?.proposer ? (
              memberProfile(members, proposal?.proposer).profile ? (
                <MemberAvatar
                  member={memberProfile(members, proposal?.proposer)}
                />
              ) : (
                <UserAvatar user={memberProfile(members, proposal?.proposer)} />
              )
            ) : (
              '--'
            )}
          </Skeleton>
        </Box>
        <Box>
          <TextBox size='xs' mb={2}>
            Recipient
          </TextBox>
          <Skeleton isLoaded={members && proposal?.applicant}>
            {members && proposal?.applicant ? (
              memberProfile(
                members,
                proposal?.applicant !== ZERO_ADDRESS
                  ? proposal?.applicant
                  : proposal?.proposer,
              ).profile ? (
                <MemberAvatar
                  member={memberProfile(
                    members,
                    proposal?.applicant !== ZERO_ADDRESS
                      ? proposal?.applicant
                      : proposal?.proposer,
                  )}
                />
              ) : (
                <UserAvatar
                  user={memberProfile(
                    members,
                    proposal?.applicant !== ZERO_ADDRESS
                      ? proposal?.applicant
                      : proposal?.proposer,
                  )}
                />
              )
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
  );
};

export default ProposalDetail;
