import React from 'react';
import AbiInput from './abiInput';

import AddressInput from './addressInput';
import GenericInput from './genericInput';
import GenericTextarea from './genericTextArea';
import InputSelect from './inputSelect';
import LinkInput from './linkInput';
import MinionSelect from './minionSelect';
import PaymentInput from './paymentInput';
import TributeInput from './tributeInput';
import TargetContract from './targetContract';
import MultiInput from './multiInput';
import NftSelect from './nftSelect';
import GatedInput from './gatedInput';
import GenericFormDisplay from './genericFormDisplay';
import LootGrabDisplay from './lootGrabDisplay';
import MinionPayment from './minionPayment';
import DateRange from './dateRange';
import PriceInput from './priceInput';
import NiftyInkUrl from './niftyInkUrl';
import MinionTypeSelect from './minionTypeSelect';
import SuperfluidRate from './superfluidRate';
import SuperfluidPaymentInput from './superfluidPaymentInput';
import RageInput from './rageInput';
import RaribleNftSelect from './raribleNftData';

export const InputFactory = props => {
  const { type } = props;
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
  if (type === 'superfluidRate') {
    return <SuperfluidRate {...props} />;
  }
  if (type === 'superfluidPaymentInput') {
    return <SuperfluidPaymentInput {...props} />;
  }
  if (type === 'rageInput') {
    return <RageInput {...props} />;
  }
  if (type === 'raribleNftData') {
    return <RaribleNftSelect {...props} />;
  }
  return null;
};
