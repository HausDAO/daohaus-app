import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { Box, Flex } from 'rebass';

import { DaoServiceContext } from '../../contexts/Store';
import { GET_MOLOCH } from '../../utils/Queries';
import BottomNav from '../shared/BottomNav';
import ErrorMessage from '../shared/ErrorMessage';
import Loading from '../shared/Loading';
import { ViewDiv } from '../../App.styles';
import { setupValues } from '../../utils/TransmutationService';
import LootGrab from './LootGrab';
import LootShareDistro from './LootSharesDistro';
import TokenInfo from './TokenInfo';
import TransmutationStatus from './TransmutationStatus';

const PIECOLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TransmutationStats = () => {
  const [daoService] = useContext(DaoServiceContext);

  const { loading, error, data } = useQuery(GET_MOLOCH, {
    variables: { contractAddr: daoService.daoAddress.toLowerCase() },
  });

  const getTokenInfo = async (name, tokenAddress) => {
    const totalSupply = await daoService.token.totalSupply(tokenAddress);
    const transSupply = await daoService.token.balanceOf(
      setupValues.transmutation,
      'latest',
      tokenAddress,
    );
    const trustSupply = await daoService.token.balanceOf(
      setupValues.trust,
      'latest',
      tokenAddress,
    );
    const minionSupply = await daoService.token.balanceOf(
      setupValues.minion,
      'latest',
      tokenAddress,
    );
    const daoSupply = await daoService.token.balanceOf(
      setupValues.moloch,
      'latest',
      tokenAddress,
    );
    return {
      tokenAddress: tokenAddress,
      totalSupply,
      transSupply,
      trustSupply,
      minionSupply,
      daoSupply,
      name,
    };
  };

  const getRequestToken = (data, tokenAddress) => {
    const token = data.moloch.tokenBalances.find(
      (token) => token.token.tokenAddress === tokenAddress,
    );
    return token;
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ViewDiv>
      <h3>Stats</h3>
      <Flex>
        <Box p={3} width={1 / 2}>
          <LootGrab
            data={data}
            setupValues={setupValues}
            getRequestToken={getRequestToken}
          />
        </Box>
        <Box p={3} width={1 / 2}>
          <LootShareDistro data={data} PIECOLORS={PIECOLORS} />
        </Box>
      </Flex>
      <Flex>
        <Box p={3} width={1 / 2}>
          <TokenInfo
            setupValues={setupValues}
            PIECOLORS={PIECOLORS}
            getTokenInfo={getTokenInfo}
          />
        </Box>
        <Box p={3} width={1 / 2}>
          <TransmutationStatus
            setupValues={setupValues}
            PIECOLORS={PIECOLORS}
            getTokenInfo={getTokenInfo}
          />
        </Box>
      </Flex>
      <Flex>
        <Box p={3} width={1 / 2}>
          <h4>Github</h4>
          <p>
            repo status: <a href={setupValues.githubRepo}>link</a>
          </p>
          {/* <img src="https://i.imgur.com/p8rXwlW.png" alt="github charts" /> */}
        </Box>
        <Box p={3} width={1 / 2}>
          <h4>live Proposals</h4>
        </Box>
      </Flex>
      <div>
        <h4>More info DAOHAUS Stats</h4>
      </div>

      <BottomNav />
    </ViewDiv>
  );
};

export default TransmutationStats;
