import React from 'react';

import { FORM } from '../data/forms';
import MainViewLayout from '../components/mainViewLayout';

const NewerProposals = () => {
  return (
    <MainViewLayout header='Create Proposal' isDao>
      {Object.values(FORM).map(form => (
        <div key={form.name}>{form.title}</div>
      ))}
    </MainViewLayout>
  );
};

export default NewerProposals;
