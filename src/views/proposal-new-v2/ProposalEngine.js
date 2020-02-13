import React from 'react';
import { Link } from 'react-router-dom';

const ProposalEngine = () => {

    return (
        <div>
            <h1 className="Pad">New Proposal</h1>
            <ul>
                {/* TODO add full routes  */}
                <li><Link to="/proposal-member">Member</Link></li>
                <li><Link to="/proposal-funding">Funding</Link></li>
                <li><Link to="/proposal-whitelist">Whitelist Token</Link></li>
                <li><Link to="/proposal-guildkick">Guildkick</Link></li>
                <li><Link to="/proposal-trade">Trade</Link></li>
            </ul>
        </div>

    );
};

export default ProposalEngine;
