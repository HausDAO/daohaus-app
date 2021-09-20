import imgGrants from '../assets/Daohaus__Castle--Dark.svg';
import imgGuilds from '../assets/Daohaus__Castle--Dark.svg';
import imgVentures from '../assets/Daohaus__Castle--Dark.svg';
import imgProjects from '../assets/Daohaus__Castle--Dark.svg';
import imgClubs from '../assets/Daohaus__Castle--Dark.svg';
import { supportedChains } from '../utils/chains';

export const daoConstants = networkId => {
  const constants = {
    abortWindow: '1',
    dilutionBound: '3',
    version: '2.1',
  };

  if (networkId === 100) {
    constants.approvedToken = supportedChains[100].wrapper_contract;
  }

  return constants;
};

export const daoPresets = networkId => {
  let presets = [
    {
      presetName: 'Guilds',
      presetSubtitle: 'Work collectively to offer services',
      presetDescription:
        'Best for Worker Cooperatives with small to medium financial throughput.',
      currency: 'DAI',
      approvedToken: supportedChains[networkId].dai_contract,
      minimumTribute: '100',
      votingPeriod: '60',
      gracePeriod: '24',
      proposalDeposit: '5000000000000000000',
      processingReward: '2000000000000000000',
      periodDuration: '7200',
      summonerShares: 1,
      color: '#4FBF9F',
      version: '2.1',
      img: imgGuilds,
    },
    {
      presetName: 'Clubs',
      presetSubtitle: 'Little to no financial decisions',
      presetDescription:
        'Hang with your friends and commrades to nerd out or just chill.',
      currency: 'DAI',
      approvedToken: supportedChains[networkId].dai_contract,
      minimumTribute: '10',
      votingPeriod: '4320',
      gracePeriod: '2880',
      proposalDeposit: '5000000000000000000',
      processingReward: '5000000000000000000',
      periodDuration: '60',
      summonerShares: 1,
      color: '#F16061',
      version: '2.1',
      img: imgClubs,
    },
    {
      presetName: 'Ventures',
      presetSubtitle: 'Large to XL financial decisions',
      presetDescription:
        'Invest on chain with a venture fund at your fingertips.',
      currency: 'WETH',
      approvedToken: supportedChains[networkId].wrapper_contract,
      minimumTribute: '50',
      votingPeriod: '7',
      gracePeriod: '7',
      proposalDeposit: '100000000000000000',
      processingReward: '10000000000000000',
      periodDuration: '86400',
      summonerShares: 1,
      color: '#AB3593',
      version: '2.1',
      img: imgVentures,
    },
    {
      presetName: 'Grants',
      presetSubtitle: 'Distribute wealth together',
      presetDescription: 'Spread around the wealth and accelerate good stuff.',
      currency: 'WETH',
      approvedToken: supportedChains[networkId].wrapper_contract,
      minimumTribute: '10',
      votingPeriod: '168',
      gracePeriod: '72',
      proposalDeposit: '10000000000000000',
      processingReward: '10000000000000000',
      periodDuration: '3600',
      summonerShares: 1,
      color: '#ea8923',
      version: '2.1',
      img: imgGrants,
    },

    {
      presetName: 'Products',
      presetSubtitle: 'Govern a Product or Protocol',
      presetDescription:
        'Raid together to get projects and products done in record time.',
      currency: 'DAI',
      approvedToken: supportedChains[networkId].dai_contract,
      minimumTribute: '250',
      votingPeriod: '60',
      gracePeriod: '36',
      proposalDeposit: '5000000000000000000',
      processingReward: '5000000000000000000',
      periodDuration: '7200',
      summonerShares: 1,
      color: '#513e97',
      version: '2.1',
      img: imgProjects,
    },
  ];

  if (networkId === 100) {
    presets = presets.map(preset => {
      preset.currency = 'WXDAI';
      preset.approvedToken = supportedChains[networkId].wrapper_contract;
      preset.proposalDeposit = '100000000000000000';
      preset.processingReward = '10000000000000000';

      return preset;
    });
  } else if (networkId === 137) {
    presets = presets.map(preset => {
      preset.currency = 'WMATIC';
      preset.approvedToken = supportedChains[networkId].wrapper_contract;
      preset.proposalDeposit = '100000000000000000';
      preset.processingReward = '10000000000000000';

      return preset;
    });
  }
  return presets;
};

export const currencyOptions = networkId => {
  let options;

  if (networkId === 100) {
    options = [
      {
        value: 'WXDAI',
        label: 'WXDAI',
        address: supportedChains[networkId].wrapper_contract,
      },
    ];
  } else {
    options = [
      {
        value: 'DAI',
        label: 'DAI',
        address: supportedChains[networkId].dai_contract,
      },
      {
        value: 'WETH',
        label: 'WETH',
        address: supportedChains[networkId].wrapper_contract,
      },
    ];
  }

  return options;
};
