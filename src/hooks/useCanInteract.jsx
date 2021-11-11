import { useTX } from '../contexts/TXContext';

// TODO: move spam into it's own thing??
const defaults = [
  'isConnected',
  'isSameChain',
  'isMember',
  'isMemberSpamFilter',
];

const useCanInteract = (params = {}) => {
  const { checklist = defaults, errorDeliveryType = 'firstString' } = params;
  const { checkState } = useTX();
  const result = checkState(checklist, errorDeliveryType);
  if (
    errorDeliveryType === 'softErrors' ||
    errorDeliveryType === 'arrayOfStrings'
  ) {
    return {
      canInteract: result === true,
      interactErrors: result?.length ? result : false,
    };
  }
  if (errorDeliveryType === 'firstString') {
    return {
      canInteract: result === true,
      interactErrors: typeof result === 'string' ? result : false,
    };
  }
};

export default useCanInteract;
