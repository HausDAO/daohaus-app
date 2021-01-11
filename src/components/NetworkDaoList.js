import React from "react";
import { Link } from "react-router-dom";

const NetworkDaoList = ({ data, networkID }) => {
  return (
    <>
      {data.membersHub?.map((dao) => (
        <div className="inner-section" key={dao.id}>
          <Link to={`/dao/${networkID}/${dao.moloch.id}`}>
            <h4 className="title">{dao.moloch.title}</h4>
          </Link>
          <p className="version">Version {dao.moloch.version}</p>
        </div>
      ))}
    </>
  );
};

export default NetworkDaoList;
