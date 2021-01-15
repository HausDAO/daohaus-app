import React from "react";
import { Link } from "react-router-dom";

const NetworkDaoList = ({ data, networkID }) => {
  return (
    <>
      {data?.map((dao) => (
        <div className="inner-section" key={dao.id}>
          <Link to={`/dao/${networkID}/${dao.meta.contractAddress}`}>
            <h4 className="title">{dao.meta.name}</h4>
          </Link>
          <p>{dao.meta.description}</p>
          <p className="version">Version {dao.moloch.version}</p>
        </div>
      ))}
    </>
  );
};

export default NetworkDaoList;
