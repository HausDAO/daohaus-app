import { FORM } from '../data/forms';

// todo: deafult transfer added to all - sale and transfer
// - sell through daohaus - new sale contract and UI for the -- NEXT
// - will need approve for all step
// 1155 is a differnt send
// standard 721 functions:

// need to override defaults if the menuLabel matches?

// rarible will be just if on rarible supported network then we add some defaults

const nftConfig = {
  '0xcf964c89f509a8c0ac36391c5460df94b91daba5': {
    platform: 'nifty ink',
    creator: 'getNiftyCreator',
    lastPrice: () => null,
    actions: [
      {
        menuLabel: 'Transfer Nifty',
        tooltTipLabel:
          'Make a proposal to tranfer this nft to the applicant address',
        // if needs a form it gets a modal name, otherwise just a tx and the component calls submitTransaction
        modalName: 'transferNifty',
        formLego: FORM.MINION_SEND_NIFTY_ERC721_TOKEN,
        localValues: ['tokenId', 'contractAddress'],
      },
      {
        menuLabel: 'Sell Nifty',
        tooltTipLabel: 'Make a proposal to set a sale price for this nft',
        modalName: 'sellNifty',
        formLego: FORM.LOOT_GRAB,
      },
    ],
  },
};

export const attributeModifiers = Object.freeze({
  getNiftyCreator(nft) {
    const { description } = nft.metadata;
    return description.split(' ')[4];
  },
});

export const hydrateNftCard = nft => {
  const config = nftConfig[nft.contractAddress];
  // TODO: need a better way to do this if it's deeper than 1 level on nft object
  // - maybe searchTerm like in tx gather args?
  // also adding some from the component so this is hard to reason about
  const hydratedActions = config.actions.map(action => {
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
  return {
    ...nft,
    creator: attributeModifiers[config.creator](nft),
    lastPrice: config.lastPrice(nft),
    actions: hydratedActions,
  };
};
