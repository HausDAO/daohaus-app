import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { DaoServiceContext } from '../../contexts/Store';
import { GET_RAGES } from '../../utils/Queries';
import ErrorMessage from '../../components/shared/ErrorMessage';
import BottomNav from '../../components/shared/BottomNav';
import RageList from '../../components/rage/RageList';
import Loading from '../../components/shared/Loading';
import { ViewDiv, PadDiv } from '../../App.styles';

const Rage = () => {
  const [daoService] = useContext(DaoServiceContext);

  const { loading, error, data, fetchMore } = useQuery(GET_RAGES, {
    variables: { contractAddr: daoService.daoAddress.toLowerCase() },
  });

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  fetchMore({
    variables: { skip: data.rageQuits.length },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult) return;
      return Object.assign({}, prev, {
        rageQuits: [...prev.rageQuits, ...fetchMoreResult.rageQuits],
      });
    },
  });

  return (
    <ViewDiv>
      <div>
        <PadDiv>
          <h3>Rage Quits</h3>
          <RageList rages={data.rageQuits} />
        </PadDiv>
      </div>
      <BottomNav />
    </ViewDiv>
  );
};

export default Rage;
