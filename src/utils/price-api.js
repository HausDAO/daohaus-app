import axios from 'axios';

const geckoURL = 'https://api.coingecko.com/api/v3/simple/token_price';

export const getUsd = async (tokenAddress) => {
  const instance = axios.create({
    baseURL: geckoURL,
    headers: { 'Content-Type': 'application/json' },
  });

  try {
    return await instance.get(
      `/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`,
    );
  } catch (err) {
    throw new Error(err);
  }
};

export const XDAI_TOKEN_PAIRS = {
  '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1':
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  // '0x44fa8e6f47987339850636f88629646662444217':
  // '0x6b175474e89094c44da98b954eedeac495271d0f',
  '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d':
    '0x6b175474e89094c44da98b954eedeac495271d0f',
  '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83':
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  '0xe2e73a1c69ecf83f464efce6a5be353a37ca09b2':
    '0x514910771af9ca656af840dff83e8264ecf986ca',
  '0x5fd896d248fbfa54d26855c267859eb1b4daee72':
    '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
  '0xb7d311e2eb55f2f68a9440da38e7989210b9a05e':
    '0x0ae055097c6d159879521c384f1d2123d1f195e6',
  '0x4ecaba5870353805a9f068101a40e0f32ed605c6':
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
  '0xb1950fb2c9c0cbc8553578c67db52aa110a93393':
    '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
  '0x9c58bacc331c9aa871afd802db6379a98e80cedb':
    '0x6810e776880c02933d47db1b9fc05908e5386b96',
  '0xdf6ff92bfdc1e8be45177dc1f4845d391d3ad8fd':
    '0xc00e94cb662c3520282e6f5717214004a7f26888',
  '0xc1b42bdb485deb24c74f58399288d7915a726c1d':
    '0x80fb784b7ed66730e8b1dbd9820afd29931aab03',
  '0x7838796b6802b18d7ef58fc8b757705d6c9d12b3':
    '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
  '0x985e144eb355273c4b4d51e448b68b657f482e26':
    '0x6758b7d441a9739b98552b373703d8d3d14f9e62',
  '0xc439e5b1dee4f866b681e7c5e5df140aa47fbf19':
    '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
};
