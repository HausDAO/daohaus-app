import { buildMultiTxAction } from '../../utils/legos';
import { CONTRACTS } from '../contracts';
import { DETAILS } from '../details';
import { ACTIONS } from '../onTxHashActions';

export const POSTER_BOOST_TX = {
  POSTER_RATIFY: buildMultiTxAction({
    actions: [
      {
        targetContract: '.contextData.chainConfig.poster',
        abi: CONTRACTS.POSTER,
        fnName: 'post',
        args: ['.values.encoded', 'daohaus.manifesto'],
      },
    ],
    detailsToJSON: DETAILS.POSTER_RATIFY,
  }),
  POSTER_IPFS_MD: {
    contract: CONTRACTS.POSTER,
    name: 'post',
    onTxHash: ACTIONS.PROPOSAL,
    poll: 'subgraph',
    display: 'Posting...',
    errMsg: 'Error Posting Doc',
    successMsg: 'Posted Doc!',
    argsFromCallback: 'postIPFS',
  },
};
