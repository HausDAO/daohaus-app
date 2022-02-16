import { buildMultiTxAction } from '../../utils/legos';
import { CONTRACTS } from '../contracts';
import { DETAILS } from '../details';

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
};
