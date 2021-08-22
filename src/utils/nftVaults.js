import { CORE_FORMS, FORM } from '../data/forms';
import { getMinionActionFormLego } from './vaults';

// NEXT STEPS:
// - Rarible default actions - added if on mainnet?
// - daohaus marketplace
// - example without a form modal - just fire  transaction
// - example with a link out to platform
// - move to config to data folder

const defaultConfig = {
  platform: 'unknown',
  fields: {
    image: 'getMetadataImage',
  },
  actions: {
    transfer721: {
      menuLabel: 'Transfer NFT',
      tooltTipLabel:
        'Make a proposal to tranfer this nft to the applicant address',
      modalName: 'transfer721',
      formLego: CORE_FORMS.MINION_SEND_ERC721_TOKEN,
      localValues: ['tokenId', 'contractAddress'],
      minionTypeOverride: true,
    },
    // REVIEW: Should this be under nftConfigs or default config?
    sellRarible: {
      menuLabel: 'Sell NFT on Rarible',
      tooltTipLabel: 'Make a proposal to sell this nft on Rarible',
      modalName: 'sell721',
      formLego: FORM.SELL_NFT_RARIBLE,
      localValues: ['tokenId', 'contractAddress'],
      minionTypeOverride: false,
    },
  },
};

const nftConfigs = {
  '0xcf964c89f509a8c0ac36391c5460df94b91daba5': {
    platform: 'nifty ink',
    fields: {
      ...defaultConfig.fields,
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
        minionTypeOverride: true,
      },
    },
  },
};

export const attributeModifiers = Object.freeze({
  getMetadataImage(nft) {
    return nft.metadata.image_url ? nft.metadata.image_url : nft.metadata.image;
  },
  getNiftyCreator(nft) {
    const { description } = nft.metadata;
    if (!description) {
      return null;
    }
    return description.split(' ')[4];
  },
});

export const hydrateNftCard = (nft, minionType) => {
  const config = nftConfigs[nft.contractAddress] || defaultConfig;

  const hydratedActions = Object.keys(config.actions).map(key => {
    const action = config.actions[key];
    const localValues =
      action.localValues &&
      action.localValues.reduce((vals, field) => {
        vals[field] = nft[field];
        return vals;
      }, {});
    let { formLego } = action;
    if (action.minionTypeOverride) {
      formLego = getMinionActionFormLego('erc721', minionType);
    }
    return {
      ...action,
      formLego,
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
