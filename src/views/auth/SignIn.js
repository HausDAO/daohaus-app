import React, { useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Auth, Storage } from 'aws-amplify';
import shortid from 'shortid';

import {
  SdkEnvironmentNames,
  getSdkEnvironment,
  createSdk,
} from '@archanova/sdk';

import config from '../../config';

import { CurrentUserContext } from '../../contexts/Store';
import Loading from '../../components/shared/Loading';
import Web3Service from '../../utils/Web3Service';

const sdkEnv = getSdkEnvironment(SdkEnvironmentNames[`${config.SDK_ENV}`]); // kovan env by default

const SignIn = (props) => {
  const { history } = props;
  const [, setCurrentUser] = useContext(CurrentUserContext);
  const [authError, setAuthError] = useState();
  const [pseudonymTouch, setPseudonymTouch] = useState(false);
  const [passwordTouch, setPasswordTouch] = useState(false);

  let historyState = history.location.state;

  return (
    <div>
      {historyState && historyState.msg && (
        <div className="EmailConfirmed">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="none" d="M0 0h24v24H0V0z" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" />
          </svg>{' '}
          {historyState.msg}
        </div>
      )}
      <Formik
        initialValues={{ username: '', password: '' }}
        validate={(values) => {
          let errors = {};
          if (!values.username) {
            errors.username = 'Required';
          }
          if (!values.username) {
            errors.password = 'Required';
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          const web3Service = new Web3Service();

          try {
            const user = await Auth.signIn({
              username: values.username,
              password: values.password,
            });

            const sdk = new createSdk(
              sdkEnv.setConfig('storageAdapter', localStorage),
            );
            const network = config.SDK_ENV.toLowerCase();

            // account address is set to 0x0 on signup
            // update this value after sdk is initialized and created
            // if account address exists on aws auth connect account to sdk
            if (user.attributes['custom:account_address'] !== '0x0') {
              // if pk is in local storage then user has already connected but was timed out
              if (
                localStorage.getItem(`@archanova:${network}:device:private_key`)
              ) {
                await sdk.initialize();
              } else {
                try {
                  const key = web3Service.decryptKeyStore(
                    user.attributes['custom:encrypted_ks'],
                    values.password,
                  );

                  const options = {
                    device: { privateKey: key.privateKey },
                  };

                  await sdk.initialize(options);
                } catch (err) {
                  console.log(err); // {"error":"account device not found"}
                }
              }

              try {
                sdk.connectAccount(user.attributes['custom:account_address']);

                //currentUserInfo returns the correct attributes
                const attributes = await Auth.currentUserInfo();
                const realuser = {
                  ...user,
                  ...{ attributes: attributes.attributes },
                };
                setCurrentUser({ ...realuser, ...{ sdk } });
                setSubmitting(false);
                history.push('/proposals');
              } catch (err) {
                console.log(err); // {"error":"account device not found"}
              }
            } else {
              // first time logging in
              await sdk.initialize();
              const uuid = shortid.generate();
              const ensLabel = `${encodeURI(user.username)}-${uuid}`;
              const account = await sdk.createAccount(ensLabel);
              const accountDevices = await sdk.getConnectedAccountDevices();

              // create keystore
              const network = config.SDK_ENV.toLowerCase();
              const aValue = JSON.parse(
                localStorage.getItem(
                  `@archanova:${network}:device:private_key`,
                ),
              );

              const store = await web3Service.getKeyStore(
                '0x' + aValue.data,
                values.password,
              );

              await Auth.updateUserAttributes(user, {
                'custom:account_address': account.address,
                'custom:device_address': accountDevices.items[0].device.address,
                'custom:ens_name': ensLabel,
                'custom:named_devices': JSON.stringify({
                  'OG device': accountDevices.items[0].device.address,
                }),
                'custom:encrypted_ks': JSON.stringify(store),
              });
              const jsonse = JSON.stringify(
                {
                  username: user.username,
                  deviceId: accountDevices.items[0].device.address,
                },
                null,
                2,
              );
              const blob = new Blob([jsonse], {
                type: 'application/json',
              });
              try {
                // save user meta to S3
                Storage.put(
                  `member_${account.address.toUpperCase()}.json`,
                  blob,
                  {
                    contentType: 'text/json',
                  },
                );
              } catch (err) {
                console.log('storage error', err);
              }

              const attributes = await Auth.currentUserInfo();
              const realuser = {
                ...user,
                ...{ attributes: attributes.attributes },
              };
              setCurrentUser({ ...realuser, ...{ sdk } });

              setSubmitting(false);

              history.push({
                pathname: '/',
                state: { signUpModal: true },
              });
            }
          } catch (err) {
            setAuthError(err);
            setSubmitting(false);
            console.log('error signing in: ', err);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => {
          if (isSubmitting) {
            return <Loading />;
          }

          return (
            <Form className="Form">
              <h2>Sign in</h2>
              <Link to="/sign-up">Create a new account =></Link>
              {authError && (
                <div className="Form__auth-error">
                  <p className="Danger">{authError.message}</p>
                </div>
              )}
              <Field name="username">
                {({ field, form }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>Pseudonym</label>
                    <input
                      type="text"
                      {...field}
                      onInput={() => setPseudonymTouch(true)}
                    />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="username"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <Field type="password" name="password">
                {({ field, form }) => (
                  <div className={field.value ? 'Field HasValue' : 'Field '}>
                    <label>Password</label>
                    <input
                      type="password"
                      {...field}
                      onInput={() => setPasswordTouch(true)}
                    />
                  </div>
                )}
              </Field>
              <ErrorMessage
                name="password"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              <div className="ButtonGroup">
                <button
                  type="submit"
                  className={
                    Object.keys(errors).length < 1 &&
                    pseudonymTouch &&
                    passwordTouch
                      ? ''
                      : 'Disabled'
                  }
                  disabled={isSubmitting}
                >
                  Sign In
                </button>
                {/* Commented out until possible <Link to="/forgot-password">Forgot Password?</Link> */}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default withRouter(SignIn);
