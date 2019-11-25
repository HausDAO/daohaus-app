import React, { useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { CurrentUserContext, DaoContext } from '../../contexts/Store';
import BcToast from './BcToast';

import Brand from '../../assets/PokéMol__Logo.svg';
import './TopNav.scss';
import useModal from './useModal';
import Modal from './Modal';

const TopNav = (props) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [daoService] = useContext(DaoContext)

  // Toggle functions
  const [isElementOpen, setElementOpen] = React.useState(false);
  const toggleElement = () => setElementOpen(!isElementOpen);
  const { isShowing, toggle } = useModal();
  const {
    location: { pathname },
  } = props;

  return (
    <div className="TopNav">
      {currentUser && <BcToast />}
      <div
        className={isElementOpen ? 'Backdrop__Open' : 'Backdrop'}
        onClick={toggleElement}
      />
      {daoService && pathname === `/${daoService.contract.options.address}/sign-in` ? (
        <div className="Button Back">
          <Link to={`${daoService.contract.options.address}/`}>{'<='} Back</Link>
        </div>
      ) : (
        <>
          {daoService && pathname === `/${daoService.contract.options.address}/sign-in` || pathname === `/${daoService.contract.options.address}/confirm` ? (
            <div className="Button Back">
              <Link to={`${daoService.contract.options.address}/`}>{'<='} Back</Link>
            </div>
          ) : (
            <>
              {daoService && props.match.params.name === '/proposal/' ? (
                <p>Back</p>
              ) : (
                <Link className="Brand" to={`/${daoService.contract.options.address}/`}>
                  <img src={Brand} alt="Pocket Moloch" />
                </Link>
              )}
            </>
          )}
        </>
      )}

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
              to={`/${daoService.contract.options.address}/account`}
              onClick={toggleElement}
            >
              Account
            </Link>
            <button
              className="Dropdown__Open--Item LinkButton"
              onClick={() => toggle('signOutMsg')}
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
                to={`/${daoService.contract.options.address}/sign-out`}
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
          <Link className="Auth__Button" to={`/${daoService.contract.options.address}/sign-in`}>
            Sign in {'=>'}
          </Link>
        </div>
      )}
    </div>
  );
};
export default withRouter(TopNav);
