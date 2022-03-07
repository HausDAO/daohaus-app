import React, { useState, useEffect, useMemo } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useAppModal } from '../hooks/useModals';
import MainViewLayout from '../components/mainViewLayout';

import { FORM } from '../data/formLegos/forms';
import {
  fetchDAODocs,
  getSpecialLocationDocs,
  isEncoded,
  isIPFS,
  isRatified,
} from '../utils/poster';
import Dropdown from '../components/dropdown';
import TextBox from '../components/TextBox';
import DocCard from '../components/docCard';

const filters = {
  all: {
    value: 'all',
    name: 'All Docs',
    fn: docs => docs,
  },
  IPFS: {
    value: 'IPFS',
    name: 'IPFS',
    fn: docs => docs.filter(doc => isIPFS(doc)),
  },
  onchain: {
    value: 'onchain',
    name: 'On Chain',
    fn: docs => docs.filter(doc => isEncoded(doc)),
  },
  ratified: {
    value: 'ratified',
    name: 'Ratified',
    fn: docs => docs.filter(doc => isRatified(doc)),
  },
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
  const [filter, setFilter] = useState(filters.all);

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

  const filterDocs = useMemo(() => docs && filter && filter.fn(docs), [
    filter,
    docs,
  ]);

  const createDoc = () => formModal(FORM.RATIFY_MD);
  const handleFilterMenuClick = e => setFilter(filters[e.target.value]);
  return (
    <MainViewLayout
      isDao
      header='Documents'
      headerEl={<Button onClick={createDoc}>Create Doc</Button>}
    >
      <Flex mt={6} mr={6} flexDir='column' maxWidth='79.5rem'>
        <Flex justifyContent='space-between' mr={6} mb={4}>
          {docs && <TextBox size='sm'>{`${docs?.length} documents`}</TextBox>}
          <Dropdown
            selectedItem={filter}
            setter={setFilter}
            items={filters}
            label='Filter By:'
            onClick={handleFilterMenuClick}
          />
        </Flex>
        <Flex wrap='wrap' width='auto'>
          {filterDocs?.map(doc => (
            <DocCard
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

export default DaoDocs;
