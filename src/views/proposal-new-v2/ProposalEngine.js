import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { DaoDataContext } from '../../contexts/Store';

const ProposalEngine = () => {
    const [daoData] = useContext(DaoDataContext);
    console.log('daoData', daoData);
    

    return (
        <div>
            <h1 className="Pad">New Proposal</h1>
            <ul>
                {/* TODO add full routes  */}
                <li><Link to={`/dao/${daoData.contractAddress}/proposal-member`}>Member</Link></li>
                <li><Link to={`/dao/${daoData.contractAddress}/proposal-funding`}>Funding</Link></li>
                <li><Link to={`/dao/${daoData.contractAddress}/proposal-whitelist`}>Whitelist Token</Link></li>
                <li><Link to={`/dao/${daoData.contractAddress}/proposal-guildkick`}>Guildkick</Link></li>
                <li><Link to={`/dao/${daoData.contractAddress}/proposal-trade`}>Trade</Link></li>
            </ul>
        </div>

    );
};

export default ProposalEngine;
