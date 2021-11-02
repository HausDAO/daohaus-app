import { getNftMeta } from './metadata';

export const hydrateNfts = async (nfts, type) => {
  return Promise.all(
    nfts.map(async nft => {
      const metadata = await getNftMeta(
        `https://daohaus.mypinata.cloud/ipfs/${nft.uri.match(
          /Qm[a-zA-Z0-9]+/,
        )}`,
      );
      return {
        contractAddress: nft.id.match(/0x[a-fA-F0-9]{40}/g),
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
        type,
      };
    }),
  );
};
