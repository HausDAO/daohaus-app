import React, { useState, useContext } from 'react';
import { useQuery } from 'react-apollo';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import {
  CurrentUserContext,
  LoaderContext,
  DaoServiceContext,
  DaoDataContext,
} from '../../contexts/Store';
import { GET_MOLOCH_SUPER } from '../../utils/QueriesSuper';
import Loading from '../shared/Loading';

const WithdrawForm = ({ client }) => {
  const [daoService] = useContext(DaoServiceContext);
  const [daoData] = useContext(DaoDataContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [loading, setLoading] = useContext(LoaderContext);
  const [formSuccess, setFormSuccess] = useState(false);

  const { error, data } = useQuery(GET_MOLOCH_SUPER, {
    variables: { contractAddr: daoData.contractAddress },
  });

  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      {loading && <Loading />}

      <h2>Send {data.tokenSymbol} from your wallet</h2>
      <Formik
        initialValues={{
          amount: '',
          addr: currentUser.attributes['custom:account_address'],
          dist: '',
        }}
        validate={(values) => {
          const errors = {};
          if (!values.amount) {
            errors.amount = 'Required';
          }
          if (!values.dist) {
            errors.dist = 'Required';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setLoading(true);
          try {
            await daoService.token.transfer(
              values.dist,
              daoService.web3.utils.toWei('' + values.amount),
            );
          } catch (e) {
            console.error(`Error withdrawing: ${e.toString()}`);
            alert(`Something went wrong. Please try again.`);
          } finally {
            resetForm();
            setLoading(false);
            setSubmitting(false);
            setFormSuccess(true);
          }
        }}
      >
        {({ isSubmitting }) =>
          !formSuccess ? (
            <Form className="Form">
              <Field name="dist">
                {({ field, form }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>Destination</label>
                    <input type="text" {...field} />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="dist"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <Field name="amount">
                {({ field, form }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>Amount</label>
                    <input
                      min="0"
                      type="number"
                      inputMode="numeric"
                      step="any"
                      {...field}
                    />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="amount"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <button type="submit" disabled={isSubmitting}>
                Withdraw
              </button>
            </Form>
          ) : (
            <h2>Token Sent</h2>
          )
        }
      </Formik>
    </>
  );
};

export default WithdrawForm;
