import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import {
  LoaderContext,
  DaoServiceContext,
  CurrentWalletContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

const RagequitForm = () => {
  const [daoService] = useContext(DaoServiceContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [loading, setLoading] = useContext(LoaderContext);
  const [formSuccess, setFormSuccess] = useState(false);

  return (
    <>
      {loading && <Loading />}

      <h2>Ragequit Up To {currentWallet.shares} Shares</h2>
      <Formik
        initialValues={{
          numShares: '',
        }}
        validate={(values) => {
          const errors = {};
          if (!values.numShares) {
            errors.numShares = 'Required';
          }
          if (values.numShares > currentWallet.shares) {
            errors.numShares = `Must be less than ${currentWallet.shares}`;
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setLoading(true);
          try {
            await daoService.mcDao.rageQuit(values.numShares);
            setFormSuccess(true);
          } catch (e) {
            console.error(`Error ragequitting: ${e.toString()}`);
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
            <Form className="Form">
              <Field name="numShares">
                {({ field }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>Number of Shares</label>
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
                name="numShares"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <button type="submit" disabled={isSubmitting}>
                Ragequit
              </button>
            </Form>
          ) : (
            <h2>Ragequit Successful</h2>
          )
        }
      </Formik>
    </>
  );
};

export default RagequitForm;
