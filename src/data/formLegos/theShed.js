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
