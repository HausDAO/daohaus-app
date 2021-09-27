import { fetchPoapAddresses } from './theGraph';

export const getFormattedOwnersByPaopId = async poapId => {
  const res = await fetchPoapAddresses({
    eventId: poapId,
  });

  const formattedOwners = res.event.tokens.reduce((strg, token) => {
    strg += `${token.owner.id} 2\n`;
    return strg;
  }, '');

  return formattedOwners.slice(0, -1);
};
