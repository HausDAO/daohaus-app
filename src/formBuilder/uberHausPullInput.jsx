import React, { useEffect, useMemo, useState } from 'react';
import { Checkbox } from '@chakra-ui/react';

import InputSelect from './inputSelect';
import ModButton from './modButton';
import { createContract } from '../utils/contract';
import { handleDecimals } from '../utils/general';
import { getContractBalance } from '../utils/tokenValue';
import { LOCAL_ABI } from '../utils/abi';
import { spreadOptions } from '../utils/formBuilder';
import { UBERHAUS_DATA } from '../utils/uberhaus';

const UberHausPullInput = props => {
  const { localForm, registerOptions, localValues } = props;
  const { setValue } = localForm;

  const [balance, setBalance] = useState(null);
  const [daoTokens, setDaoTokens] = useState([]);
  const [decimals, setDecimals] = useState(null);
  const [loadToken, setLoadToken] = useState(false);
  const [pullDelegateRewards, setDelegateRewards] = useState(false);

  const displayBalance = useMemo(() => {
    if (balance && decimals) {
      const commified = handleDecimals(balance, decimals)?.toFixed(4);
      return commified;
    }
    return 'Error';
  }, [balance, decimals]);

  useEffect(() => {
    if (!localValues.minionAddress || !localValues.pullToken) return;

    const getTokenBalance = async () => {
      try {
        setLoadToken(true);

        const tokenContract = createContract({
          address: localValues.pullToken,
          abi: LOCAL_ABI.ERC_20,
          chainID: UBERHAUS_DATA.NETWORK,
        });

        const balance = await tokenContract.methods
          .balanceOf(localValues.minionAddress)
          .call();

        setBalance(balance);
        setDecimals(UBERHAUS_DATA.STAKING_TOKEN_DECIMALS);
        setDaoTokens([
          {
            value: UBERHAUS_DATA.STAKING_TOKEN,
            name: UBERHAUS_DATA.STAKING_TOKEN_SYMBOL,
            decimals: UBERHAUS_DATA.STAKING_TOKEN_DECIMALS,
            balance,
          },
        ]);
        setLoadToken(false);
      } catch (error) {
        console.error(error);
      }
    };

    getTokenBalance();
  }, [localValues.uberHausMinion]);

  const btnDisplay = () => {
    if (displayBalance) return `Max: ${displayBalance}`;
    return '0';
  };

  const handleCheck = () => {
    setDelegateRewards(prevState => !prevState);
  };

  const setMax = () => {
    setValue('pull', balance / 10 ** decimals);
  };

  const options = spreadOptions({
    registerOptions,
    setValueAs: val => getContractBalance(val, decimals),
    validate: {
      hasBalance: val =>
        getContractBalance(val, decimals) > Number(balance)
          ? `Amount entered exceeds wallet balance.`
          : true,
    },
  });

  return (
    <>
      <InputSelect
        {...props}
        selectName='tributeToken'
        options={daoTokens}
        registerOptions={options}
        btn={<ModButton text={btnDisplay()} fn={setMax} />}
      />
      {/* <Checkbox
        onChange={handleCheck}
        isChecked={pullDelegateRewards}
        color={pullDelegateRewards ? 'whiteAlpha.700' : 'whiteAlpha.500'}
        isDisabled={currentDelegate?.impeached || currentDelegate?.rewarded}
      >
        Pull delegate rewards
      </Checkbox> */}
    </>
  );
};

export default UberHausPullInput;
