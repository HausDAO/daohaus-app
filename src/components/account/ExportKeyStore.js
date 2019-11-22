import React, { useContext } from 'react';

import { Formik, Form, Field, ErrorMessage } from 'formik';

import Web3Service from '../../utils/Web3Service';

import { CurrentUserContext } from '../../contexts/Store';

import config from '../../config';

const ExportKeyStore = () => {
  const [currentUser] = useContext(CurrentUserContext);

  return (
    <>
      <h3>Export Keystore File</h3>
      <Formik
        initialValues={{
          password: '',
          addr: currentUser.attributes['custom:account_address'],
        }}
        validate={(values) => {
          let errors = {};
          if (!values.password) {
            errors.password = 'Required';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const web3Service = new Web3Service();
          const network = config.SDK_ENV.toLowerCase();
          const aValue = JSON.parse(
            localStorage.getItem(`@archanova:${network}:device:private_key`),
          );

          const store = await web3Service.getKeyStore(
            '0x' + aValue.data,
            values.password,
          );

          var a = document.createElement('a');
          var file = new Blob([JSON.stringify(store)], {
            type: 'text/plain',
          });
          a.href = URL.createObjectURL(file);
          a.download = `${values.addr}-keystore.json`;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="Form">
            <label htmlFor="password">Password</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Keystore
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ExportKeyStore;
