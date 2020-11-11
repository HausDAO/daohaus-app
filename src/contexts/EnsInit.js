import React, { useEffect } from 'react';
import { EnsService } from '../utils/ens-service';

import { useEns, useWeb3Connect } from './PokemolContext';
/*
// needs new env var for mainnet infura uri

// in component form
...
  const [ensAddr, setEnsAddr] = useState("");
  const [ens] = useEns();

...

  const handleChange = async (e) => {
    if (e.target.value.indexOf(".eth") >= 0) {
      const address = await ens.provider.resolveName(e.target.value);
      setEnsAddr(address);
    } else {
      setEnsAddr(null);
    }
  };

  ...

  <FormControl>
    <FormLabel htmlFor="address">Eth address</FormLabel>
    <Input
      ref={register}
      name="address"
      type="text"
      id="address"
      aria-describedby="address-helper-text"
      readOnly={loading}
      onChange={handleChange}
    />
    <FormHelperText p="1" id="address-helper-text">
      {ensAddr ? `ENS: ${ensAddr}` : "Use ETH address or ENS"}
    </FormHelperText>
  </FormControl>

// for reverse lookup
see EthAddressDisplay
*/
const EnsInit = () => {
  const [, updateEns] = useEns();
  const [web3Connect] = useWeb3Connect();

  useEffect(() => {
    initEns();

    // eslint-disable-next-line
  }, [web3Connect]);

  const initEns = async () => {
    const ensService = new EnsService();
    updateEns(ensService);
  };

  return <></>;
};

export default EnsInit;
