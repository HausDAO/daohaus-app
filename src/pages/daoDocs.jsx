import React, { useState, useEffect } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';

import { useAppModal } from '../hooks/useModals';
import ContentBox from '../components/ContentBox';
import MainViewLayout from '../components/mainViewLayout';
import { Bold, Heading, ParaLg, ParaSm } from '../components/typography';

import { FORM } from '../data/formLegos/forms';
import { timeToNow } from '../utils/general';
import { fetchDAODocs, isEncoded, isIPFS, isRatified } from '../utils/poster';

const getDocsByType = async ({
  setRatifiedDocs,
  setIpfsDocs,
  setChainDocs,
  daoid,
  daochain,
}) => {
  try {
    const docs = await fetchDAODocs({ daochain, daoid });
    const memberPostedIPFSdocs = docs?.filter(
      doc => isIPFS(doc) && !isRatified(doc),
    );
    const memberPostedChainDocs = docs?.filter(
      doc => isEncoded(doc?.contentType) && !isRatified(doc),
    );
    const ratifiedDocs = docs?.filter(doc => isRatified(doc));

    setChainDocs(memberPostedChainDocs);
    setIpfsDocs(memberPostedIPFSdocs);
    setRatifiedDocs(ratifiedDocs);
  } catch (error) {
    console.error(error);
  }
};

const DaoDocs = () => {
  const { daochain, daoid } = useParams();
  const { formModal } = useAppModal();

  const [ratifiedDocs, setRatifiedDocs] = useState(null);
  const [ipfsDocs, setIpfsDocs] = useState(null);
  const [chainDocs, setChainDocs] = useState(null);

  useEffect(() => {
    getDocsByType({
      daoid,
      daochain,
      setRatifiedDocs,
      setIpfsDocs,
      setChainDocs,
    });
  }, []);

  const createDoc = () => formModal(FORM.RATIFY_MD);

  return (
    <MainViewLayout
      isDao
      header='DAO Docs'
      headerEl={<Button onClick={createDoc}>Create Doc</Button>}
    >
      <Heading fontSize='1.4rem'>Ratified Documents:</Heading>
      <Flex wrap='wrap' mt={3}>
        {ratifiedDocs?.map(doc => (
          <CrappyContentBox key={doc.id} doc={doc} />
        ))}
      </Flex>
      <Heading fontSize='1.4rem'>IPFS Documents:</Heading>
      <Flex wrap='wrap' mt={3}>
        {ipfsDocs?.map(doc => (
          <CrappyContentBox key={doc.id} doc={doc} />
        ))}
      </Flex>
      <Heading fontSize='1.4rem'>DAO Documents:</Heading>
      <Flex wrap='wrap' mt={3}>
        {chainDocs?.map(doc => (
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
