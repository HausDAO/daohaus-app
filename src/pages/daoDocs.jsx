import { Box, Button, Flex } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AddressAvatar from '../components/addressAvatar';
import ContentBox from '../components/ContentBox';
import MainViewLayout from '../components/mainViewLayout';
import { Bold, Heading, ParaLg, ParaSm } from '../components/typography';
import { DAO_DOC_COLLECTION } from '../graphQL/postQueries';
import { graphQuery } from '../utils/apollo';
import { chainByID } from '../utils/chain';
import { timeToNow } from '../utils/general';

const getDAOdocs = async ({ setDocs, daoid, daochain }) => {
  try {
    const endpoint = chainByID(daochain)?.poster_graph_url;
    const docs = await graphQuery({
      endpoint,
      query: DAO_DOC_COLLECTION,
      variables: {
        molochAddress: daoid,
      },
    });
    setDocs(docs?.contents);
  } catch (error) {
    setDocs({
      error: true,
      message: error.message || 'Error fetching DAO docs',
    });
  }
};

const DaoDocs = () => {
  const { daochain, daoid } = useParams();
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    getDAOdocs({
      daoid,
      daochain,
      setDocs,
    });
  }, []);

  return (
    <MainViewLayout
      isDao
      header='DAO Docs'
      headerEl={<Button>Create Doc</Button>}
    >
      <Heading fontSize='1.4rem'>Ratified DAO Documents:</Heading>
      <Flex wrap='wrap' mt={3}>
        {docs?.map(doc => (
          <ContentBox key={doc.id} mb={4} mr={4}>
            <Flex width='300px' alignItems='top'>
              <Flex width='250px' flexDir='column'>
                <ParaLg fontSize='1.3rem' mb={2}>
                  <Bold>
                    {doc.title === 'n/a' ? 'Title Missing' : doc.title}{' '}
                  </Bold>
                </ParaLg>
                <ParaSm mb={2}>
                  {doc.createdAt ? timeToNow(doc.createdAt) : 'n/a'}
                </ParaSm>
                <Flex>
                  <ParaSm mr={1}>Posted By:</ParaSm>
                  <AddressAvatar sizeForPropCard hideCopy />
                </Flex>
              </Flex>
              <Box>
                <Link href='/'>
                  <ParaSm>Read </ParaSm>
                </Link>
              </Box>
            </Flex>
          </ContentBox>
        ))}
      </Flex>
    </MainViewLayout>
  );
};

export default DaoDocs;
