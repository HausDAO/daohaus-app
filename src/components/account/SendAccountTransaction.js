import React, { useContext } from 'react';

import { Formik, Form, Field, ErrorMessage } from 'formik';

import { ethToWei } from '@netgum/utils'; // returns BN
import BcProcessorService from '../../utils/BcProcessorService';
import Web3Service from '../../utils/Web3Service';

import {
  CurrentUserContext,
  CurrentWalletContext,
  LoaderContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

const SendAccountTransaction = () => {
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [loading, setLoading] = useContext(LoaderContext);

  return (
    <>
      {loading && <Loading />}
      <h3>Send Account Transaction</h3>
      <Formik
        initialValues={{
          addr: currentUser.attributes['custom:account_address'],
          contractAddr: '',
          data: '',
        }}
        validate={(values) => {
          let errors = {};
          if (!values.data) {
            errors.addr = 'Required';
          }
          if (!values.contractAddr) {
            errors.contractAddr = 'Required';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const sdk = currentUser.sdk;
          const bcprocessor = new BcProcessorService();
          const web3Service = new Web3Service();

          const bnZed = ethToWei(0);

          setLoading(true);

          try {
            const estimated = await sdk.estimateAccountTransaction(
              values.contractAddr,
              bnZed,
              values.data,
            );

            // console.log(estimated);
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
              `Send Account Transaction: ${values.amount}`,
              true,
            );
          } catch (err) {
            console.log(err);
            alert(`Something went wrong. please try again`);
          }

          setLoading(false);
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="Form">
            <label htmlFor="contractAddr">Contract Address</label>
            <Field type="text" name="contractAddr" />
            <label htmlFor="data">Encoded Data</label>
            <Field type="text" name="data" component="textarea" />
            <ErrorMessage name="data" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Send Account Transaction
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SendAccountTransaction;
