import {
  RiBookMarkLine,
  RiDiscordFill,
  RiTelegramFill,
  RiMediumFill,
  RiTwitterFill,
  RiGlobeLine,
  RiLinksLine,
  RiTeamLine,
  RiSettings3Line,
  RiBankLine,
  RiTrophyLine,
  RiQuestionLine,
  RiFireLine,
  RiRocket2Line,
  RiSearch2Line,
} from "react-icons/ri";
import { GiCastle } from "react-icons/gi";

export const defaultDaoData = [
  { icon: RiBookMarkLine, label: "Proposals" },
  { icon: RiBankLine, label: "Bank" },
  { icon: RiTeamLine, label: "Members" },
  { icon: RiSettings3Line, label: "Settings" },
  { icon: RiRocket2Line, label: "Boosts" },
];
export const defaultHubData = [
  { icon: RiSearch2Line, label: "Explore", path: "/explore" },
  { icon: RiFireLine, label: "Summon", path: "/summon" },
  {
    icon: RiTeamLine,
    label: "HausDao",
    path: "/dao/0x64/0x283bdc900b6ec9397abb721c5bbff5ace46e0f50",
  },
  {
    icon: RiQuestionLine,
    label: "Help",
    href: "https://daohaus.club/help",
  },
  {
    icon: GiCastle,
    label: "About Dao Haus",
    href: "https://daohaus.club/about",
  },
];

export const generateDaoLinks = (chainID, daoID) =>
  defaultDaoData.map((link) => ({
    ...link,
    path: `/dao/${chainID}/${daoID}/${link.label.toLowerCase()}`,
  }));
