export const testProvider = async (provider, endPointURL, providerType) => {
  try {
    const test = await provider.getBlock();
    console.log(`${providerType} Init Test Passed!`, test);
  } catch (error) {
    console.error(
      `Default Application did not connect to network ${endPointURL}`
    );
  }
};
