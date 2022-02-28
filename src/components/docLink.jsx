import { Icon } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { Link, useParams } from 'react-router-dom';
import { fetchDAODocs } from '../utils/poster';
import TextBox from './TextBox';

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
    <TextBox size='xl' variant='body' mt={6}>
      <Link to={`/dao/${daochain}/${daoid}/doc/${doc.id}`}>
        {doc?.title} <Icon as={BsArrowRight} color='secondary.500' mr={2} />
      </Link>
    </TextBox>
  );
};

export default DocLink;
