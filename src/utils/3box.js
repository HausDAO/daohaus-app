export const fetchProfile = async (address) => {
  try {
    const response = await fetch(
      `https://ipfs.3box.io/profile?address=${address}`
    );

    return response.json();
  } catch (error) {
    console.log(error);
  }
};

export const cacheUser = () => {};
