import React from "react";
import { Link } from "react-router-dom";
// import { HUB_MEMBERSHIPS, USER_MEMBERSHIPS } from "../graphQL/member-queries";
import { BodyXs, HeaderMd } from "../styles/typography";

const NetworkDaoList = ({ data }) => {
  return (
    <>
      {data.membersHub?.map((dao) => (
        <div className="inner-section" key={dao.id}>
          <Link to={`/dao/${dao.moloch.id}/proposals`}>
            <HeaderMd className="title">{dao.moloch.title}</HeaderMd>
          </Link>
          <BodyXs>Version {dao.moloch.version}</BodyXs>
        </div>
      ))}
    </>
  );
};

export default NetworkDaoList;
