import React, { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';

import { HiOutlineDocumentText } from 'react-icons/hi';
import TextBox from './TextBox';
import { fetchDAODocs } from '../utils/poster';

const recentDocByLocationName = async ({
  locationName,
  daoid,
  daochain,
  setDoc,
  shouldUpdate,
}) => {
  try {
    const docs = await fetchDAODocs({ daochain, daoid });
    const postedDoc = docs
      ?.filter(doc => doc.location === locationName)
      ?.sort((docA, docB) =>
        Number(docA?.createdAt) > Number(docB.createdAt) ? -1 : 1,
      )?.[0];
    if (postedDoc && shouldUpdate) {
      setDoc(postedDoc);
    }
  } catch (error) {
    console.error(error);
  }
};

const DocLink = ({ locationName }) => {
  const { daoid, daochain } = useParams();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    let shouldUpdate = true;
    recentDocByLocationName({
      locationName,
      daoid,
      daochain,
      setDoc,
      shouldUpdate,
    });
    return () => (shouldUpdate = false);
  }, []);

  if (!doc) return null;
  return (
    <Link to={`/dao/${daochain}/${daoid}/doc/${doc.id}`}>
      <Flex my={3} alignItems='center'>
        <TextBox size='md' variant='body' color='secondary.500' mr={1}>
          {doc?.title}
        </TextBox>
        <HiOutlineDocumentText size='1.25rem' />
      </Flex>
    </Link>
  );
};

export default DocLink;
