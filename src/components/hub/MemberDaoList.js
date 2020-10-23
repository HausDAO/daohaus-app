import React, { useEffect, useState } from 'react';
import makeBlockie from 'ethereum-blockies-base64';

// import supportedChains from '../../util/chains';

// const chainData = supportedChains[+process.env.REACT_APP_NETWORK_ID];

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
      // return prop.activityFeed.unread;
      return true;
    });
    const healthCount = recentRages.length + recentProposals.length;

    return (
      <div key={dao.id}>
        <a
          // href={`${chainData.pokemol_url}/dao/${dao.id}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <div
            style={{
              backgroundImage: `url("${makeBlockie(dao.id)}")`,
            }}
          >
            {healthCount ? <span>{healthCount}</span> : null}
            <p>{dao.title.substr(0, 1)}</p>
          </div>
          <p>{dao.title}</p>
        </a>
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
    <div>
      <div>
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
      </div>

      <div>{visibleDaos.map((dao) => renderDaoAvatar(dao))}</div>
    </div>
  );
};

export default MemberDaoList;
