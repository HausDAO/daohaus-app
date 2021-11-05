import { getNftMeta } from './metadata';

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

export const hydrate1155s = async nfts => {
  return Promise.all(
    nfts.map(async nft => {
      try {
        const { token } = nft;
        const metadata = await getNftMeta(
          token.URI.slice(0, 4) === 'http'
            ? token.URI
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
