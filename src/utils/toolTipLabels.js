// TOOLTIP MODEL

// {
// title: String,
// pars: Array of strings,
// body: String
// }

export const TIP_LABELS = {
  UBER_PROPOSAL: {
    title: 'Uber Proposal',
    pars: [
      'This UberHAUS Staking Proposal is delegated through a Minion.',
      'Once the proposal is executed, it is voted on in the uberHAUS DAO. (Click to visit)',
    ],
  },
};

export const generateSFLabels = (proposalDetails) => {
  try {
    const tokenRate = JSON.parse(proposalDetails)?.tokenRate;

    return {
      title: 'Superfluid Proposal',
      pars: [
        'This Minion will execute an agreement using Superfluid Protocol.',
        'Constant Flow Agreement',
        `Rate: ${tokenRate}`,
      ],
    };
  } catch (error) {
    console.error('Could not parse details.tokenRate rate from JSON');
    return {
      title: 'Superfluid Proposal',
      body: 'This Minion will execute an agreement using Superfluid Protocol.',
    };
  }
};
