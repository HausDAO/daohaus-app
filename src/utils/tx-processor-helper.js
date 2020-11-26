export const txIsUpdated = (tx, entities) => {
  let status = '';
  switch (tx.details.name) {
    case 'sponsorProposal': {
      const entity = entities.find(
        (item) => +item.proposalId === +tx.details.params[0],
      );
      status = entity?.sponsored;
      break;
    }
    case 'processGuildKickProposal':
    case 'processWhitelistProposal':
    case 'processProposal': {
      const entity = entities.find(
        (item) => +item.proposalIndex === +tx.details.params[0],
      );
      status = entity?.processed;
      break;
    }
    case 'submitVote': {
      const entity = entities.find(
        (item) => +item.proposalId === +tx.details.params[0],
      );
      status = entity?.votes.find(
        (vote) =>
          vote.memberAddress.toLowerCase() === tx.details.from.toLowerCase(),
      );
      break;
    }
    case 'submitWhiteListProposal':
    case 'submitGuildKickProposal':
    case 'submitProposal': {
      const entity = entities.find((item) =>
        tx.details.params[7].indexOf(item.hash),
      );
      console.log('entity',entity);
      console.log('tx.details.params[7]',tx.details.params[7]);
      status = entity || null;
      break;
    }
    case 'cancelProposal': {
      const entity = entities.find(
        (item) => +item.proposalId === +tx.details.params[0],
      );
      status = entity?.cancelled;
      break;
    }
    case 'rageQuit': {
      const entity = entities.find();
      status = entity || null;
      break;
    }
    case 'ragekick': {
      const entity = entities.find();
      status = entity || null;
      break;
    }
    case 'withdrawBalance': {
      const entity = entities.find();
      status = entity || null;
      break;
    }
    case 'withdrawBalances': {
      const entity = entities.find();
      status = entity || null;
      break;
    }
    case 'collectTokens': {
      const entity = entities.find();
      status = entity || null;
      break;
    }
  }
  return status;
};
