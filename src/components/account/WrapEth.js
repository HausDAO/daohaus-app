import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ethToWei } from '@netgum/utils'; // returns BN

import WethService from '../../utils/WethService';
import Web3Service from '../../utils/Web3Service';
import BcProcessorService from '../../utils/BcProcessorService';
import Loading from '../shared/Loading';
import DepositForm from './DepositForm';

import {
  CurrentUserContext,
  LoaderContext,
  CurrentWalletContext,
} from '../../contexts/Store';
import useModal from '../shared/useModal';

const WrapEth = () => {
  const [currentUser] = useContext(CurrentUserContext);
  const [loading, setLoading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const { toggle } = useModal();

  const canWrapEth = () => {
    return currentWallet.eth > 0;
  };
  return (
    <>
      {loading && <Loading />}
      <h2>Wrap ETH into wETH</h2>
      <p>Wrapping ETH into wETH allows your ETH to function as an ERC-20.</p>
      {canWrapEth() ? (
        <Formik
          initialValues={{
            amount: '',
            addr: currentUser.attributes['custom:account_address'],
          }}
          validate={(values) => {
            let errors = {};
            if (!values.amount) {
              errors.amount = 'Required';
            }

            if (values.amount > currentWallet.eth) {
              errors.amount = `You can not wrap more eth than you have, remember to leave some for gas. You have ${
                currentWallet.eth
              } `;
            }

            return errors;
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const sdk = currentUser.sdk;
            const wethService = new WethService();
            const web3Service = new Web3Service();
            const bcprocessor = new BcProcessorService();
            const bnAmount = ethToWei(values.amount);

            setLoading(true);

            const data = await wethService.deposit(
              values.addr,
              web3Service.toWei(values.amount),
              true,
            );
            try {
              const estimated = await sdk.estimateAccountTransaction(
                wethService.contractAddr,
                bnAmount,
                data,
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
                `Wrap ${values.amount} ETH`,
                true,
              );
            } catch (err) {
              console.log(err);
              alert(`Something went wrong. please try again`);
            }

            resetForm();
            setLoading(false);
            setSubmitting(false);
            toggle('wrapForm');
          }}
        >
          {({ isSubmitting }) => (
            <Form className="Form">
              <Field name="amount">
              {({ field, form }) => (
                <div
                  className={
                    field.value
                      ? 'Field HasValue'
                      : 'Field '
                  }
                >
                  <label>Amount</label>
                  <input min="0" type="number" inputMode="numeric" step="any" {...field} />
                </div>
              )}
              </Field>
              <ErrorMessage name="amount" render={msg => <div className="Error">{msg}</div>} />
              <button type="submit" disabled={isSubmitting}>
                Wrap
              </button>
            </Form>
          )}
        </Formik>
      ) : (
        <>
          <p>You must have some ETH to wrap it.</p>
          <DepositForm className="FlexCenter" />
        </>
      )}
    </>
  );
};

export default WrapEth;
