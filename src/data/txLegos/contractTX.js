// import {
//   checkDuplicateKeys,
//   checkRequiredFields,
//   validateLegos,
// } from '../../utils/legos';

import { BUYOUT_BOOST_TX } from './buyoutBoostTX';
import { DISPERSE_BOOST_TX } from './disperseBoostTX';
import { ESCROW_MINION_TX } from './escrowMinionTX';
import { MINION_TX } from './minionTX';
import { MOLOCH_TX } from './molochTX';
import { NIFTYINK_BOOST_TX } from './niftyInkBoostTX';
import { NIFTY_MINION_TX } from './niftyMinionTX';
import { RARIBLE_BOOST } from './raribleBoostTX';
import { SAFE_MINION_TX } from './safeMinionTX';
import { SUPERFLUID_MINION_TX } from './superfluidMinionTx';
import { SWAPR_BOOST_TX } from './swaprBoostTx';
import { TOKEN_TX } from './tokenTX';
import { VAULT_TRANSFER_TX } from './transferContractTX';
import { WRAPNZAP_BOOST_TX } from './wrapNzapBoostTX';
import { POSTER_BOOST_TX } from './posterBoostTX';
import { MOLOCH_TOKEN_FACTORY_TX } from './molochTokenTX';
// import { SBT_TX } from './sbtTX';
import { HEDGEY_CONTRIBUTOR_REWARDS_BOOST_TX } from './hedgeyContributorRewardsBoostTX';

// TEST LEGOS BEFORE PUSHING TO DEVELOP

// const TX_REQUIRED = ['name', 'contract', 'errMsg', 'successMsg'];

// export const testedTX = validateLegos({
//   collections: [
//     MOLOCH_TX,
//     MINION_TX,
//     ESCROW_MINION_TX,
//     NIFTY_MINION_TX,
//     SAFE_MINION_TX,
//     SUPERFLUID_MINION_TX,
//     VAULT_TRANSFER_TX,
//     WRAPNZAP_BOOST_TX,
//     NIFTYINK_BOOST_TX,
//     RARIBLE_BOOST,
//     BUYOUT_BOOST_TX,
//     DISPERSE_BOOST_TX,
//     TOKEN_TX,
//   ],
//   plugins: [
//     checkDuplicateKeys,
//     checkRequiredFields({ typeModel: TX_REQUIRED, typeName: 'TX' }),
//   ],
// });

export const TX = {
  ...MOLOCH_TX,
  ...MINION_TX,
  ...ESCROW_MINION_TX,
  ...NIFTY_MINION_TX,
  ...SAFE_MINION_TX,
  ...SUPERFLUID_MINION_TX,
  ...VAULT_TRANSFER_TX,
  ...WRAPNZAP_BOOST_TX,
  ...NIFTYINK_BOOST_TX,
  ...RARIBLE_BOOST,
  ...BUYOUT_BOOST_TX,
  ...DISPERSE_BOOST_TX,
  ...TOKEN_TX,
  ...SWAPR_BOOST_TX,
  ...POSTER_BOOST_TX,
  ...MOLOCH_TOKEN_FACTORY_TX,
  ...HEDGEY_CONTRIBUTOR_REWARDS_BOOST_TX,
};
