import React from 'react';
import { PropCardTransfer } from './proposalBriefPrimitives';

const SbtTransfer = ({ minionAction }) => {
  const actionData = minionAction?.decoded?.actions?.[0]?.data?.params;
  const sbtFactoryName = `SBT Factory for '${actionData?.[0]?.value}'`;

  return <PropCardTransfer customUI={sbtFactoryName} />;
};

export default SbtTransfer;
