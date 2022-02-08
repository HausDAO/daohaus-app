// import {
//   checkDuplicateKeys,
//   checkRequiredFields,
//   validateLegos,
// } from '../../utils/legos';

import { CLASSIC_FORMS } from './classics';
import { CORE_FORMS } from './coreForms';
import { CORE_VAULT_FORMS } from './coreVaultForms';
import { CUSTOM_BOOST_INSTALL_FORMS } from './customBoostInstall';
import { DISPERSE_FORMS } from './disperseBoostForms';
import { FAVOURITE_FORMS } from './favourites';
import { MULTI_FORMS } from './multiForms';
import { NIFTY_INK_FORMS } from './niftyInkForms';
import { NIFTY_MINION_FORMS } from './niftyMinionForms';
import { RARIBLE_FORMS } from './raribleForms';
import { SAFE_MINION_FORMS } from './safeMinionForms';
import { SUPERFLUID_MINION_FORMS } from './superfluidForms';
import { VANILLA_MINION_FORMS } from './vanillaMinionForms';

// TEST LEGOS BEFORE PUSHING TO DEVELOP

// Step 1. Uncomment
// Step 2. Manually refresh browser

// export const testedFORMS = validateLegos({
//   collections: [
//     CLASSIC_FORMS,
//     CORE_FORMS,
//     CORE_VAULT_FORMS,
//     CUSTOM_BOOST_INSTALL_FORMS,
//     DISPERSE_FORMS,
//     FAVOURITE_FORMS,
//     MULTI_FORMS,
//     NIFTY_INK_FORMS,
//     NIFTY_MINION_FORMS,
//     RARIBLE_FORMS,
//     SAFE_MINION_FORMS,
//     SUPERFLUID_MINION_FORMS,
//     VANILLA_MINION_FORMS,
//   ],
//   plugins: [checkDuplicateKeys],
// });

export const FORM = {
  ...CLASSIC_FORMS,
  ...CORE_FORMS,
  ...CORE_VAULT_FORMS,
  ...CUSTOM_BOOST_INSTALL_FORMS,
  ...DISPERSE_FORMS,
  ...FAVOURITE_FORMS,
  ...MULTI_FORMS,
  ...NIFTY_INK_FORMS,
  ...NIFTY_MINION_FORMS,
  ...RARIBLE_FORMS,
  ...SAFE_MINION_FORMS,
  ...SUPERFLUID_MINION_FORMS,
  ...VANILLA_MINION_FORMS,
};
