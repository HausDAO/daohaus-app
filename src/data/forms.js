import { CLASSIC_FORMS } from './formLegos/classics';
import { CORE_FORMS } from './formLegos/coreForms';
import { CORE_VAULT_FORMS } from './formLegos/coreVault';
import { CUSTOM_BOOST_INSTALL_FORMS } from './formLegos/customBoostInstall';
import { DISPERSE_FORMS } from './formLegos/disperseBoost';
import { FAVOURITE_FORMS } from './formLegos/favourites';
import { MULTI_FORMS } from './formLegos/multiForms';
import { NIFTY_INK_FORMS } from './formLegos/niftyInk';
import { NIFTY_MINION_FORMS } from './formLegos/niftyMinion';
import { RARIBLE_FORMS } from './formLegos/raribleForms';
import { SAFE_MINION_FORMS } from './formLegos/safeMinion';
import { SUPERFLUID_MINION_FORMS } from './formLegos/superfluid';
import { VANILLA_MINION_FORMS } from './formLegos/vanillaMinion';
import { ESCROW_MINION_TX } from './txLegos/escrowMinionTX';

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
