import React from "react";

// import { HUB_MEMBERSHIPS, USER_MEMBERSHIPS } from "../graphQL/member-queries";
import { BodyXs, HeaderMd } from "../styles/typography";

const NetworkDaoList = ({ data }) => {
  return (
    <>
      {data.membersHub?.map((dao) => (
        <div className="inner-section" key={dao.id}>
          <HeaderMd className="title">{dao.moloch.title}</HeaderMd>
          <BodyXs>Version {dao.moloch.version}</BodyXs>
        </div>
      ))}
    </>
  );
};

export default NetworkDaoList;
