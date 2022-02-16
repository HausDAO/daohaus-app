import { Flex, Heading } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ContentBox from '../components/ContentBox';
import { Bold, ParaLg, ParaMd } from '../components/typography';
import { DAO_DOC_COLLECTION } from '../graphQL/postQueries';
import { graphQuery } from '../utils/apollo';
import { chainByID } from '../utils/chain';

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
    <Flex wrap='wrap'>
      {docs?.map(doc => (
        <ContentBox key={doc.id} mb={4} mr={4}>
          <Flex width='300px' flexDir='column'>
            <ParaLg fontSize='1.3rem' mb={2}>
              <Bold>Title: </Bold>
              {doc.title}
            </ParaLg>
            <ParaMd>
              <Bold>Created At: </Bold>
              {doc.createdAt}
            </ParaMd>
          </Flex>
        </ContentBox>
      ))}
    </Flex>
  );
};

export default DaoDocs;
