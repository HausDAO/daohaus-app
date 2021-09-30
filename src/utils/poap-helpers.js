import { fetchPoapAddresses } from './theGraph';

export const getFormattedOwnersByPaopId = async poapId => {
  const res = await fetchPoapAddresses({
    eventId: poapId,
  });

  const tokens = res?.event?.tokens || [];

  console.log('tokens', tokens.length);

  const formattedOwners = tokens.reduce((strg, token) => {
    strg += `${token.owner.id} 2\n`;
    return strg;
  }, '');

  return formattedOwners.slice(0, -1);
};

export const banners = {
  hausPartyFavors: {
    headline: 'This is a Haus Party Favor DAO!',
    linkText: 'Claim your favors',
    path: 'party-favor',
  },
};
