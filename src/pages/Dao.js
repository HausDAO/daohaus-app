import React, { useState, useEffect } from "react";

import { RiTrophyLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import Layout from "../components/layout";
import { useDaoMember } from "../contexts/DaoMemberContext";

import { generateDaoLinks, defaultDaoData } from "../utils/navLinks";
import DaoRouter from "../routers/daoRouter";
import { useUser } from "../contexts/UserContext";
import { useMetaData } from "../contexts/MetaDataContext";
import makeBlockie from "ethereum-blockies-base64";
import { themeImagePath } from "../utils/metadata";

const handleDaoAvatar = (daoMetaData, daoID) => {
  if (daoMetaData?.avatarImg) {
    return themeImagePath(daoMetaData.avatarImg);
  } else {
    return makeBlockie(daoID);
  }
};

const Dao = () => {
  const { daoid, daochain } = useParams();
  const { daoMember } = useDaoMember();
  const { daoMetaData } = useMetaData();

  const [navLinks, setNavLinks] = useState(generateDaoLinks(daochain, daoid));
  useEffect(() => {
    if (daoMember) {
      const profileLink = {
        icon: RiTrophyLine,
        label: "Profile",
        path: `/dao/${daochain}/${daoid}/profile/${daoMember.memberAddress}`,
      };
      setNavLinks([...generateDaoLinks(daochain, daoid), profileLink]);
    } else {
      setNavLinks(generateDaoLinks(daochain, daoid));
    }
  }, [daoMember, daoid, daochain]);

  const brand = {
    brandImg: handleDaoAvatar(daoMetaData, daoid),
    brandPath: `/dao/${daochain}/${daoid}/`,
  };
  return (
    <Layout
      navLinks={navLinks}
      brand={brand}
      daoMetaData={daoMetaData}
      dao={{ daoID: daoid, chainID: daochain }}
    >
      <DaoRouter />
    </Layout>
  );
};

export default Dao;
