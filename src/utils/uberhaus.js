// TODO: do this better. maybe a global constant for now until we have more ubers?
export const UBERHAUS_NETWORK = '0x2a';
export const UBERHAUS_ADDRESS = '0x96714523778e51b898b072089e5615d4db71078e';
export const UBERHAUS_STAKING_TOKEN =
  '0xAb5cC910998Ab6285B4618562F1e17f3728af662';
export const UBERHAUS_STAKING_TOKEN_SYMBOL = 'fHAUS';
// CHANGE TO 500 when xdai for real
export const UBERHAUS_MINION_REWARDS_FACTOR = '10';

export const TEMP_SUBMIT_PROPOSAL_ABI = {
  constant: false,
  inputs: [
    {
      name: 'applicant',
      type: 'address',
    },
    {
      name: 'sharesRequested',
      type: 'uint256',
    },
    {
      name: 'lootRequested',
      type: 'uint256',
    },
    {
      name: 'tributeOffered',
      type: 'uint256',
    },
    {
      name: 'tributeToken',
      type: 'address',
    },
    {
      name: 'paymentRequested',
      type: 'uint256',
    },
    {
      name: 'paymentToken',
      type: 'address',
    },
    {
      name: 'details',
      type: 'string',
    },
  ],
  name: 'submitProposal',
  outputs: [
    {
      name: 'proposalId',
      type: 'uint256',
    },
  ],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function',
};
