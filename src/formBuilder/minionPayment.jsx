// import React, { useEffect, useState } from 'react';

// import { useParams } from 'react-router';
// import { useDao } from '../contexts/DaoContext';
// import InputSelect from './inputSelect';
// import { ModButton } from './staticElements';

// import { handleDecimals } from '../utils/general';
// import { graphFetchAll } from '../utils/theGraph';
// import { supportedChains } from '../utils/chain';
// import { ADDRESS_BALANCES } from '../graphQL/bank-queries';

// const testAddr = '0xbb882da8ebd09d3db9fcb16e33e8b67719ee8a55';

// const getMaxBalance = (tokenData, tokenAddress) => {
//   //  Uses token select data structure
//   const token = tokenData.find(t => t.value === tokenAddress);
//   console.log(token);
//   if (token) {
//     return handleDecimals(token.balance, token.decimals);
//   }
// };

// const MinionPayment = props => {
//   const { daochain } = useParams();
//   const { daoOverview } = useDao();
//   const { localForm, minionAddress } = props;
//   const { getValues, setValue, watch } = localForm;

//   const [minionTokens, setMinionTokens] = useState([]);
//   const [balance, setBalance] = useState(null);

//   const paymentToken = watch('paymentToken');
//   const maxBtnDisplay =
//     balance || balance === 0
//       ? `Max: ${balance.toFixed(4)}`
//       : 'Error: Not found.';

//   useEffect(() => {
//     const fetchMinionBalance = async () => {
//       const endpoint = supportedChains[daochain]?.subgraph_url;
//       console.log(endpoint);

//       const data = await graphFetchAll({
//         endpoint,
//         query: ADDRESS_BALANCES,
//         subfield: 'addressBalances',
//         variables: {
//           memberAddress: testAddr,
//         },
//       });
//       console.log(data);
//     };
//     if (daoOverview) {
//       fetchMinionBalance();
//     }
//   }, [daoOverview]);

//   // useEffect(() => {
//   //   const tokenAddr = paymentToken || getValues('paymentToken');
//   //   if (daoTokens?.length && tokenAddr) {
//   //     const bal = getMaxBalance(daoTokens, tokenAddr);
//   //     setBalance(bal);
//   //   }
//   // }, [daoTokens, paymentToken]);

//   // const setMax = () => {
//   //   setValue('paymentRequested', balance);
//   // };

//   return (
//     <InputSelect
//       {...props}
//       selectName='paymentToken'
//       options={minionTokens}
//       // helperText={unlocked || 'Unlock to tokens to submit proposal'}
//       // btn={<ModButton label={maxBtnDisplay} callback={setMax} />}
//     />
//   );
// };

// export default MinionPayment;
