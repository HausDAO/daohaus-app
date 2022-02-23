import { Box, Button, Flex } from '@chakra-ui/react';
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import AddressAvatar from '../components/addressAvatar';
import ContentBox from '../components/ContentBox';
import MainViewLayout from '../components/mainViewLayout';
import { Bold, Heading, ParaLg, ParaSm } from '../components/typography';
import { FORM } from '../data/formLegos/forms';
import { DAO_DOC_COLLECTION } from '../graphQL/postQueries';
import { useAppModal } from '../hooks/useModals';
import { graphQuery } from '../utils/apollo';
import { chainByID } from '../utils/chain';
import { timeToNow } from '../utils/general';

const getDAOdocs = async ({ setDocs, setIpfsDocs, daoid, daochain }) => {
  try {
    const endpoint = chainByID(daochain)?.poster_graph_url;
    const result = await graphQuery({
      endpoint,
      query: DAO_DOC_COLLECTION,
      variables: {
        molochAddress: daoid,
      },
    });
    const docs = result.contents;
    console.log('docs', docs);
    setDocs(docs);
    setIpfsDocs(docs?.filter(doc => doc.type === 'ipfs'));
  } catch (error) {
    // setDocs({
    //   error: true,
    //   message: error.message || 'Error fetching DAO docs',
    // });
    console.error(error);
  }
};

const DaoDocs = () => {
  const { daochain, daoid } = useParams();
  const { formModal } = useAppModal();

  const [ratifiedDocs, setRatifiedDocs] = useState(null);
  const [ipfsDocs, setIpfsDocs] = useState(null);
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    getDAOdocs({
      daoid,
      daochain,
      setDocs,
      setIpfsDocs,
    });
  }, []);

  const createDoc = () => {
    formModal(FORM.RATIFY);
  };

  return (
    <MainViewLayout
      isDao
      header='DAO Docs'
      headerEl={<Button onClick={createDoc}>Create Doc</Button>}
    >
      <Heading fontSize='1.4rem'>Ratified Documents:</Heading>
      <Flex wrap='wrap' mt={3}>
        {/* {docs?.map(doc => (
          <CrappyContentBox key={doc.id} doc={doc} />
        ))} */}
      </Flex>
      <Heading fontSize='1.4rem'>IPFS Documents:</Heading>
      <Flex wrap='wrap' mt={3}>
        {/* {docs?.map(doc => (
          <CrappyContentBox key={doc.id} doc={doc} />
        ))} */}
      </Flex>
      <Heading fontSize='1.4rem'>DAO Documents:</Heading>
      <Flex wrap='wrap' mt={3}>
        {docs?.map(doc => (
          <CrappyContentBox key={doc.id} doc={doc} />
        ))}
      </Flex>
    </MainViewLayout>
  );
};

const CrappyContentBox = ({ doc }) => {
  const { daochain, daoid } = useParams();

  return (
    <ContentBox key={doc.id} mb={4} mr={4}>
      <Flex width='300px' alignItems='top'>
        <Flex width='250px' flexDir='column'>
          <ParaLg fontSize='1.3rem' mb={2}>
            <Bold>{doc.title === 'n/a' ? 'Title Missing' : doc.title} </Bold>
          </ParaLg>
          <ParaSm mb={2}>
            {doc.createdAt ? timeToNow(doc.createdAt) : 'n/a'}
          </ParaSm>
        </Flex>
        <Box>
          <Link to={`/dao/${daochain}/${daoid}/doc/${doc.id}`}>
            <ParaSm>Read </ParaSm>
          </Link>
        </Box>
      </Flex>
    </ContentBox>
  );
};
export default DaoDocs;
