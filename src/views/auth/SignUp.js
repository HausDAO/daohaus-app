import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { Auth } from 'aws-amplify';

import Loading from '../../components/shared/Loading';

const SignUp = ({ history }) => {
  const [authError, setAuthError] = useState();

  return (
    <div>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          passwordConfirm: '',
        }}
        validate={(values) => {
          let errors = {};
          const regexPasswordValidation = new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&.,])\\S*$',
          );
          if (!values.username) {
            errors.username = 'Required';
          }
          if (!values.email) {
            errors.email = 'Required';
          }
          if (!values.password) {
            errors.password = 'Required';
          }
          if (values.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
          }
          if (!regexPasswordValidation.test(values.password)) {
            errors.password =
              'Password must contain an uppercase letter, a lowercase letter, a number and a special character';
          }
          if (!values.passwordConfirm) {
            errors.passwordConfirm = 'Required';
          }
          if (values.password !== values.passwordConfirm) {
            errors.passwordConfirm = 'Passwords do not match';
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          // set custom attributes to 0x0 as place holder
          try {
            await Auth.signUp({
              username: values.username,
              password: values.password,
              attributes: {
                email: values.email,
                'custom:account_address': '0x0',
                'custom:device_address': '0x0',
              },
            });
            history.push({
              pathname: '/confirm',
              state: { userName: values.username },
            });
          } catch (err) {
            console.log('error signing up: ', err);
            setSubmitting(false);
            setAuthError(err);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => {
          if (isSubmitting) {
            return <Loading />;
          }

          return (
            <Form className="Form">
              <h2 className="Pad">New Account</h2>
              <button className="RiskyBiz Short">
                <span role="alert" aria-label="skull and crossbones">
                  ☠
                </span>
                Write down your password! It cannot be recovered.
              </button>
              {authError && (
                <div className="Form__auth-error">{authError.message}</div>
              )}
              <Field name="username">
                {({ field, form }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>Pseudonym</label>
                    <input type="text" {...field} />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="username"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <Field name="email">
                {({ field, form }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>Email</label>
                    <input type="email" {...field} />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="email"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <Field name="password">
                {({ field, form }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>Password</label>
                    <input type="password" {...field} />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="password"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <Field name="passwordConfirm">
                {({ field, form }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>Confirm password</label>
                    <input type="password" {...field} />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="passwordConfirm"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <button
                type="submit"
                className={
                  Object.keys(errors).length < 1 &&
                  Object.keys(touched).length > 2
                    ? ''
                    : 'Disabled'
                }
                disabled={isSubmitting}
              >
                Submit
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default withRouter(SignUp);
