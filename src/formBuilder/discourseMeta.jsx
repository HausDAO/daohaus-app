import { useEffect } from 'react';

import { useMetaData } from '../contexts/MetaDataContext';

const DiscourseMeta = props => {
  const { localForm } = props;
  const { setValue } = localForm;
  const { daoMetaData } = useMetaData();

  useEffect(() => {
    setValue('name', daoMetaData.name);
    setValue('autoProposal', true);
  }, []);

  return null;
};
export default DiscourseMeta;
