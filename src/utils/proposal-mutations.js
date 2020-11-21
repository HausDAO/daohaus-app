export const proposalMutation = (proposals, options) => {
  console.log('mutate proposals', options);
  switch (options.name) {
    case 'submitVote': {
      // proposalIndex, uintVote
      console.log('proposals', proposals);
      console.log('params 0', options.params[0]);
      const proposalIndex = proposals.findIndex(
        (proposal) => +proposal.proposalId === +options.params[0],
      );
      console.log('index', proposalIndex);
      console.log('prop', proposals[proposalIndex]);

      const vote = {
        createdAt: Date.now(),
        id: 'temp',
        memberaddress: options.from,
        uintVote: options.params[1],
      };
      proposals[proposalIndex].votes.push(vote);
      console.log('new props', proposals);
      return proposals;

    }
    case 'sponsorProposal': {
      // proposalIndex, uintVote
      console.log('proposals', proposals);
      console.log('params 0', options.params[0]);
      const proposalIndex = proposals.findIndex(
        (proposal) => +proposal.proposalId === +options.params[0],
      );
      console.log('index', proposalIndex);
      console.log('prop', proposals[proposalIndex]);
      proposals[proposalIndex].sponsored = true;
      proposals[proposalIndex].sponsoredAt = Date.now();
      //  sponsored: true
      //  sponsoredAt: null
      console.log('new props', proposals);
      return proposals;
    }
    default: {
      return proposals;
    }
  }
};
