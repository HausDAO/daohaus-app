import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { FormContainer, FieldContainer } from '../../App.styles';

import {
  LoaderContext,
  DaoServiceContext,
  CurrentUserContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';
import Web3 from 'web3';

const ChangeDelegateKeyForm = ({ hide }) => {
  const [daoService] = useContext(DaoServiceContext);
  const [loading, setLoading] = useContext(LoaderContext);
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [formSuccess, setFormSuccess] = useState(false);

  const txCallBack = (txHash, name) => {
    if (currentUser?.txProcessor) {
      currentUser.txProcessor.setTx(
        txHash,
        currentUser.username,
        name,
        true,
        false,
      );
      currentUser.txProcessor.forceUpdate = true;
      setCurrentUser({ ...currentUser });
    }
  };

  return (
    <FormContainer>
      {loading && <Loading />}

      <h2>Change Delegate Key</h2>
      <Formik
        initialValues={{
          newDelegateKey: '',
        }}
        validate={(values) => {
          const errors = {};
          if (!values.newDelegateKey) {
            errors.newDelegateKey = 'Required';
          }
          if (!Web3.utils.isAddress(values.newDelegateKey)) {
            errors.newDelegateKey = 'Must be a valid ETH address';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setLoading(true);
          try {
            await daoService.mcDao.updateDelegateKey(
              values.newDelegateKey,
              txCallBack,
            );
            setFormSuccess(true);
            hide('changeDelegateKey');
          } catch (e) {
            console.error(`Error changing delegate key: ${e.toString()}`);
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
              <Field name="newDelegateKey">
                {({ field }) => (
                  <FieldContainer
                    className={field.value ? 'Field HasValue' : 'Field '}
                  >
                    <label>New Delegate Key Address</label>
                    <input type="text" {...field} />
                  </FieldContainer>
                )}
              </Field>
              <ErrorMessage
                name="newDelegateKey"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          ) : (
            <h2>Delegate Key Changed Successfully!</h2>
          )
        }
      </Formik>
    </FormContainer>
  );
};

export default ChangeDelegateKeyForm;
