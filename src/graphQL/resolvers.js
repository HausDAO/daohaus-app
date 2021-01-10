export const resolvers = {
  TokenBalance: {
    contractBalances: async (tokenBalance, _args, context) => {
      console.log(tokenBalance, _args, context);
    },
  },
};
