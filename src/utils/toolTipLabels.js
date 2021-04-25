export const TIP_LABELS = {
  UBER_PROPOSAL: {
    title: 'Uber Proposal',
    pars: [
      'This Proposal was created by an UberHaus Minion.',
      'To perform the minion\'s action, hit the \'Execute\' button after processing the proposal',
    ],
  },
  MINION_PROPOSAL: {
    title: 'Minion Proposal',
    pars: [
      'This Proposal was created by a minion.',
      'To perform the minion\'s action, hit the \'Execute\' button after processing the proposal',
    ],
  },
};

export const generateSFLabels = (proposal) => {
  try {
    const tokenRate = JSON.parse(proposal?.details)?.tokenRate;
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
