import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useAppModal } from '../hooks/useModals';
import MainViewLayout from '../components/mainViewLayout';

import {
  fetchDAODocs,
  getSpecialLocationDocs,
  isRatified,
} from '../utils/poster';
import Dropdown from '../components/dropdown';
import TextBox from '../components/TextBox';
import DocCard from '../components/docCard';
import { POSTER_FORMS } from '../data/formLegos/posterForms';

const filters = {
  all: {
    value: 'all',
    name: 'All Docs',
    fn: docs => docs,
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
  const handleFilterMenuClick = e => setFilter(filters[e.target.value]);
  const handleForm = e => {
    formModal(POSTER_FORMS[e.target.value]);
  };
  const FormMenu = (
    <Menu>
      <MenuButton outline='secondary.500' as={Button} variant='outline'>
        Propose New Document
      </MenuButton>
      <MenuList>
        {Object.values(POSTER_FORMS).map(form => (
          <MenuItem key={form.id} value={form.id} onClick={handleForm}>
            {form.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );

  return (
    <MainViewLayout isDao header='Documents' headerEl={FormMenu}>
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
