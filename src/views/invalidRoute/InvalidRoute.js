import React from 'react';

import DaohausLogo from '../../assets/daohaus__logo--white.png';
import Brand from '../../assets/Pokemol__Logo.png';

const InvalidRoute = () => (
  <div className="Row InvalidRoute">
    <div className="Column Column--50 Info Info--Pokemol">
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
    <div className="Column Column--50 Info Info--Daohaus">
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
        >
          Telegram Support ->
        </a>
      </div>
    </div>
  </div>
);

export default InvalidRoute;
