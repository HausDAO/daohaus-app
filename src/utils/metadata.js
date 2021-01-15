import { omit } from "./general";
import { lighten, darken, rgba } from "polished";
import { extendTheme } from "@chakra-ui/react";

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

///API IDEA, send array of addresses as params and only get metadata for that back.
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

const shadeTemplate = [
  { shade: 50, degree: 0.4 },
  { shade: 100, degree: 0.3 },
  { shade: 200, degree: 0.2 },
  { shade: 300, degree: 0.1 },
  { shade: 400, degree: 0.05 },
  { shade: 500, degree: 0 },
  { shade: 600, degree: 0.05 },
  { shade: 700, degree: 0.1 },
  { shade: 800, degree: 0.15 },
  { shade: 900, degree: 0.2 },
];
const getShade = (shade, degree, seedColor) => {
  if (shade < 500) return lighten(degree, seedColor);
  else if (shade === 500) return seedColor;
  else if (shade > 500) return darken(degree, seedColor);
  else {
    throw new Error(`Argument ${shade} is not a valid shade value`);
  }
};
const getAllShades = (seedColor) =>
  shadeTemplate.reduce(
    (obj, { shade, degree }) => ({
      ...obj,
      [shade]: getShade(shade, degree, seedColor),
    }),
    {}
  );

export const createNewTheme = (newTheme) => {
  const newThemeData = {
    THEME_NAME: newTheme.daoName,
    active: true,
    colors: {
      primary: getAllShades(newTheme.boostMetadata.primary500),
      secondary: getAllShades(newTheme.boostMetadata.secondary500),
      background: getAllShades(newTheme.boostMetadata.bg500),
    },
  };
  return extendTheme({ ...defaultTheme, ...newThemeData });
};
/////////////DEFAULTS//////////////
export const defaultThemeData = {
  colors: {
    THEME_NAME: "DEFAULT",
    primary: getAllShades("#10153d"),
    secondary: getAllShades("#EB8A23"),
    background: getAllShades("#03061B"),
    primaryAlpha: rgba("#10153d", 0.9),
    secondaryAlpha: rgba("#EB8A23", 0.75),
  },
  // fonts: {
  //   heading: "Inknut Antiqua",
  //   body: "Rubik",
  //   mono: "Space Mono",
  //   hub: "Mirza",
  //   accessory: "Roboto Mono",
  //   space: "Space Mono",
  // },
  // brandImg: BrandImg,
  // bgImg: BgImg,
};
export const defaultTheme = extendTheme(defaultThemeData);

const defaultMeta = {
  proposals: "Proposals",
  proposal: "Proposal",
  bank: "Bank",
  members: "Members",
  member: "Member",
  boosts: "Apps",
  boost: "App",
  discord: "https://discord.gg/NPEJysW",
  medium: "https://medium.com/daohaus-club",
  telegram: "https://t.me/joinchat/IJqu9xPa0xzYLN1mmFKo8g",
  website: "https://daohaus.club",
  other: "https://wikipedia.com",
  f04title: "404 What's Lost Can Be Found",
  f04heading: "You have been slain",
  f04subhead: "Please reload from the most recent save point.",
  f04cta: "Start Over",
};
