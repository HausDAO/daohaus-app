export const requestAddresses = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
      // localStorage.setItem("hasConnected", addressArray[0]);
      return addressArray;
    } catch (error) {
      return console.error(error);
    }
  } else if (window.web3) {
    return window.web3.eth.defaultAccount;
  }
};

export const findInjectedProvider = () => {
  if (window.ethereum) {
    const { ethereum } = window;
    ethereum.autoRefreshOnNetworkChange = false;
    return ethereum;
  } else if (window.web3) {
    console.warn(
      `Current Injected provider does not create a window.ethereum provider and is instead using the deprecated window.web3 provider.`
    );
    return window.web3;
  } else {
    console.error("There is no injected Provider");
  }
};

export const getAddress = (provider) => {
  return provider.selectedAddress;
};
export const getTrucatedAddress = (provider) => {
  if (provider) {
    const selectedAddress = getAddress(provider);
    return `${selectedAddress.slice(0, 6)}...${selectedAddress.slice(
      selectedAddress.length - 6
    )}`;
  }
};
