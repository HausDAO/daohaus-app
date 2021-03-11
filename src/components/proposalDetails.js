import React, { useState, useEffect } from 'react';
import { utils } from 'web3';
import { Link, useParams } from 'react-router-dom';
import {
  Flex,
  Box,
  Skeleton,
  Badge,
  Text,
  Image,
  Icon,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { AddressZero } from '@ethersproject/constants';

import TextBox from '../components/TextBox';
import ContentBox from '../components/ContentBox';
import AddressAvatar from '../components/addressAvatar';
import ProposalMinionCard from '../components/proposalMinionCard';
import {
  determineProposalStatus,
  getProposalCountdownText,
  getProposalDetailStatus,
  memberVote,
  MINION_TYPES,
  PROPOSAL_TYPES,
} from '../utils/proposalUtils';
import { numberWithCommas } from '../utils/general';
import { getCustomProposalTerm } from '../utils/metadata';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import DiscourseProposalTopic from './discourseProposalTopic';
import { useMetaData } from '../contexts/MetaDataContext';
import { UberHausMinionService } from '../services/uberHausMinionService';

const UBER_LINK =
  '/dao/0x2a/0x96714523778e51b898b072089e5615d4db71078e/proposals';

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

const ProposalDetails = ({ proposal, daoMember }) => {
  const { address } = useInjectedProvider();
  const { customTerms } = useMetaData();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (proposal) {
      const statusStr = determineProposalStatus(proposal);
      setStatus(statusStr);
    }
  }, [proposal]);

  console.log('proposal', proposal);

  return (
    <Box pt={6}>
      <ContentBox>
        <Box>
          <Box>
            <Flex justify='space-between' wrap={['wrap', null, null, 'nowrap']}>
              <TextBox size='xs' mb={[3, null, null, 0]}>
                {getCustomProposalTerm(customTerms, proposal?.proposalType)}
              </TextBox>

              <Box fontSize={['sm', null, null, 'md']}>
                {proposal?.proposalIndex ? (
                  <>
                    {status ? getProposalDetailStatus(proposal, status) : '--'}
                  </>
                ) : (
                  <>
                    <Skeleton isLoaded={status}>
                      <Badge>
                        {status
                          ? getProposalCountdownText(proposal, status)
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
            <ProposalMinionCard proposal={proposal} />
          ) : (
            <Skeleton isLoaded={proposal?.description}>
              {proposal?.description &&
                (proposal?.description.indexOf('http') > -1 ? (
                  <Box
                    w='100%'
                    dangerouslySetInnerHTML={{
                      __html: urlify(proposal?.description),
                    }}
                  />
                ) : (
                  <Box w='100%'>{proposal?.description}</Box>
                ))}
            </Skeleton>
          )}

          <Box mt={proposal?.link || proposal?.minionAddress ? 6 : 2}>
            {proposal?.link &&
              !ReactPlayer.canPlay(proposal?.link) &&
              !hasImage(proposal?.link) && <TextBox size='xs'>Link</TextBox>}
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
          <DiscourseProposalTopic proposal={proposal} daoMember={daoMember} />
        </Box>
        <Flex w='100%' justify='space-between' mt={6} wrap='wrap'>
          {(proposal?.tributeOffered > 0 || !proposal?.tributeOffered) && (
            <Box mb={3}>
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
            <Box mb={3}>
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
            <Box mb={3}>
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
            <Box mb={3}>
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
          mt={3}
          mb={6}
          justify='space-between'
          direction={['column', 'row']}
          pr={memberVote(proposal, address) !== null && '5%'}
          w='100%'
        >
          <Box mb={[3, null, null, 0]}>
            <TextBox size='xs' mb={2}>
              Submitted By
            </TextBox>
            <Skeleton isLoaded={proposal}>
              {proposal ? (
                <AddressAvatar addr={proposal.proposer} alwaysShowName={true} />
              ) : (
                '--'
              )}
            </Skeleton>
          </Box>
          {proposal?.minion?.minionType !== MINION_TYPES.UBER ? (
            <Box key={proposal?.proposalType}>
              <TextBox size='xs' mb={2}>
                Recipient
              </TextBox>
              <Skeleton isLoaded={proposal}>
                {proposal ? (
                  <AddressAvatar
                    addr={
                      proposal.applicant === AddressZero
                        ? proposal.proposer
                        : proposal.applicant
                    }
                    alwaysShowName={true}
                  />
                ) : (
                  '--'
                )}
              </Skeleton>
            </Box>
          ) : (
            <DelegateRecipient proposal={proposal} />
          )}
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
        {proposal?.minion?.minionType === MINION_TYPES.UBER && (
          <DelegateBox proposal={proposal} />
        )}
      </ContentBox>
    </Box>
  );
};

export default ProposalDetails;

const DelegateRecipient = ({ proposal }) => {
  return (
    <Tooltip
      hasArrow
      label={
        <Box fontFamily='heading' p={5}>
          <TextBox mb={2}>Uber Proposal</TextBox>
          <Flex mb={2}>
            This UberHAUS Staking Proposal is delegated through a Minion.
          </Flex>
          <Flex>
            Once the proposal is executed, it is voted on in the uberHAUS DAO.
            (Click to visit)
          </Flex>
        </Box>
      }
      bg='primary.500'
      placement='top'
    >
      <Box as={Link} to={UBER_LINK}>
        <TextBox size='xs' mb={2}>
          Minion
        </TextBox>
        <Skeleton isLoaded={proposal}>
          {proposal ? (
            <AddressAvatar
              addr={
                proposal.applicant === AddressZero
                  ? proposal.proposer
                  : proposal.applicant
              }
              alwaysShowName={true}
            />
          ) : (
            '--'
          )}
        </Skeleton>
      </Box>
    </Tooltip>
  );
};

const DelegateBox = ({ proposal }) => {
  const { daochain, daoid } = useParams();
  const [minionDelegate, setMinionDelegate] = useState(null);

  useEffect(() => {
    const getDelegate = async () => {
      try {
        const delegate = await UberHausMinionService({
          chainID: daochain,
          uberHausMinion: proposal?.minionAddress,
        })('currentDelegate')();
        setMinionDelegate(delegate);
      } catch (error) {
        console.error(error?.message);
      }
    };
    if (proposal?.minionAddress) {
      getDelegate();
    }
  }, [proposal]);

  return (
    <Box display='inline-block'>
      <Box
        as={Link}
        to={`/dao/${daochain}/${daoid}/profile/${minionDelegate}`}
        mt={6}
        flexDirection='column'
      >
        <TextBox size='xs' mb={2}>
          Current Delegate
        </TextBox>
        {minionDelegate ? (
          <AddressAvatar addr={minionDelegate} alwaysShowName={true} />
        ) : (
          <Spinner />
        )}
      </Box>
    </Box>
  );
};
