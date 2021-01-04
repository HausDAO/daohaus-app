import React from "react";

// import { HUB_MEMBERSHIPS, USER_MEMBERSHIPS } from "../graphQL/member-queries";
import { BodyMd, HeaderMd, HeaderXs, Overline } from "../styles/typography";

const NetworkDaoList = ({ selectedAddress, client, data }) => {
  return (
    <>
      {data.membersHub.map((dao) => (
        <div className="inner-section" key={dao.id}>
          <HeaderMd className="title">{dao.moloch.title}</HeaderMd>
          <BodyMd className="par">Version {dao.moloch.version}</BodyMd>
        </div>
      ))}
    </>
  );
};

export default NetworkDaoList;
