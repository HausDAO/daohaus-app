import React, { useContext, useState } from 'react';
import { Button, Box } from '@chakra-ui/core';
import { PokemolContext } from '../../contexts/PokemolContext';
import BrandOverride from '../../assets/themes/raidTheme/raidguild__avatar--pink.jpg';
import { HUB_MEMBERSHIPS } from '../../utils/queries/hub-queries';
import GraphFetch from '../../components/shared/GraphFetch';
import MemberDaoList from '../../components/hub/MemberDaoList';

const Hub = () => {
  const { state, dispatch } = useContext(PokemolContext);
  const [memberDaos, setMemberDaos] = useState();

  const setTheme = () => {
    dispatch({
      type: 'setTheme',
      payload: {
        brand50: '#ff4d74',
        brand100: '#ff4d74',
        brand200: '#ff4d74',
        brand300: '#ff4d74',
        brand400: '#fe1d5b',
        brand500: '#e50651',
        brand600: '#e50651',
        brand700: '#e50651',
        brand800: '#e50651',
        brand900: '#e50651',
        brandImg: BrandOverride,
        bg400: '#000',
      },
    });
  };

  const setDefault = () => {
    dispatch({
      type: 'clearTheme',
    });
  };

  return (
    <Box p="5">
      <p>i am HUB content</p>
      <Button onClick={setTheme}> PRETEND DAO BUTTON</Button>
      <Button onClick={setDefault}> DEFAULT</Button>

      {state.user && state.user.username ? (
        <GraphFetch
          query={HUB_MEMBERSHIPS}
          setRecords={setMemberDaos}
          entity="members"
          variables={{ memberAddress: state.user.username }}
        />
      ) : null}

      {memberDaos ? (
        <MemberDaoList
          daos={memberDaos.members.map((member) => member.moloch)}
        />
      ) : null}
    </Box>
  );
};

export default Hub;
