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
                <li><Link to={`/dao/${daoData.contractAddress}/proposal-member`}>Member</Link></li>
                <li><Link className='disabled-link' to={`/dao/${daoData.contractAddress}/proposal-funding`}>Funding (comming soon) </Link></li>
                <li><Link className='disabled-link' to={`/dao/${daoData.contractAddress}/proposal-whitelist`}>Whitelist Token (comming soon) </Link></li>
                <li><Link className='disabled-link' to={`/dao/${daoData.contractAddress}/proposal-guildkick`}>Guildkick (comming soon) </Link></li>
                <li><Link className='disabled-link' to={`/dao/${daoData.contractAddress}/proposal-trade`}>Trade (comming soon) </Link></li>
            </ul>
        </div>

    );
};

export default ProposalEngine;
