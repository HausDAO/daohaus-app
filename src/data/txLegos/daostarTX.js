import { buildMultiTxAction } from '../../utils/legos';
import { CONTRACTS } from '../contracts';
import { DETAILS } from '../details';

export const DAOSTAR_REGISTER_TX = {
  DAOSTAR_REGISTER: buildMultiTxAction({
    actions: [
      {
        targetContract:
          '.contextData.chainConfig.daostar_registration_factory_addr',
        abi: CONTRACTS.DAOSTAR_FACTORY,
        fnName: 'summonRegistration',
        args: [
          '.values.daoURI',
          {
            type: 'detailsToJSON',
            gatherFields: DETAILS.DAOSTAR_REGISTER,
          },
        ],
      },
    ],
    detailsToJSON: DETAILS.DAOSTAR_REGISTER,
  }),
};
