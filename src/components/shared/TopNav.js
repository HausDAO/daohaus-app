import React, { useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';

import {
  CurrentUserContext,
  DaoContext,
  DaoDataContext,
} from '../../contexts/Store';
import BcToast from './BcToast';

import './TopNav.scss';
import useModal from './useModal';
import Modal from './Modal';

const TopNav = (props) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [daoService] = useContext(DaoContext);
  const [daoData] = useContext(DaoDataContext);

  // Toggle functions
  const [isElementOpen, setElementOpen] = React.useState(false);
  const toggleElement = () => setElementOpen(!isElementOpen);
  const { isShowing, toggle } = useModal();
  const {
    location: { pathname },
  } = props;

  return (
    <div className="TopNav">
      {daoService && daoService.contract && (
        <>
          {pathname === `/dao/${daoService.contractAddr}/sign-in` ? (
            <div className="Button Back">
              <Link to={`/dao/${daoService.contractAddr}/`}>{'<='} Back</Link>
            </div>
          ) : (
            <>
              {pathname === `/dao/${daoService.contractAddr}/sign-in` ||
              pathname === `/dao/${daoService.contractAddr}/confirm` ? (
                <div className="Button Back">
                  <Link to={`/dao/${daoService.contractAddr}/`}>
                    {'<='} Back
                  </Link>
                </div>
              ) : (
                <>
                  {props.match.params.name === '/proposal/' ? (
                    <p>Back</p>
                  ) : (
                    <Link
                      className="Brand"
                      to={`/dao/${daoService.contractAddr}/`}
                    >
                      {daoData.name || 'PokéMol DAO'}
                    </Link>
                  )}
                </>
              )}
            </>
          )}
          {currentUser && <BcToast />}
          {currentUser ? (
            <div className="Auth">
              <button className="Auth__Button" onClick={toggleElement}>
                {currentUser.username}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 10l5 5 5-5z" />
                  <path d="M0 0h24v24H0z" fill="none" />
                </svg>
              </button>
              <div className={isElementOpen ? 'Dropdown__Open' : 'Dropdown'}>
                <Link
                  className="Dropdown__Open--Item"
                  to={`/dao/${daoService.contractAddr}/account`}
                  onClick={toggleElement}
                >
                  Account
                </Link>
                <button
                  className="Dropdown__Open--Item LinkButton"
                  onClick={() => {
                    toggleElement();
                    toggle('signOutMsg');
                  }}
                >
                  {'<='} Sign out
                </button>
                <Modal
                  isShowing={isShowing.signOutMsg}
                  hide={() => toggle('signOutMsg')}
                >
                  <h2>Confirm Sign Out?</h2>
                  <div className="IconWarning">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                    </svg>
                  </div>
                  <Link
                    className="AltOption"
                    to={`/dao/${daoService.contractAddr}/sign-out`}
                    onClick={() => {
                      toggle('signOutMsg');
                      toggleElement();
                    }}
                  >
                    Yes, sign me out.
                  </Link>
                </Modal>
              </div>
            </div>
          ) : (
            <div className="Auth">
              <Link
                className="Auth__Button"
                to={`/dao/${daoService.contractAddr}/sign-in`}
              >
                Sign in {'=>'}
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default withRouter(TopNav);
