import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { omit } from '../utils/general';
import { fetchDAODocs } from '../utils/poster';
import GenericSelect from './genericSelect';

const stripGraphMeta = doc =>
  omit(
    ['ratified', 'createdAt', 'transactionHash', 'memberAddress', 'id'],
    doc,
  );

const getDAOdocs = async ({ setDocs, shouldUpdate, daoid, daochain }) => {
  try {
    const docs = await fetchDAODocs({ daochain, daoid });
    if (docs?.length && shouldUpdate) {
      setDocs(docs.filter(doc => !doc.ratified));
    }
  } catch (error) {
    console.error(error);
  }
};

const DocSelect = props => {
  const { localForm, name, listenTo } = props;
  const { watch, setValue } = localForm || {};

  const { daoid, daochain } = useParams(null);
  const [docs, setDocs] = useState(null);

  const currentValue = watch(name);

  const newLocation = watch(listenTo);

  const options = useMemo(
    () =>
      docs?.map(doc => ({
        name: doc.title,
        value: doc.id,
        key: doc.id,
      })),
    [docs],
  );
  useEffect(() => {
    let shouldUpdate = true;
    getDAOdocs({ daoid, daochain, setDocs, shouldUpdate });
    return (shouldUpdate = false);
  }, []);

  useEffect(() => {
    if (docs?.length && currentValue) {
      const selectedDoc = docs.find(doc => doc.id === currentValue);
      const contentData = stripGraphMeta(
        newLocation ? { ...selectedDoc, location: newLocation } : selectedDoc,
      );
      setValue('docContentData', JSON.stringify(contentData));
    }
  }, [currentValue, docs, newLocation]);

  return <GenericSelect {...props} isDisabled={docs} options={options} />;
};

export default DocSelect;
