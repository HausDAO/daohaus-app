import React, { useState, useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FieldContainer } from '../../App.styles';

import {
  LoaderContext,
  DaoServiceContext,
  CurrentWalletContext,
  DaoDataContext,
  CurrentUserContext,
} from '../../contexts/Store';
import Loading from '../shared/Loading';

const RagequitForm = ({ hide }) => {
  const [daoService] = useContext(DaoServiceContext);
  const [currentWallet, setCurrentWallet] = useContext(CurrentWalletContext);
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [loading, setLoading] = useContext(LoaderContext);
  const [formSuccess, setFormSuccess] = useState(false);
  const [canRage, setCanRage] = useState(true);
  const [daoData] = useContext(DaoDataContext);

  const txCallBack = (txHash, name) => {
    if (currentUser?.txProcessor) {
      currentUser.txProcessor.setTx(
        txHash,
        currentUser.username,
        name,
        true,
        false,
      );
       
      setCurrentUser({ ...currentUser });
    }
  };

  useEffect(() => {
    const checkCanRage = async () => {
      const rageOk = await daoService.mcDao.canRagequit(
        currentWallet.highestIndexYesVote,
      );
      setCanRage(rageOk);
    };

    checkCanRage();
    // eslint-disable-next-line
  }, [currentWallet]);

  if (!canRage) {
    return <h2>Cannot Rage while yes votes on open proposals</h2>;
  }

  return (
    <>
      {loading && <Loading />}

      <Formik
        initialValues={{
          numShares: '',
          numLoot: '',
        }}
        validate={(values) => {
          const errors = {};
          if (values.numShares > currentWallet.shares) {
            errors.numShares = `Must be less than ${currentWallet.shares}`;
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setLoading(true);

          try {
            if (daoData.version === 2) {
              await daoService.mcDao.rageQuit(
                values.numShares || 0,
                values.numLoot || 0,
                txCallBack,
              );
            } else {
              await daoService.mcDao.rageQuit(
                values.numShares || 0,
                txCallBack,
              );
            }

            setFormSuccess(true);
          } catch (e) {
            console.error(`Error ragequitting: ${e.toString()}`);
            alert(`Something went wrong. Please try again.`);
            setFormSuccess(false);
          } finally {
            resetForm();
            currentWallet.shares =
              currentWallet.shares - (values.numShares || 0);
            currentWallet.loot = currentWallet.loot - (values.numLoot || 0);
            setCurrentWallet(currentWallet);
            setLoading(false);
            setSubmitting(false);
            hide('ragequit');
          }
        }}
      >
        {({ isSubmitting }) =>
          !formSuccess && !loading ? (
            <Form className="Form">
              <p>Ragequit up to {currentWallet.shares} Shares</p>
              <Field name="numShares">
                {({ field }) => (
                  <FieldContainer
                    className={field.value ? 'Field HasValue' : 'Field '}
                  >
                    <label>Number of Shares</label>
                    <input
                      min="0"
                      type="number"
                      inputMode="numeric"
                      step="any"
                      {...field}
                    />
                  </FieldContainer>
                )}
              </Field>
              <ErrorMessage
                name="numShares"
                render={(msg) => <div className="Error">{msg}</div>}
              />
              {daoData.version === 2 && (
                <>
                  <p>Ragequit up to {currentWallet.loot} Loot</p>
                  <Field name="numLoot">
                    {({ field }) => (
                      <FieldContainer
                        className={field.value ? 'Field HasValue' : 'Field '}
                      >
                        <label>Number of Loot Shares</label>
                        <input
                          min="0"
                          type="number"
                          inputMode="numeric"
                          step="any"
                          {...field}
                        />
                      </FieldContainer>
                    )}
                  </Field>
                  <ErrorMessage
                    name="numLoot"
                    render={(msg) => <div className="Error">{msg}</div>}
                  />
                </>
              )}
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
