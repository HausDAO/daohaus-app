import React from 'react';
import styled from 'styled-components';
import { pokemolBackground, tablet } from '../../variables.styles';

import DaohausLogo from '../../assets/daohaus__logo--white.png';
import Brand from '../../assets/Pokemol__Logo.png';

const InvalidRouteDiv = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: space-between;
  flex-wrap: wrap;
  .Info {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50%;
    @media (max-width: ${tablet}) {
      width: 100%;
    }
    h2 {
      color: white;
      font-size: 2.5em;
    }
    p {
      color: white;
      font-size: 1.35em;
      font-weight: 700;
    }
    pre {
      color: white;
      font-size: 1.35em;
      white-space: pre-wrap;
    }
    img {
      max-width: 320px;
    }
    .Contents {
      padding: 50px;
      max-width: 800px;
    }
  }
  .Daohaus {
    background-color: #020436;
    background-size: cover;
    background-position: center bottom;
  }
  .Pokemol {
    background-color: ${pokemolBackground};
  }
  .BigLink {
    font-size: 1.5em;
    color: #4ebd9e;
    font-weight: 700;
  }
`;

const InvalidRoute = () => (
  <InvalidRouteDiv>
    <div className="Info Pokemol">
      <div className="Contents">
        <img src={Brand} alt="Pokemol" />
        <h2>Put a Moloch in Your Pocket</h2>
        <p>
          Pokemol is a mobile-first frontend for Moloch daos. If a dao was
          summoned on DAOHaus, you can view, submit and vote on proposals here
          at Pokemol.
        </p>
        <p>Example URL:</p>
        <pre>https://pokemol.com/dao/{'{dao contract address}'}</pre>
      </div>
    </div>
    <div className="Info Daohaus">
      <div className="Contents">
        <img src={DaohausLogo} alt="Daohaus" />
        <h2>Looking for a Dao?</h2>
        <p>Discover and pledge to existing Moloch daos, or Summon your own.</p>
        <a className="BigLink" href="https://daohaus.club/">
          Go to Daohaus ->
        </a>
        <p>
          If a dao was recently summoned, it can take a few minutes. If you
          think there may be an issue with your dao, visit us in our Telegram
          Support Goup.
        </p>
        <a
          className="BigLink"
          href="https://t.me/joinchat/IJqu9xeMfqWoLnO_kc03QA"
          rel="noopener noreferrer"
          target="_blank"
        >
          Telegram Support ->
        </a>
      </div>
    </div>
  </InvalidRouteDiv>
);

export default InvalidRoute;
