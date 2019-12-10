import React from 'react';
import { Helmet } from 'react-helmet';

const HeadTags = (props) => {
  const { daoData } = props;

  return (
    <Helmet>
      <title>{`${daoData.name || 'PokéMol DAO'}`}</title>
    </Helmet>
  );
};

export default HeadTags;
