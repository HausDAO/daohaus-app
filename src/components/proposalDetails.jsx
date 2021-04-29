import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useParams, Link as RouterLink } from 'react-router-dom';
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
  Link,
  Avatar,
  useToast,
  HStack,
} from '@chakra-ui/react';

import { RiExternalLinkLine } from 'react-icons/ri';
import { FaThumbsUp, FaThumbsDown, FaCopy } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { AddressZero } from '@ethersproject/constants';

import makeBlockie from 'ethereum-blockies-base64';
import TextBox from './TextBox';
import ContentBox from './ContentBox';
import AddressAvatar from './addressAvatar';
import ProposalMinionCard from './proposalMinionCard';
import {
  determineProposalStatus,
  getProposalCountdownText,
  getProposalDetailStatus,
  memberVote,
  MINION_TYPES,
} from '../utils/proposalUtils';
import { numberWithCommas } from '../utils/general';
import { getCustomProposalTerm, themeImagePath } from '../utils/metadata';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import DiscourseProposalTopic from './discourseProposalTopic';
import { useMetaData } from '../contexts/MetaDataContext';
import { UberHausMinionService } from '../services/uberHausMinionService';
import { useDao } from '../contexts/DaoContext';
import { UBERHAUS_DATA } from '../utils/uberhaus';

const UBER_LINK = '/dao/0x2a/0x96714523778e51b898b072089e5615d4db71078e/proposals';

const urlify = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a rel="noopener noreferrer" target="_blank" href="${url}"> link </a>`;
  });
};

const hasImage = (string) => {
  const imageExtensions = ['.jpg', '.png', '.gif'];
  return imageExtensions.some((o) => string.includes(o));
};

const ProposalDetails = ({ proposal, daoMember }) => {
  const { address } = useInjectedProvider();
  const { customTerms } = useMetaData();
  const { isUberHaus } = useDao();
  const [status, setStatus] = useState(null);
  const { daoid } = useParams();
  console.log(proposal);

  useEffect(() => {
    if (proposal) {
      const statusStr = determineProposalStatus(proposal);
      setStatus(statusStr);
    }
  }, [proposal]);

  const handleRecipientUI = () => {
    // IF current dao is uberHaus
    if (daoid === UBERHAUS_DATA.ADDRESS && isUberHaus) {
      return <UberDaoBox proposal={proposal} />;
    }
    if (
      proposal?.minion?.minionType !== MINION_TYPES.UBER
      && proposal?.minion?.minionType !== undefined
    ) {
      return <MinionBox proposal={proposal} />;
    }
    return (
      <Box key={proposal?.proposalId}>
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
              alwaysShowName
            />
          ) : (
            '--'
          )}
        </Skeleton>
      </Box>
    );
  };

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
            <>
              <Box w='100%'>{proposal?.description}</Box>
              <ProposalMinionCard proposal={proposal} />
            </>
          ) : (
            <Skeleton isLoaded={proposal?.description}>
              {proposal?.description
                && (proposal?.description.indexOf('http') > -1 ? (
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
            {proposal?.link
              && !ReactPlayer.canPlay(proposal?.link)
              && !hasImage(proposal?.link) && <TextBox size='xs'>Link</TextBox>}
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
                      <HStack
                        as={Link}
                        href={`https://${proposal?.link}`}
                        target='_blank'
                        spacing={2}
                      >
                        <Box>{proposal?.link ? proposal?.link : '-'}</Box>
                        <Icon as={RiExternalLinkLine} color='primary.50' />
                      </HStack>
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
              <TextBox size='xs'>
                {proposal?.proposalType === 'Transmutation Proposal'
                  ? 'Transmuting'
                  : 'Tribute'}
              </TextBox>
              <Skeleton isLoaded={proposal?.tributeOffered}>
                <TextBox size='lg' variant='value'>
                  {proposal?.tributeOffered
                    ? `${numberWithCommas(
                      Number(proposal.tributeOffered) / 10 ** Number(proposal.tributeTokenDecimals),
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
                      Number(proposal.paymentRequested) / 10 ** Number(proposal.paymentTokenDecimals),
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
                <AddressAvatar addr={proposal.proposer} alwaysShowName />
              ) : (
                '--'
              )}
            </Skeleton>
          </Box>
          {handleRecipientUI()}
          <Flex align='center'>
            {memberVote(proposal, address) !== null
              && (+memberVote(proposal, address) === 1 ? (
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

const MinionLabelTip = () => (
  <Box fontFamily='heading' p={5}>
    <TextBox mb={2}>Uber Proposal</TextBox>
    <Box mb={2} color='whiteAlpha.700'>
      This UberHAUS Staking Proposal is delegated through a Minion.
    </Box>
    <Box color='whiteAlpha.700'>
      Once the proposal is executed, it is voted on in the uberHAUS DAO. (Click
      to visit)
    </Box>
  </Box>
);

const MinionBox = ({ proposal }) => {
  return (
    <Tooltip
      hasArrow
      label={<MinionLabelTip />}
      bg='primary.500'
      placement='top'
    >
      <Box as={RouterLink} to={UBER_LINK}>
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
              alwaysShowName
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
          <AddressAvatar addr={minionDelegate} alwaysShowName />
        ) : (
          <Spinner />
        )}
      </Box>
    </Box>
  );
};

const UberDaoBox = ({ proposal }) => {
  const { daoMembers } = useDao();
  const toast = useToast();
  const [daoMinion, setDaoMinion] = useState(null);

  useEffect(() => {
    if (!daoMembers && !proposal) return;
    const minion = daoMembers.find(
      (member) => member.memberAddress === proposal?.proposer
        || member.delegateKey === proposal?.proposer,
    );

    console.log(daoMembers);
    console.log(proposal);
    console.log(minion);
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
