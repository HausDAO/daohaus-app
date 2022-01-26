// TX = {
//   contract: String
//   poll: String (Optional)(Defaults to name)
//   name: String
//   errMsg: String
//   onTxHash: {}Strings
//   successMsg: String
// }

import {
  checkDuplicateKeys,
  checkRequiredFields,
  validateLegos,
} from '../utils/legos';
import { BUYOUT_BOOST_TX } from './buyoutBoostTX';
import { DISPERSE_BOOST_TX } from './disperseBoostTX';
import { ESCROW_MINION_TX } from './escrowMinionTX';
import { MINION_TX } from './minionTX';
import { MOLOCH_TX } from './molochTX';
import { NIFTYINK_BOOST_TX } from './niftyInkBoostTX';
import { NIFTY_MINION_TX } from './niftyMinionTx';
import { RARIBLE_BOOST } from './raribleBoostTX';
import { SAFE_MINION_TX } from './safeMinionTx';
import { SUPERFLUID_MINION_TX } from './superfluidMinionTx';
import { TOKEN_TX } from './tokenTX';
import { VAULT_TRANSFER_TX } from './transferContractTx';
import { UBER_MINION_TX } from './uberMinionTx';
import { WRAPNZAP_BOOST_TX } from './wrapNzapBoost';

// this was causing a site crash - used for iniitialization
// import { HASH } from '../utils/general';

const TX_REQUIRED = ['name', 'contract', 'errMsg', 'successMsg'];

export const TX = validateLegos({
  collections: [
    MOLOCH_TX,
    MINION_TX,
    ESCROW_MINION_TX,
    NIFTY_MINION_TX,
    SAFE_MINION_TX,
    SUPERFLUID_MINION_TX,
    VAULT_TRANSFER_TX,
    UBER_MINION_TX,
    WRAPNZAP_BOOST_TX,
    NIFTYINK_BOOST_TX,
    RARIBLE_BOOST,
    BUYOUT_BOOST_TX,
    DISPERSE_BOOST_TX,
    TOKEN_TX,
  ],
  plugins: [
    checkDuplicateKeys,
    checkRequiredFields({ typeModel: TX_REQUIRED, typeName: 'TX' }),
  ],
});
