const dev = {
  GRAPH_NODE_URI: process.env.REACT_APP_DEV_GRAPH_NODE_URI, // replace with subgraph for your moloch
  INFURA_URI: process.env.REACT_APP_DEV_INFURA_URI, // replace with your infura key
  SDK_ENV: process.env.REACT_APP_DEV_SDK_ENV, // replace network for sdk if not Kovan
  cognito: {
    REGION: process.env.REACT_APP_DEV_AWS_REGION,
    USER_POOL_ID: process.env.REACT_APP_DEV_COGNITO_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_DEV_COGNITO_APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_DEV_COGNITO_IDENTITY_POOL_ID,
  },
};

const prod = {
  GRAPH_NODE_URI: process.env.REACT_APP_GRAPH_NODE_URI, // replace with subgraph for your moloch
  INFURA_URI: process.env.REACT_APP_INFURA_URI, // replace with your infura key
  SDK_ENV: process.env.REACT_APP_SDK_ENV,
  cognito: {
    REGION: process.env.REACT_APP_AWS_REGION,
    USER_POOL_ID: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_COGNITO_APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
  },
};

const config = process.env.REACT_APP_STAGE === 'prod' ? prod : dev;

export default {
  ...config,
};
