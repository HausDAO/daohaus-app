export const setProposaltxLock = (proposals, options) => {
  switch (options.name) {
    case 'submitVote': {
      // proposalIndex, uintVote
      const proposalIndex = proposals.findIndex(
        (proposal) => +proposal.proposalIndex === +options.params[0],
      );
      proposals[proposalIndex].txLock = true;
      return proposals;
    }
    case 'sponsorProposal': {
      // proposalId, uintVote;
      const proposalIndex = proposals.findIndex(
        (proposal) => +proposal.proposalId === +options.params[0],
      );
      proposals[proposalIndex].txLock = true;
      return proposals;
    }
    case 'submitProposal': {
      // proposalIndex, uintVote
      const proposal = {
        title: 'TEST UPDATEzzz',
      };
      proposals.push(proposal);
      return proposals;
    }
    default: {
      return proposals;
    }
  }
};

// Not used
export const mutateProposal = (proposals, options) => {
  switch (options.name) {
    case 'submitVote': {
      // proposalIndex, uintVote
      const now = new Date();
      const proposalIndex = proposals.findIndex(
        (proposal) => +proposal.proposalIndex === +options.params[0],
      );
      const vote = {
        createdAt: Math.round(now.getTime() / 1000).toString(),
        id: 'temp',
        memberaddress: options.from.toLowerCase(),
        uintVote: options.params[1],
      };
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
      return proposals;
    }
    case 'sponsorProposal': {
      // proposalIndex, uintVote;
      const now = new Date();
      const proposalIndex = proposals.findIndex(
        (proposal) => +proposal.proposalId === +options.params[0],
      );
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
      return proposals;
    }
    case 'submitProposal': {
      // proposalIndex, uintVote
      const proposal = {
        title: 'TEST UPDATEzzz',
      };
      proposals.push(proposal);
      return proposals;
    }
    default: {
      return proposals;
    }
  }
};
