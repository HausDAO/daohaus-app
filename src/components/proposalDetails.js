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
  Button,
  Spinner,
} from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';
import { FaThumbsUp, FaThumbsDown, FaDiscourse } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { AddressZero } from '@ethersproject/constants';

import TextBox from '../components/TextBox';
import ContentBox from '../components/ContentBox';
import AddressAvatar from '../components/addressAvatar';
import ProposalMinionCard from '../components/proposalMinionCard';

import {
  getProposalCountdownText,
  getProposalDetailStatus,
  memberVote,
} from '../utils/proposalUtils';
import { numberWithCommas } from '../utils/general';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { getForumTopics } from '../utils/metadata';
import { createForumTopic } from '../utils/discourse';
import { useParams } from 'react-router-dom';

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
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { daoMetaData } = useMetaData();
  const { daoid, daochain } = useParams();
  const [forumTopic, setForumTopic] = useState(null);
  const [discourseLoading, setDiscourseLoading] = useState();

  console.log('proposal', proposal);

  useEffect(() => {
    const fetchForumTopics = async () => {
      setDiscourseLoading(true);
      const topicsRes = await getForumTopics(
        daoMetaData.boosts.discourse.metadata.categoryId,
      );

      console.log('proposal', proposal);
      console.log('topicsRes', topicsRes);

      const topicMatch = topicsRes.find((topic) => {
        const propId = topic.title.split(':')[0];
        return propId === proposal.proposalId;
      });

      setForumTopic(topicMatch ? topicMatch.id : null);
      setDiscourseLoading(false);
    };

    if (daoMetaData?.boosts.discourse?.active && proposal?.proposalId) {
      fetchForumTopics();
    }
  }, [daoMetaData, proposal]);

  console.log('forumTopic', forumTopic);

  const handleDiscourseTopic = async () => {
    setDiscourseLoading(true);
    const messageHash = injectedProvider.utils.sha3(daoid);
    const signature = await injectedProvider.eth.personal.sign(
      messageHash,
      address,
    );

    const discourseRes = await createForumTopic({
      chainID: daochain,
      daoID: daoid,
      ...proposal,
      values: { ...proposal },
      daoMetaData,
      category: daoMetaData.boosts.discourse.metadata.categoryId,
      sigData: {
        contractAddress: daoid,
        network: injectedChain.network,
        signature,
      },
    });

    console.log('discourseRes', discourseRes);

    setForumTopic(discourseRes);
    setDiscourseLoading(false);
  };

  return (
    <Box pt={6}>
      <ContentBox>
        <Box>
          <Box>
            <Flex justify='space-between' wrap={['wrap', null, null, 'nowrap']}>
              <TextBox size='xs' mb={[3, null, null, 0]}>
                {proposal?.proposalType}
              </TextBox>

              <Box fontSize={['sm', null, null, 'md']}>
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
            <ProposalMinionCard proposal={proposal} />
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
          {daoMetaData?.boosts.discourse?.active ? (
            <Box width='100%' fontSize='sm' mt={5}>
              {discourseLoading ? (
                <Spinner />
              ) : (
                <>
                  {forumTopic ? (
                    <Link
                      href={`https://forum.daohaus.club/t/${forumTopic}`}
                      isExternal
                    >
                      Discuss this proposal on the Discourse forum{' '}
                      <Icon as={RiExternalLinkLine} color='primary.50' />
                    </Link>
                  ) : (
                    <Button size='sm' onClick={handleDiscourseTopic}>
                      <Icon as={FaDiscourse} w={4} mr={1} /> Add a Discourse
                      Topic for this proposal
                    </Button>
                  )}
                </>
              )}
            </Box>
          ) : null}
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
          <Box>
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
