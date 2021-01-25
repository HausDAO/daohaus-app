import { omit } from "./general";

const metadataApiUrl = "https://data.daohaus.club";

export const fetchMetaData = async (endpoint) => {
  const url = `${metadataApiUrl}/${endpoint}`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getApiMetadata = async () => {
  try {
    const response = await fetch(
      "https://daohaus-metadata.s3.amazonaws.com/daoMeta.json"
    );
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const formatBoosts = (boostsArr) =>
  boostsArr.reduce((obj, boost) => {
    return {
      ...obj,
      [boost.boostKey[0]]: omit("boostKey", boost),
    };
  }, {});

export const themeImagePath = (imageValue) => {
  if (
    !imageValue ||
    imageValue.slice(0, 1) === "/" ||
    imageValue.slice(0, 4) === "http"
  ) {
    return imageValue;
  }

  if (imageValue.slice(0, 2) === "Qm") {
    // https://ipfs.infura.io/ipfs
    return `https://gateway.pinata.cloud/ipfs/${imageValue}`;
  }
};

export const getCopy = (metaData, word) => {
  if (!metaData) {
    return;
  }
  console.log(metaData);
  word = word.toLowerCase();

  if (word === "name") return metaData.name;
  else if (word === "description") return metaData.description;
  else {
    const customCopy = metaData?.customTheme?.daoMeta;
    if (word === "proposal") {
      return customCopy?.proposal || "Proposal";
    } else if (word === "proposals") {
      return customCopy?.proposals || "Proposals";
    } else if (word === "bank") {
      return customCopy?.bank || "Bank";
    } else if (word === "boost") {
      return customCopy?.boost || "Boost";
    } else if (word === "boosts") {
      return customCopy?.boosts || "Boosts";
    } else if (word === "members") {
      return customCopy?.members || "Members";
    } else if (word === "member") {
      return customCopy?.member || "Member";
    } else if (word === "f04title") {
      return customCopy?.f04title || "404 What's Lost Can Be Found";
    } else if (word === "f04heading") {
      return customCopy?.f04heading || "You have been slain";
    } else if (word === "f04subhead") {
      return (
        customCopy?.f04subhead ||
        "Please reload from the most recent save point."
      );
    } else if (word === "f04cta") {
      return customCopy?.f04cta || "Start Over.";
    } else {
      return "WORD!";
    }
  }
};

/////////////DEFAULTS//////////////

// const defaultMeta = {
//   proposals: "Proposals",
//   proposal: "Proposal",
//   bank: "Bank",
//   members: "Members",
//   member: "Member",
//   boosts: "Apps",
//   boost: "App",
//   discord: "https://discord.gg/NPEJysW",
//   medium: "https://medium.com/daohaus-club",
//   telegram: "https://t.me/joinchat/IJqu9xPa0xzYLN1mmFKo8g",
//   website: "https://daohaus.club",
//   other: "https://wikipedia.com",
//   f04title: "404 What's Lost Can Be Found",
//   f04heading: "You have been slain",
//   f04subhead: "Please reload from the most recent save point.",
//   f04cta: "Start Over",
// };
