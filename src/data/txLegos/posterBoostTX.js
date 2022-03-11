import { buildMultiTxAction } from '../../utils/legos';
import { POSTER_TAGS } from '../../utils/poster';
import { CONTRACTS } from '../contracts';
import { DETAILS } from '../details';
import { ACTIONS } from '../onTxHashActions';

export const POSTER_BOOST_TX = {
  POSTER_RATIFY: buildMultiTxAction({
    actions: [
      {
        logTX: true,
        targetContract: '.contextData.chainConfig.poster',
        abi: CONTRACTS.POSTER,
        fnName: 'post',
        args: ['.values.encoded', POSTER_TAGS.MINION],
      },
    ],
    detailsToJSON: DETAILS.POSTER_RATIFY,
  }),
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
    poll: 'subgraph-poster',
    display: 'Posting...',
    errMsg: 'Error Posting Doc',
    successMsg: 'Posted Doc!',
    argsFromCallback: 'postIPFS',
  },
  POSTER_MD: {
    contract: CONTRACTS.POSTER,
    name: 'post',
    onTxHash: ACTIONS.PROPOSAL,
    poll: 'subgraph-poster',
    display: 'Posting...',
    errMsg: 'Error Posting Doc',
    successMsg: 'Posted Doc!',
    gatherArgs: ['.values.encoded', POSTER_TAGS.MEMBER],
  },
};
