import React, { useEffect, useState } from 'react';
import {
  Spinner,
  Box,
  Button,
  Link,
  Icon,
  Text,
  HStack,
} from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';
import { FaDiscourse } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

import { useMetaData } from '../contexts/MetaDataContext';
import { getForumTopics } from '../utils/metadata';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { createForumTopic } from '../utils/discourse';
import { daoConnectedAndSameChain } from '../utils/general';

const DiscourseProposalTopic = ({ proposal, daoMember }) => {
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { daoMetaData } = useMetaData();
  const { daoid, daochain } = useParams();
  const [forumTopic, setForumTopic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForumTopics = async () => {
      const topicsRes = await getForumTopics(
        daoMetaData.boosts.discourse.metadata.categoryId,
      );

      const topicMatch = topicsRes.find(topic => {
        const propId = topic.title.split(':')[0];
        return propId === proposal.proposalId;
      });

      setForumTopic(topicMatch ? topicMatch.id : null);
    };

    if (daoMetaData?.boosts?.discourse?.active && proposal?.proposalId) {
      fetchForumTopics();
    }
  }, [daoMetaData, proposal]);

  const handleDiscourseTopic = async () => {
    setLoading(true);
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
      autoOverride: true,
    });

    if (discourseRes.error) {
      setError(discourseRes.error);
    } else {
      setForumTopic(discourseRes);
      setError(null);
    }

    setLoading(false);
  };

  return (
    <>
      {daoMetaData?.boosts?.discourse?.active ? (
        <Box width='100%' fontSize='sm' mt={5}>
          {loading ? (
            <Spinner />
          ) : (
            <>
              {forumTopic ? (
                <Link
                  href={`https://forum.daohaus.club/t/${forumTopic}`}
                  isExternal
                >
                  <Icon as={FaDiscourse} w={4} mr={1} />
                  Discuss this proposal on the Discourse forum
                  <Icon as={RiExternalLinkLine} color='primary.50' />
                </Link>
              ) : (
                <>
                  {daoConnectedAndSameChain(
                    address,
                    daochain,
                    injectedChain?.chainId,
                  ) &&
                    +daoMember?.shares > 0 && (
                      <Button
                        as={HStack}
                        size='sm'
                        spacing={3}
                        onClick={handleDiscourseTopic}
                      >
                        <Icon as={FaDiscourse} w={4} mr={1} />
                        <Box>Add a Discourse Topic for this proposal</Box>
                      </Button>
                    )}

                  {error && <Text>{error}</Text>}
                </>
              )}
            </>
          )}
        </Box>
      ) : null}
    </>
  );
};

export default DiscourseProposalTopic;
