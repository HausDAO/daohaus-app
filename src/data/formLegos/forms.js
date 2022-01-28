import { CLASSIC_FORMS } from './classics';
import { CORE_FORMS } from './coreForms';
import { CORE_VAULT_FORMS } from './coreVault';
import { CUSTOM_BOOST_INSTALL_FORMS } from './customBoostInstall';
import { DISPERSE_FORMS } from './disperseBoost';
import { FAVOURITE_FORMS } from './favourites';
import { MULTI_FORMS } from './multiForms';
import { NIFTY_INK_FORMS } from './niftyInk';
import { NIFTY_MINION_FORMS } from './niftyMinion';
import { RARIBLE_FORMS } from './raribleForms';
import { SAFE_MINION_FORMS } from './safeMinion';
import { SUPERFLUID_MINION_FORMS } from './superfluid';
import { VANILLA_MINION_FORMS } from './vanillaMinion';

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
