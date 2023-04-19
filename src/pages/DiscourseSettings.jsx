import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import { Flex, Icon, Box, useToast, Link, Text } from '@chakra-ui/react';

import TextBox from '../components/TextBox';
import MainViewLayout from '../components/mainViewLayout';

const DiscourseSettings = ({ daoMetaData }) => {
  const toast = useToast();
  const [localMetadata, setLocalMetadata] = useState();

  useEffect(() => {
    if (daoMetaData?.boosts?.DISCOURSE?.active) {
      setLocalMetadata(daoMetaData.boosts.DISCOURSE.metadata);
    }
  }, [daoMetaData]);

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
    <MainViewLayout header='Discourse Forum Settings' isDao>
      {localMetadata ? (
        <>
          <Flex justify='space-around' mt='150px'>
            <Box w='35%'>
              <TextBox color='white' size='sm' mb={8}>
                Discourse Forum URL
              </TextBox>
              <CopyToClipboard
                text={`https://forum.daohaus.club/c/${localMetadata.slug}/${localMetadata.categoryId}`}
                onCopy={copiedToast}
              >
                <>
                  <Link
                    href={`https://forum.daohaus.club/c/${localMetadata.slug}/${localMetadata.categoryId}`}
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    {`https://forum.daohaus.club/c/${localMetadata.slug}/${localMetadata.categoryId}`}
                  </Link>
                  <Icon
                    as={FaCopy}
                    color='secondary.300'
                    ml={2}
                    _hover={{ cursor: 'pointer' }}
                  />
                </>
              </CopyToClipboard>
              <Text fontSize='md' mt={6}>
                DAO members can visit the forum, signup and start discussing all
                the topics.
              </Text>
            </Box>
          </Flex>
        </>
      ) : (
        <Flex justify='space-around' mt='150px'>
          <Box w='45%'>
            <Flex justify='space-between'>
              <TextBox color='white' size='sm' mb={2}>
                Boost not active
              </TextBox>
            </Flex>
          </Box>
        </Flex>
      )}
    </MainViewLayout>
  );
};

export default DiscourseSettings;
