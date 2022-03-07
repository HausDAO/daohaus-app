import React, { useState, useEffect, useMemo } from 'react';
import { Badge, Box, Button, Flex, Tag } from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';

import { useAppModal } from '../hooks/useModals';
import ContentBox from '../components/ContentBox';
import MainViewLayout from '../components/mainViewLayout';
import { Label, ParaLg, ParaMd, ParaSm } from '../components/typography';

import { FORM } from '../data/formLegos/forms';
import { charLimit, formatCreatedAt } from '../utils/general';
import {
  fetchDAODocs,
  getSpecialLocationDocs,
  isCurrentDocAtLocation,
  isEncoded,
  isIPFS,
  isRatified,
} from '../utils/poster';

const filters = {
  IPFS: { fn: doc => isIPFS(doc) && !isRatified(doc), name: 'IPFS' },
  onchain: {
    fn: doc => isEncoded(doc?.contentType) && !isRatified(doc),
    name: 'On Chain',
  },
  ratified: { fn: doc => isRatified(doc), name: 'Ratified' },
};

const getDocsByType = async ({
  setDocs,
  setSpecialDocs,
  shouldUpdate,
  daoid,
  daochain,
}) => {
  try {
    const docs = await fetchDAODocs({ daochain, daoid });
    const specialLocationDocs = getSpecialLocationDocs(docs);

    if (shouldUpdate) {
      setDocs(docs);
      setSpecialDocs(specialLocationDocs);
    }
  } catch (error) {
    console.error(error);
  }
};

const DaoDocs = () => {
  const { daochain, daoid } = useParams();
  const { formModal } = useAppModal();

  const [docs, setDocs] = useState(null);
  const [specialLocationDocs, setSpecialDocs] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let shouldUpdate = true;
    getDocsByType({
      daoid,
      daochain,
      setDocs,
      setSpecialDocs,
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
      <Flex
        mt={3}
        display='inline-flex'
        mr={6}
        flexDir='column'
        maxWidth='79.5rem'
      >
        <Flex justifyContent='space-between' mr={6}>
          <Label fontWeight='400'>{`${docs?.length} documents`}</Label>
        </Flex>
        <Flex wrap='wrap' width='auto'>
          {docs?.map(doc => (
            <DocBox
              key={doc.id}
              doc={doc}
              specialLocationDocs={specialLocationDocs}
            />
          ))}
        </Flex>
      </Flex>
    </MainViewLayout>
  );
};

const DocBox = ({ doc, specialLocationDocs }) => {
  const { daochain, daoid } = useParams();

  const title = doc?.title === 'n/a' ? 'Title Missing' : doc.title;

  return (
    <ContentBox key={doc?.id} mb={6} mr={6} height='12.5rem' width='25rem'>
      <Flex justifyContent='space-between' flexDirection='column' height='100%'>
        <Flex width='350px' flexDir='column'>
          <ParaLg fontSize='1.3rem' mb={2} fontWeight='500'>
            {charLimit(title)}
          </ParaLg>
          <ParaSm mb={4} fontStyle='italic' fontWeight='100'>
            {`${isRatified(doc) ? 'Ratified ' : 'Posted '} on ${
              doc?.createdAt ? formatCreatedAt(doc.createdAt) : 'n/a'
            }`}
          </ParaSm>
          <ParaMd mb={3}>{doc?.description || 'No description'}</ParaMd>
        </Flex>
        <Flex justifyContent='space-between' mt='auto'>
          <Flex>
            {isRatified(doc) && <Badge mr={2}>Ratified</Badge>}
            {isIPFS(doc) && <Badge mr={2}>IPFS</Badge>}
            {isEncoded(doc) && <Badge mr={2}>Chain</Badge>}
            {isCurrentDocAtLocation(doc, specialLocationDocs) && (
              <Badge>{doc?.location}</Badge>
            )}
          </Flex>
          <Link to={`/dao/${daochain}/${daoid}/doc/${doc.id}`}>
            <ParaMd>VIEW</ParaMd>
          </Link>
        </Flex>
      </Flex>
    </ContentBox>
  );
};
export default DaoDocs;
