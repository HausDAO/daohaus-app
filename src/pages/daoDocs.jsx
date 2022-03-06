import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';

import { useAppModal } from '../hooks/useModals';
import ContentBox from '../components/ContentBox';
import MainViewLayout from '../components/mainViewLayout';
import { Bold, ParaLg, ParaMd, ParaSm } from '../components/typography';

import { FORM } from '../data/formLegos/forms';
import { charLimit, timeToNow } from '../utils/general';
import { fetchDAODocs, isEncoded, isIPFS, isRatified } from '../utils/poster';

const filters = {
  IPFS: { fn: doc => isIPFS(doc) && !isRatified(doc), name: 'IPFS' },
  onchain: {
    fn: doc => isEncoded(doc?.contentType) && !isRatified(doc),
    name: 'On Chain',
  },
  ratified: { fn: doc => isRatified(doc), name: 'Ratified' },
};

const getDocsByType = async ({ setDocs, shouldUpdate, daoid, daochain }) => {
  try {
    const docs = await fetchDAODocs({ daochain, daoid });
    if (shouldUpdate) {
      setDocs(docs);
    }
  } catch (error) {
    console.error(error);
  }
};

const DaoDocs = () => {
  const { daochain, daoid } = useParams();
  const { formModal } = useAppModal();

  const [docs, setDocs] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let shouldUpdate = true;
    getDocsByType({
      daoid,
      daochain,
      setDocs,
      shouldUpdate,
    });
    return () => (shouldUpdate = false);
  }, []);
  const filterDocs = useMemo(() => {
    if (docs) {
      if (!filter) return docs;
      return filters[filter]?.(docs) || docs;
    }
  }, [filter, docs]);

  const createDoc = () => formModal(FORM.RATIFY_MD);

  return (
    <MainViewLayout
      isDao
      header='DAO Docs'
      headerEl={<Button onClick={createDoc}>Create Doc</Button>}
    >
      <Flex mt={3} display='inline-flex' mr={6} flexDir='column'>
        <Flex justifyContent='flex-end'>
          <ParaMd>Text</ParaMd>
        </Flex>
        <Flex wrap='wrap' width='auto'>
          {docs?.map(doc => (
            <DocBox key={doc.id} doc={doc} />
          ))}
        </Flex>
      </Flex>
    </MainViewLayout>
  );
};

const DocBox = ({ doc }) => {
  const { daochain, daoid } = useParams();

  const title = doc.title === 'n/a' ? 'Title Missing' : doc.title;
  return (
    <ContentBox key={doc.id} mb={6} mr={4} height='225px' width='440px'>
      <Flex alignItems='top' justifyContent='space-between'>
        <Flex width='350px' flexDir='column'>
          <ParaLg fontSize='1.3rem' mb={2}>
            <Bold>{charLimit(title)} </Bold>
          </ParaLg>
          <ParaMd mb={3}>{doc?.description || 'No description'}</ParaMd>
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
