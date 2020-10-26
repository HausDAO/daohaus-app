import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import makeBlockie from 'ethereum-blockies-base64';
import { Avatar, Box, Flex, Link as ChLink } from '@chakra-ui/core';

const MemberDaoList = ({ daos }) => {
  const [visibleDaos, setVisibleDaos] = useState([]);

  useEffect(() => {
    const firstDaos = [...daos];

    setVisibleDaos(firstDaos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderDaoAvatar = (dao) => {
    const recentRages = dao.rageQuits.filter((rage) => {
      // 1209600000 === 2 weeks
      const now = (new Date() / 1000) | 0;
      return +rage.createdAt >= now - 1209600;
    });
    const recentProposals = dao.proposals.filter((prop) => {
      return prop.activityFeed.unread;
    });
    const healthCount = recentRages.length + recentProposals.length;

    return (
      <div key={dao.id}>
        <Link to={`/dao/${dao.id}`}>
          <Avatar name={dao.title} src={makeBlockie(dao.id)} />
          {healthCount ? <span>{healthCount}</span> : null}
          <p>{dao.title.substr(0, 1)}</p>
          <p>{dao.title}</p>
        </Link>
      </div>
    );
  };

  const handleChange = (event) => {
    if (event.target.value) {
      const resultDaos = daos.filter((dao) => {
        return (
          dao.title.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
        );
      });
      setVisibleDaos(resultDaos);
    } else {
      setVisibleDaos(daos);
    }
  };

  const canSearch = daos.length > 5;

  return (
    <Box maxW="500px">
      <h4>Member of {daos.length} DAOs</h4>

      {canSearch ? (
        <div>
          <input
            type="search"
            className="input"
            placeholder="Search Daos"
            onChange={(e) => handleChange(e)}
          />
        </div>
      ) : null}

      <Flex direction="row" overflow="scroll">
        {visibleDaos.map((dao) => renderDaoAvatar(dao))}
      </Flex>

      <ChLink href="https://daohaus.club" isExternal>
        Explore more daos on daohaus
      </ChLink>
    </Box>
  );
};

export default MemberDaoList;
