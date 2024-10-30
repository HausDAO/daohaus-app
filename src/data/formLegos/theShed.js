//  Repository for old forms that might still be used

// const NOT_USED = {
//   LOOT_GRAB: {
//     id: 'LOOT_GRAB',
//     title: 'Loot Grab proposal',
//     description: 'Trade ERC-20s for DAO loot',
//     required: ['tributeOffered'],
//     tx: TX.LOOT_GRAB_PROPOSAL,
//     fields: [[FORM_DISPLAY.LOOT_REQUEST, FIELD.TRIBUTE]],
//   },
// };

// export const STEPPER_FORMS = {
//   CERAMIC_AUTH: {
//     type: 'buttonAction',
//     id: 'CERAMIC_AUTH',
//     title: 'IDX Connect',
//     btnText: 'Connect',
//     btnLabel: 'Connect to Ceramic',
//     btnLoadingText: 'Connecting',
//     btnNextCallback: values => {
//       return values?.ceramicDid;
//     },
//     btnCallback: async (setValue, setLoading, setFormState) => {
//       setLoading(true);
//       try {
//         const [client, did] = await authenticateDid(
//           window.ethereum.selectedAddress,
//         );
//         setValue('ceramicClient', client);
//         setValue('ceramicDid', did);
//         setFormState('connected');
//       } catch (err) {
//         console.error(err);
//       }
//       setFormState('failed');
//       setLoading(false);
//     },
//   },
// };
// const swapTX = buildMultiTxAction({
//   actions: [
//     {
//       targetContract: '.values.tokenAddress',
//       abi: CONTRACTS.ERC_20,
//       fnName: 'approve',
//       args: ['.contextData.chainConfig.swapr.staking', '.values.amount'],
//     },
//     {
//       targetContract: '.contextData.chainConfig.swapr.staking',
//       abi: CONTRACTS.SWAPR_STAKING,
//       logTX: true,
//       fnName: 'stake',
//       args: ['.values.amount'],
//     },
//   ],
// });

// export const SWAPR_BOOST_FORMS = {
//   SWAPR_STAKE: {
//     id: 'SWAPR_STAKE',
//     dev: true,
//     title: 'Swapr Staking Proposal',
//     description: 'Stake Minion Funds into a Swapr farm.',
//     type: PROPOSAL_TYPES.SWAPR_STAKING,
//     // tx: TX.SUBMIT_PROPOSAL,
//     // minionType: MINION_TYPES.SAFE,
//     tx: swapTX,
//     required: ['stakingAddress', 'tokenAddress', 'amount'],
//     fields: [
//       [
//         FIELD.TITLE,
//         FIELD.MINION_SELECT,
//         {
//           type: 'input',
//           label: 'Staking Address',
//           name: 'stakingAddress',
//           htmlFor: 'title',
//           placeholder: '0x',
//           expectType: 'address',
//         },
//         {
//           type: 'input',
//           label: 'Staking Token Address',
//           name: 'tokenAddress',
//           htmlFor: 'title',
//           placeholder: '0x',
//           expectType: 'address',
//         },
//         {
//           type: 'input',
//           label: 'Amount',
//           name: 'amount',
//           htmlFor: 'amount',
//           placeholder: 'in wei',
//           expectType: 'integer',
//         },
//         FIELD.DESCRIPTION,
//       ],
//     ],
//     additionalOptions: [FIELD.LINK],
//   },
// };
