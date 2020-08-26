import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { DaoServiceContext } from '../../contexts/Store';
import { GET_MOLOCH } from '../../utils/Queries';
import ErrorMessage from '../../components/shared/ErrorMessage';
import BottomNav from '../../components/shared/BottomNav';
import Loading from '../../components/shared/Loading';
import { ViewDiv, PadDiv } from '../../App.styles';

const transmutationMeta = {
  minCap: 100000,
  maxCap: 250000,
  giveTokenAddress: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
  getTokenAddress: '0x091f54f042635060bbd480a871cc7a9ae4139ecf',
  maxBurnRatePerMo: '25',
  githubRepo: 'https://github.com',
};

const Stats = () => {
  const [daoService] = useContext(DaoServiceContext);
  // const [tokens, setTokens] = useState([]);

  const { loading, error, data } = useQuery(GET_MOLOCH, {
    variables: { contractAddr: daoService.daoAddress.toLowerCase() },
  });

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  console.log('stats', data);

  //   useEffect(()=>{
  //     _tokens = {};
  //     getTokenMeta = data.moloch.tokenBalances.filter((token) => token.token.tokenAddress === transmutationMeta.giveTokenAddress)
  //   }, data)

  return (
    <ViewDiv>
      <div>
        <PadDiv>
          <h3>Stats</h3>
          <div>
            <h4>Loot Grab</h4>
            <p>Min Cap: {transmutationMeta.minCap}</p>
            <p>Max Cap: {transmutationMeta.maxCap}</p>
            <p>
              Total Raised{' '}
              {
                data.moloch.tokenBalances.find(
                  (token) =>
                    token.token.tokenAddress ===
                    transmutationMeta.giveTokenAddress,
                ).contractBabeBalance
              }
            </p>
            <p>Loot distro chart</p>
            <p>Loot/share distro chart</p>
          </div>
          <div>
            <h4>Token Info</h4>
            <p>token address: {transmutationMeta.getTokenAddress}</p>
            <p>total tokens</p>
            <p>token distro</p>
          </div>
          <div>
            <h4>Transmutation Status</h4>
            <p>start date</p>
            <p>max monthly burn rate: {transmutationMeta.maxBurnRatePerMo}</p>
            <p>current avg burn rate</p>
            <p>number proposals made</p>
            <p>amount transmuted/remaining</p>
          </div>
          <div>
            <h4>Github</h4>
            <p>repo status: {transmutationMeta.githubRepo}</p>
          </div>
          <div>
            <h4>live Proposals</h4>
          </div>
          <div>
            <h4>More info DAOHAUS Stats</h4>
          </div>
        </PadDiv>
      </div>
      <BottomNav />
    </ViewDiv>
  );
};

export default Stats;
