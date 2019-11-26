import React, { useState, useContext } from 'react';
import { withApollo } from 'react-apollo';
import { Formik, Form } from 'formik';
import { ethToWei } from '@netgum/utils'; // returns BN

import { GET_METADATA } from '../../utils/Queries';
import TokenService from '../../utils/TokenService';
import Web3Service from '../../utils/Web3Service';
import BcProcessorService from '../../utils/BcProcessorService';
import Loading from '../shared/Loading';

import {
  CurrentUserContext,
  CurrentWalletContext,
  LoaderContext,
  DaoContext,
} from '../../contexts/Store';

const ApproveAllowance = ({ client }) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [loading, setLoading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [daoService] = useContext(DaoContext)
  const [formSuccess, setFormSuccess] = useState(false);
  const { approvedToken } = client.cache.readQuery({
    query: GET_METADATA,
  });

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
          const sdk = currentUser.sdk;
          const tokenService = new TokenService(approvedToken);

          const web3Service = new Web3Service();
          const bcprocessor = new BcProcessorService();

          const bnZed = ethToWei(0);

          setLoading(true);
          try {
            const data = await tokenService.approve(
              values.addr,
              daoService.contractAddr,
              web3Service.toWei(values.amount),
              true,
            );

            const estimated = await sdk.estimateAccountTransaction(
              tokenService.contractAddr,
              bnZed,
              data,
            );

            if (ethToWei(currentWallet.eth).lt(estimated.totalCost)) {
              alert(
                `you need more gas, at least: ${web3Service.fromWei(
                  estimated.totalCost.toString(),
                )}`,
              );
              setLoading(false);
              setSubmitting(false);
              return false;
            }

            const hash = await sdk.submitAccountTransaction(estimated);

            bcprocessor.setTx(
              hash,
              currentUser.attributes['custom:account_address'],
              `Update Token Allowance to ${values.amount}`,
              true,
            );
          } catch (err) {
            console.log(err);
            alert(`Something went wrong. please try again`);
          }

          resetForm();
          setLoading(false);
          setSubmitting(false);
          setFormSuccess(true);
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
