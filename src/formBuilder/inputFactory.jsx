import React from 'react';

import AbiInput from './abiInput';
import AddressInput from './addressInput';
import BuyoutPaymentInput from './buyoutPaymentInput';
import ColorPicker from './colorPicker';
import DateRange from './dateRange';
import DiscourseMeta from './discourseMeta';
import GatedInput from './gatedInput';
import GenericFormDisplay from './genericFormDisplay';
import GenericInput from './genericInput';
import GenericTextarea from './genericTextArea';
import InputSelect from './inputSelect';
import LinkInput from './linkInput';
import LootGrabDisplay from './lootGrabDisplay';
import MinionPayment from './minionPayment';
import MinionSelect from './minionSelect';
import MinionTypeSelect from './minionTypeSelect';
import MultiInput from './multiInput';
import NftSelect from './nftSelect';
import NiftyInkUrl from './niftyInkUrl';
import NftkUri from './nftUri';
import PaymentInput from './paymentInput';
import PriceInput from './priceInput';
import RageInput from './rageInput';
import RaribleNftSelect from './raribleNftData';
import NftApproval from './nftApproval';
import TokenInfoInput from './tokenInfoInput';
import CheckSwitch from './checkSwitch';
import CheckGate from './checkGate';
import SaltGenerator from './saltGenerator';
import SuperfluidPaymentInput from './superfluidPaymentInput';
import SuperfluidRate from './superfluidRate';
import TargetContract from './targetContract';
import ToggleForm from './toggleForm';
import ToggleToken from './toggleToken';
import TributeInput from './tributeInput';
import ListBox from './listBox';
import { createRegisterOptions } from '../utils/formBuilder';
import BoolSelect from './boolSelect';
import GenericSwitch from './genericSwitch';
import DisperseListInput from './disperseListInput';
import MinionTokenSelect from './minionTokenSelect';
import UberhausDelegateInput from './uberhausDelegateInput';

export const InputFactory = props => {
  const { type, formCondition, required } = props;

  if (type === 'formCondition' && props[formCondition]) {
    const nestedInput = { ...props[formCondition] };
    if (nestedInput) {
      return (
        <InputFactory
          {...props}
          {...nestedInput}
          registerOptions={createRegisterOptions(nestedInput, required)}
        />
      );
    }
  }

  if (type === 'input') {
    return <GenericInput {...props} />;
  }
  if (type === 'gatedInput') {
    return <GatedInput {...props} />;
  }
  if (type === 'textarea') {
    return <GenericTextarea {...props} />;
  }
  if (type === 'inputSelect') {
    return <InputSelect {...props} />;
  }
  if (type === 'switch') {
    return <GenericSwitch {...props} />;
  }
  if (type === 'linkInput') {
    return <LinkInput {...props} />;
  }
  if (type === 'applicantInput') {
    return <AddressInput {...props} />;
  }
  if (type === 'tributeInput') {
    return <TributeInput {...props} />;
  }
  if (type === 'paymentInput') {
    return <PaymentInput {...props} />;
  }
  if (type === 'minionSelect') {
    return <MinionSelect {...props} />;
  }
  if (type === 'minionPayment') {
    return <MinionPayment {...props} />;
  }
  if (type === 'abiInput') {
    return <AbiInput {...props} />;
  }
  if (type === 'targetContract') {
    return <TargetContract {...props} />;
  }
  if (type === 'multiInput') {
    return <MultiInput {...props} />;
  }
  if (type === 'nftSelect') {
    return <NftSelect {...props} />;
  }
  if (type === 'priceInput') {
    return <PriceInput {...props} />;
  }
  if (type === 'genericDisplay') {
    return <GenericFormDisplay {...props} />;
  }
  if (type === 'lootGrabDisplay') {
    return <LootGrabDisplay {...props} />;
  }
  if (type === 'dateRange') {
    return <DateRange {...props} />;
  }
  if (type === 'targetInk') {
    return <NiftyInkUrl {...props} />;
  }
  if (type === 'targetNft') {
    return <NftkUri {...props} />;
  }
  if (type === 'superfluidRate') {
    return <SuperfluidRate {...props} />;
  }
  if (type === 'superfluidPaymentInput') {
    return <SuperfluidPaymentInput {...props} />;
  }
  if (type === 'buyoutPaymentInput') {
    return <BuyoutPaymentInput {...props} />;
  }
  if (type === 'rageInput') {
    return <RageInput {...props} />;
  }
  if (type === 'raribleNftData') {
    return <RaribleNftSelect {...props} />;
  }
  if (type === 'minionTypeSelect') {
    return <MinionTypeSelect {...props} />;
  }
  if (type === 'colorPicker') {
    return <ColorPicker {...props} />;
  }
  if (type === 'discourseMeta') {
    return <DiscourseMeta {...props} />;
  }
  if (type === 'nftApproval') {
    return <NftApproval {...props} />;
  }
  if (type === 'tokenInfoInput') {
    return <TokenInfoInput {...props} />;
  }
  if (type === 'checkSwitch') {
    return <CheckSwitch {...props} />;
  }
  if (type === 'checkGate') {
    return <CheckGate {...props} />;
  }
  if (type === 'listBox') {
    return <ListBox {...props} />;
  }
  if (type === 'toggleForm') {
    return <ToggleForm {...props} />;
  }
  if (type === 'toggleToken') {
    return <ToggleToken {...props} />;
  }
  if (type === 'saltGenerator') {
    return <SaltGenerator {...props} />;
  }
  if (type === 'boolSelect') {
    return <BoolSelect {...props} />;
  }
  if (type === 'disperseListInput') {
    return <DisperseListInput {...props} />;
  }
  if (type === 'minionTokenSelect') {
    return <MinionTokenSelect {...props} />;
  }
  if (type === 'uberHausDelegate') {
    return <UberhausDelegateInput {...props} />;
  }
  return null;
};
