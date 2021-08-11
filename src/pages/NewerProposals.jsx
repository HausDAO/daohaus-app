import React from 'react';
import MainViewLayout from '../components/mainViewLayout';
import { FORM } from '../data/forms';

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
