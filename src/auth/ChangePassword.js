import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { Auth } from 'aws-amplify';

import Loading from '../components/shared/Loading';
import Web3Service from '../utils/Web3Service';
import config from '../config';
import { CurrentUserContext } from '../contexts/Store';

const ChangePassword = () => {
  //component used for changing password
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

  const [authError, setAuthError] = useState();
  const [authSuccess, setAuthSuccess] = useState(false);

  return (
    <div>
      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
          newPasswordConfirm: '',
        }}
        validate={(values) => {
          let errors = {};
          const regexPasswordValidation = new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&.,])\\S*$',
          );

          if (!values.oldPassword) {
            errors.oldPassword = 'Required';
          }
          if (values.newPassword.length < 8) {
            errors.newPassword = 'Password must be at least 8 characters long';
          }
          if (!regexPasswordValidation.test(values.newPassword)) {
            errors.newPassword =
              'Password must contain an uppercase letter, a lowercase letter, a number and a special character';
          }
          if (!values.newPassword) {
            errors.newPassword = 'Required';
          }
          if (!values.newPasswordConfirm) {
            errors.newPasswordConfirm = 'Required';
          }
          if (values.newPassword !== values.newPasswordConfirm) {
            errors.newPasswordConfirm = 'New Passwords do not match';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const web3Service = new Web3Service();

          try {
            const user = await Auth.currentAuthenticatedUser();

            await Auth.changePassword(
              user,
              values.oldPassword,
              values.newPassword,
            );

            // create keystore
            const network = config.SDK_ENV.toLowerCase();
            const keyValue = JSON.parse(
              localStorage.getItem(`@archanova:${network}:device:private_key`),
            );

            const deviceValue = JSON.parse(
              localStorage.getItem(`@archanova:${network}:account_device`),
            );

            const store = await web3Service.getKeyStore(
              '0x' + keyValue.data,
              values.newPassword,
            );
            await Auth.updateUserAttributes(user, {
              'custom:encrypted_ks': JSON.stringify(store),
              'custom:device_address': deviceValue.device.address,
            });
            const attributes = await Auth.currentUserInfo();
            console.log('attributes', attributes);
            setCurrentUser( { ...currentUser, ...{ attributes: attributes.attributes } })
            setSubmitting(false);
            setAuthSuccess(true);
          } catch (err) {
            console.log('error changing pass: ', err);
            setSubmitting(false);
            setAuthError(err);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => {
          if (isSubmitting) {
            return <Loading />;
          }

          return !authSuccess ? (
            <Form className="Form">
              <h2>Update your password</h2>
              <button className="RiskyBiz Short">
                <span role="alert" aria-label="skull and crossbones">
                  ☠
                </span>
                Write down your password! It cannot be recovered.
              </button>
              {authError && (
                <div className="Form__auth-error">{authError.message}</div>
              )}

              <Field name="oldPassword">
                {({ field, form }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>Old Password</label>
                    <input type="password" {...field} />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="oldPassword"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <Field name="newPassword">
                {({ field, form }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>New password</label>
                    <input type="password" {...field} />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="newPassword"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <Field name="newPasswordConfirm">
                {({ field, form }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>New password Confirm</label>
                    <input type="password" {...field} />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="newPasswordConfirm"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <button
                type="submit"
                className={
                  Object.keys(errors).length < 1 &&
                  Object.keys(touched).length > 1
                    ? ''
                    : 'Disabled'
                }
                disabled={isSubmitting}
              >
                Submit
              </button>
            </Form>
          ) : (
            <h2>Password Changed Successfully.</h2>
          );
        }}
      </Formik>
    </div>
  );
};

export default withRouter(ChangePassword);
