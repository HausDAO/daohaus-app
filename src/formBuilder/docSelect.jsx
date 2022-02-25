import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { omit } from '../utils/general';
import { fetchDAODocs } from '../utils/poster';
import GenericSelect from './genericSelect';

const getDAOdocs = async ({ setDocs, shouldUpdate, daoid, daochain }) => {
  try {
    const docs = await fetchDAODocs({ daochain, daoid });
    if (docs?.length && shouldUpdate) {
      setDocs(
        docs?.map(doc => ({
          name: doc.title,
          value: omit(
            ['ratified', 'createdAt', 'transactionHash', 'memberAddress'],
            doc,
          ),
          key: doc.id,
        })),
      );
    }
  } catch (error) {
    console.error(error);
  }
};

const DocSelect = props => {
  const {
    localForm: { watch },
    name,
  } = props;

  const { daoid, daochain } = useParams(null);
  const [docs, setDocs] = useState(null);
  const currentValue = watch(name);
  useEffect(() => {
    let shouldUpdate = true;
    getDAOdocs({ daoid, daochain, setDocs, shouldUpdate });
    return (shouldUpdate = false);
  }, []);

  return <GenericSelect {...props} isDisabled={docs} options={docs} />;
};

export default DocSelect;
