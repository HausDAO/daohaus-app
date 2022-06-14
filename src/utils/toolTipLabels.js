export const TIP_LABELS = {
  MINION_PROPOSAL: {
    title: 'Minion Proposal',
    pars: [
      'This Proposal was created by a minion.',
      "To perform the minion's action, hit the 'Execute' button after processing the proposal",
    ],
  },
  FUNDING_MINION_PROPOSAL: {
    title: 'Funding Proposal',
    pars: ['This Proposal sends funds to a minion.'],
  },
};

export const generateSFLabels = proposal => {
  try {
    const tokenRate = JSON.parse(proposal?.details)?.tokenRate;
    return {
      title: 'Superfluid Proposal',
      pars: tokenRate
        ? [
            'This Minion will execute an agreement using Superfluid Protocol.',
            'Constant Flow Agreement',
            `Rate: ${tokenRate}`,
          ]
        : [],
    };
  } catch (error) {
    console.error('Could not parse details.tokenRate rate from JSON');
    return {
      title: 'Superfluid Proposal',
      body: 'This Minion will execute an agreement using Superfluid Protocol.',
    };
  }
};

export const SF_LABEL = {
  GUILDKICK: {
    title: 'GUILDKICK ALERT',
    body:
      'An unexpected cancelation of a stream would be punished with you being removed from the DAO.',
  },
  LIQUIDATED: {
    title: 'LIQUIDATED',
    body: 'This stream has been liquidated due as the minion run out of funds.',
  },
  PROPOSAL: {
    title: 'STREAM PROPOSAL',
    body: 'You can cancel this stream before the proposal voting period ends.',
  },
  WITHDRAW: {
    body:
      'Outstanding balance will be downgraded and sent back to the DAO treasury',
  },
  UPGRADE: {
    body:
      'This action will request token funds from the DAO treasury so they can be conveted into Supertoken for streaming',
  },
  REGISTER: {
    title: 'IMPORTANT',
    pars: [
      'Token is not yet registered.',
      'Please do it by following this link, otherwise stream recipients will not be able to view/withdraw their funds through the Superflud Dashboard.',
    ],
  },
  TOKEN_BALANCES: {
    body:
      'To fund the Superfluid Minion you need to make a funding proposal from the DAO to the minion. Do not send tokens directly.',
  },
  CANCEL_STREAM: {
    body: 'This action will send a DAO proposal to cancel the stream',
  },
};
