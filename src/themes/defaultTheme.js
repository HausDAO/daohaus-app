import { rgba } from "polished";
import BrandImg from "../assets/img/Daohaus__Castle--Dark.svg";
import BgImg from "../assets/img/daohaus__hero--falling.jpg";

export const defaultTheme = {
  primary500: "#10153d",
  primaryAlpha: rgba("#10153d", 0.9),
  secondary500: "#EB8A23",
  secondaryAlpha: rgba("#EB8A23", 0.75),
  bg500: "#03061B",
  bgOverlayOpacity: "0.75",
  headingFont: "Inknut Antiqua",
  bodyFont: "Rubik",
  monoFont: "Space Mono",
  avatarImg: BrandImg,
  bgImg: BgImg,
  daoMeta: {
    proposals: "Proposals",
    proposal: "Proposal",
    bank: "Bank",
    members: "Members",
    member: "Member",
    boosts: "Apps",
    boost: "App",
    f04title: "404 What's Lost Can Be Found",
    f04heading: "You have been slain",
    f04subhead: "Please reload from the most recent save point.",
    f04cta: "Start Over",
  },
};
