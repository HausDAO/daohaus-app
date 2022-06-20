import { buildMultiTxAction } from '../../utils/legos';
import { POSTER_TAGS } from '../../utils/poster';
import { CONTRACTS } from '../contracts';
import { DETAILS } from '../details';
import { ACTIONS } from '../onTxHashActions';

export const POSTER_BOOST_TX = {
  POSTER_RATIFY_DOC: buildMultiTxAction({
    actions: [
      {
        targetContract: '.contextData.chainConfig.poster',
        abi: CONTRACTS.POSTER,
        fnName: 'post',
        args: ['.values.docContentData', POSTER_TAGS.MINION],
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
  POST_MD: buildMultiTxAction({
    actions: [
      {
        targetContract: '.contextData.chainConfig.poster',
        abi: CONTRACTS.POSTER,
        fnName: 'post',
        args: ['.values.docContentData', POSTER_TAGS.MINION],
      },
    ],
    detailsToJSON: DETAILS.POSTER_LOCATION,
  }),
};
