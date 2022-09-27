import { getNftMeta } from './metadata';
import { MINIONS } from '../data/minions';
import { FORM } from '../data/formLegos/forms';

export const nftSortOptions = [
  {
    name: 'Value',
    value: 'value',
  },
  {
    name: 'Date Created',
    value: 'dateCreated',
  },
  {
    name: 'Expiring Auctions',
    value: 'expiringAuctions',
  },
];

export const nftFilterOptions = [
  // {
  //   name: 'For Sale',
  //   value: 'forSale',
  //   type: 'main',
  // },
  // {
  //   name: 'Has Offer',
  //   value: 'hasOffer',
  //   type: 'main',
  // },
];

export const NFT_ACTIONS = {
  TRANSFER: {
    menuLabel: 'Transfer NFT',
    tooltTipLabel:
      'Make a proposal to tranfer this nft to the applicant address',
    modalName: 'transfer',
    localValues: ['tokenId', 'contractAddress', 'tokenBalance'],
  },
  SELL_NIFTY: {
    menuLabel: 'Sell Nifty',
    tooltTipLabel: 'Make a proposal to set the price of the nft on nifty.ink',
    modalName: 'sellNifty',
    localValues: ['tokenId', 'contractAddress'],
    networks: { '0x64': true },
    nftContractAddress: '0xcf964c89f509a8c0ac36391c5460df94b91daba5',
    nftTypeOverride: 'sellNifty',
  },
  SELL_RARIBLE: {
    menuLabel: 'Sell on Rarible',
    tooltTipLabel: 'Make a proposal to create a sell order on Rarible',
    modalName: 'sellRarible',
    localValues: ['tokenId', 'contractAddress', 'tokenBalance'],
    networks: { '0x1': true },
    nftTypeOverride: 'sellRarible',
    formLego: FORM.SELL_NFT_RARIBLE,
  },
};

export const getNftCardActions = (minionType, nft, chainId) => {
  const actions = MINIONS[minionType].nftActions;

  return actions.filter(action => {
    const contractMatch =
      !action.nftContractAddress ||
      action.nftContractAddress.toLowerCase() ===
        nft.contractAddress.toLowerCase();
    const networkMatch = !action.networks || action.networks[chainId];
    return contractMatch && networkMatch;
  });
};

export const hydrate721s = async nfts => {
  return Promise.all(
    nfts.map(async nft => {
      try {
        const metadata = await getNftMeta(
          `https://daohaus.mypinata.cloud/ipfs/${nft.uri.match(
            /Qm[a-zA-Z0-9]+/,
          )}`,
        );
        return {
          contractAddress: nft.id.match(/0x[a-fA-F0-9]{40}/g)[0],
          tokenId: nft.identifier,
          symbol: nft.registry.symbol,
          name: nft.registry.name,
          tokenUri: nft.uri,
          metadata,
          image:
            metadata.image.slice(0, 4) === 'http'
              ? metadata.image
              : `https://daohaus.mypinata.cloud/ipfs/${metadata.image.match(
                  /Qm[a-zA-Z0-9/.]+/,
                )}`,
          type: 'ERC-721',
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    }),
  );
};

const hasUriAndIdentifer = token =>
  token?.URI?.includes('0x{id}') && token?.identifier;

export const hydrate1155s = async nfts => {
  return Promise.all(
    nfts.map(async nft => {
      try {
        const { token } = nft;
        const urlToFetch = hasUriAndIdentifer(token)
          ? token.URI.replace('0x{id}', token.identifier)
          : token.URI;

        const metadata = await getNftMeta(
          token.URI.slice(0, 4) === 'http'
            ? urlToFetch
            : `https://daohaus.mypinata.cloud/ipfs/${token.URI.match(
                /Qm[a-zA-Z0-9]+/,
              )}`,
        );
        return {
          contractAddress: token.id.match(/0x[a-fA-F0-9]{40}/g)[0],
          tokenId: token.identifier,
          symbol: token.symbol,
          name: token.name,
          tokenUri: token.URI,
          metadata,
          image:
            metadata.image.slice(0, 4) === 'http'
              ? metadata.image
              : `https://daohaus.mypinata.cloud/ipfs/${metadata.image.match(
                  /Qm[a-zA-Z0-9/.]+/,
                )}`,
          type: 'ERC-1155',
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    }),
  );
};

const nftDefaultConfig = {
  platform: 'unknown',
  fields: {
    image: 'hydrateImageURI',
  },
};

const nftConfigs = {
  '0xcf964c89f509a8c0ac36391c5460df94b91daba5': {
    platform: 'nifty ink',
    fields: {
      ...nftDefaultConfig.fields,
      creator: 'getNiftyCreator',
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
  hydrateImageURI(nft) {
    if (nft.image?.match(/^ipfs:\/\/(Qm[a-zA-Z0-9]+)/)) {
      return `https://daohaus.mypinata.cloud/ipfs/${
        nft.image.match(/^ipfs:\/\/(Qm[a-zA-Z0-9]+)/)[1]
      }`;
    }
    return nft.image;
  },
});

export const hydrateNftCard = nft => {
  const config = nftConfigs[nft.contractAddress] || nftDefaultConfig;
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
    ...hydratedFields,
  };
};

export const concatNftSearchData = nft => {
  return `${nft.name} ${nft.metadata?.name ? nft.metadata?.name : ''} ${
    nft.metadata?.description ? nft.metadata?.description : ''
  }`.toLowerCase();
};

export const filterUniqueNfts = (
  daoVaults,
  minionAddress = null,
  minionType = null,
) => {
  return daoVaults
    ?.filter(vault => !minionType || vault.minionType === minionType)
    .reduce((acc, item) => {
      const nftsWithMinionAddress = item.nfts.map(n => {
        return {
          ...n,
          minionAddress: minionAddress || item.address,
          minionType: item.minionType,
        };
      });
      return [...acc, ...nftsWithMinionAddress];
    }, [])
    .reduce((acc, nft) => {
      if (
        !acc.find(
          n =>
            n.contractAddress === nft.contractAddress &&
            n.tokenId === nft.tokenId,
        )
      ) {
        acc = [...acc, nft];
      }
      return acc;
    }, []);
};
