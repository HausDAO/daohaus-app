import React, { useState, useContext } from 'react';
import { withApollo } from 'react-apollo';
import { Formik, Form } from 'formik';

import Loading from '../shared/Loading';

import {
  CurrentUserContext,
  CurrentWalletContext,
  LoaderContext,
  DaoServiceContext,
} from '../../contexts/Store';

const ApproveAllowance = ({ client, hide }) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [loading, setLoading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [daoService] = useContext(DaoServiceContext);
  const [formSuccess, setFormSuccess] = useState(false);

  return (
    <>
      {loading && <Loading />}
      <h2>Set Token Allowance</h2>
      <p>
        This token is used for submitting proposals in the DAO. You must approve
        the app to use your tokens.
      </p>
      <Formik
        initialValues={{
          amount: currentWallet.tokenBalance,
          addr: currentUser.attributes['custom:account_address'],
        }}
        validate={(values) => {
          const errors = {};
          if (!values.amount) {
            errors.amount = 'Required';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setLoading(true);
          try {
            await daoService.token.approve(
              daoService.web3.utils.toWei(values.amount),
            );
            setFormSuccess(true);
            hide('allowanceForm');
          } catch (e) {
            console.error(`Approving weth: ${e.toString()}`);
            alert(`Something went wrong. Please try again.`);
            setFormSuccess(false);
          }
          resetForm();
          setLoading(false);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) =>
          !formSuccess ? (
            <Form className="Form FlexCenter">
              <button type="submit" disabled={isSubmitting}>
                Approve
              </button>
            </Form>
          ) : (
            <h2>Approval Sent</h2>
          )
        }
      </Formik>
    </>
  );
};

export default withApollo(ApproveAllowance);
