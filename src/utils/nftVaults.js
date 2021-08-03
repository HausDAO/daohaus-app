import { CORE_FORMS } from '../data/forms';

// NEXT STEPS:
// - Rarible default actions - added if on mainnet?
// - daohaus marketplace
// - example without a form modal - just fire  transaction
// - example with a link out to platform
// - move to config to data folder

const defaultConfig = {
  platform: 'unknown',
  fields: {},
  actions: {
    transfer721: {
      menuLabel: 'Transfer NFT',
      tooltTipLabel:
        'Make a proposal to tranfer this nft to the applicant address',
      modalName: 'transfer721',
      formLego: CORE_FORMS.MINION_SEND_ERC721_TOKEN,
      localValues: ['tokenId', 'contractAddress'],
    },
  },
};

const nftConfig = {
  '0xcf964c89f509a8c0ac36391c5460df94b91daba5': {
    platform: 'nifty ink',
    fields: {
      creator: 'getNiftyCreator',
    },
    actions: {
      ...defaultConfig.actions,
      sellNifty: {
        menuLabel: 'Sell Nifty',
        tooltTipLabel:
          'Make a proposal to set the price of the nft on nifty.ink',
        modalName: 'sellNifty',
        formLego: CORE_FORMS.MINION_SELL_NIFTY,
        localValues: ['tokenId', 'contractAddress'],
      },
    },
  },
};

export const attributeModifiers = Object.freeze({
  getNiftyCreator(nft) {
    const { description } = nft.metadata;
    if (!description) {
      return null;
    }
    return description.split(' ')[4];
  },
});

export const hydrateNftCard = nft => {
  const config = nftConfig[nft.contractAddress] || defaultConfig;
  // TODO: need a better way to get passed in values if it's deeper than 1 level on nft object
  // - maybe searchTerm like in tx gather args?
  // - also now adding one from the component so this is a little hard to reason about
  const hydratedActions = Object.keys(config.actions).map(key => {
    const action = config.actions[key];
    const localValues =
      action.localValues &&
      action.localValues.reduce((vals, field) => {
        vals[field] = nft[field];
        return vals;
      }, {});
    return {
      ...action,
      localValues,
    };
  });

  const hydratedFields = Object.keys(config.fields).reduce((fieldObj, key) => {
    const mod = config.fields[key];
    if (!mod) {
      return fieldObj;
    }
    fieldObj[key] = attributeModifiers[mod](nft);
    return fieldObj;
  }, {});

  return {
    ...nft,
    actions: hydratedActions,
    ...hydratedFields,
  };
};

export const concatNftSearchData = nft => {
  return `${nft.name} ${nft.metadata?.name ? nft.metadata?.name : ''} ${
    nft.metadata?.description ? nft.metadata?.description : ''
  }`.toLowerCase();
};
