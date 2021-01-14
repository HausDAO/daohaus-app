import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';

const ExploreCard = ({ dao }) => {
  return (
    <>
      <div>
        <div>
          <div
            style={{
              backgroundImage: `url("${makeBlockie(dao.id)}")`,
            }}
          ></div>
          <h4>{dao.title}</h4>
        </div>
        <p>{dao.apiMetadata.description}</p>

        <div>
          <p>
            {/* {dao.guildBankValue.usd.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}{' '} */}
          </p>
          <div>
            <p>{dao.members.length} Members</p>
            <p>
              {dao.version === '2'
                ? `${dao.approvedTokens.length} Token${
                    dao.approvedTokens.length > 1 ? 's' : ''
                  }`
                : '1 Token'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExploreCard;
