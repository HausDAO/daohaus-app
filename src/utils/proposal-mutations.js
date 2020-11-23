export const proposalMutation = (proposals, options) => {
  console.log('mutate proposals', options);
  switch (options.name) {
    case 'submitVote': {
      // proposalIndex, uintVote
      const now = new Date();
      console.log('params 0', options.params[0]);
      const proposalIndex = proposals.findIndex(
        (proposal) => +proposal.proposalIndex === +options.params[0],
      );
      console.log('index', proposalIndex);
      console.log('prop', proposals[proposalIndex]);

      const vote = {
        createdAt: Math.round(now.getTime() / 1000).toString(),
        id: 'temp',
        memberaddress: options.from.toLowerCase(),
        uintVote: options.params[1],
      };
      console.log('update vote with', vote);
      if (options.params[1] === 1) {
        proposals[proposalIndex].yesVotes = (
          proposals[proposalIndex].yesVotes + 1
        ).toString();
      } else {
        proposals[proposalIndex].noVotes = (
          proposals[proposalIndex].noVotes + 1
        ).toString();
      }
      proposals[proposalIndex].votes.push(vote);
      proposals[proposalIndex].title = 'UPdated';

      console.log('new props', proposals);
      return proposals;
    }
    case 'sponsorProposal': {
      // proposalIndex, uintVote
      const now = new Date();
      console.log('proposals', proposals);
      console.log('params 0', options.params[0]);
      const proposalIndex = proposals.findIndex(
        (proposal) => +proposal.proposalId === +options.params[0],
      );
      console.log('index', proposalIndex);
      console.log('prop', proposals[proposalIndex]);
      proposals[proposalIndex].status = 'InQueue';
      proposals[proposalIndex].sponsored = true;
      proposals[proposalIndex].sponsoredAt = Math.round(
        now.getTime() / 1000,
      ).toString();
      proposals[proposalIndex].title = 'UPdated';
      //  sponsored: true
      //  sponsoredAt: null
      proposals[proposalIndex].votingPeriodStarts = Math.round(
        now.getTime() / 1000,
      ).toString();
      proposals[proposalIndex].votingStarts = 1;
      console.log('new props', proposals);
      return proposals;
    }
    default: {
      return proposals;
    }
  }
};
