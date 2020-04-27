import React, { useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';

import {
  CurrentUserContext,
  DaoServiceContext,
  DaoDataContext,
} from '../../contexts/Store';
import BcToast from './BcToast';

import useModal from './useModal';
import Modal from './Modal';
import styled from 'styled-components';
import { phone, getAppLight, getPrimaryHover } from '../../variables.styles';
import {
  BackdropOpenDiv,
  BackdropDiv,
  ButtonBackDiv,
  LinkButton,
  ButtonButton,
} from '../../App.styles';

const TopNavDiv = styled.div`
  position: relative;
  width: 100%;
  height: 62px;
`;

const BrandLink = styled(Link)`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(0, -50%);
  font-weight: 900;
  color: ${(props) => props.theme.baseFontColor};
  background-image: url(${(props) => props.theme.brand});
  background-size: contain;
  background-repeat: no-repeat;
  height: 48px;
  width: ${(props) => (props.theme.brand === '' ? 'auto' : '180px')};
  min-width: 180px;
  font-size: 1.5em;
  .DaoText {
    display: ${(props) => (props.theme.brand === '' ? 'block' : 'none')};
    margin-top: 8px;
  }
  img {
    height: 48px;
  }
  &:hover {
    color: ${(props) => props.theme.primary};
  }
  @media (max-width: ${phone}) {
    font-size: 1.15em;
    max-width: 50%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const AuthDiv = styled.div`
  position: absolute;
  top: 15px;
  right: 0px;
  border: 2px solid ${(props) => props.theme.baseFontColor};
  border-radius: 16px;
  padding: 5px 15px;
  background-color: ${(props) => getAppLight(props.theme)};
  transition: all 0.15s linear;
  font-weight: 900;
  z-index: 98;
  a {
    color: ${(props) => props.theme.baseFontColor};
    &:hover {
      color: ${(props) => props.theme.primary};
    }
  }
`;

const AuthButton = styled(ButtonButton)`
  border-radius: 0px;
  padding: 0px;
  padding-right: 12px;
  margin: 0;
  text-decoration: none;
  transition: all 0.15s ease-in-out;
  background-color: transparent;
  color: ${(props) => props.theme.baseFontColor};
  width: 90px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
  svg {
    display: block;
    position: absolute;
    right: -5px;
    top: -3px;
    fill: ${(props) => props.theme.baseFontColor};
  }
  &:hover {
    color: ${(props) => getPrimaryHover(props.theme)};
    background: transparent;
    svg {
      fill: ${(props) => getPrimaryHover(props.theme)};
    }
  }
`;

const DropdownDiv = styled.div`
  position: relative;
  height: ${(props) => (props.open ? 'auto' : '0px')};
  overflow: ${(props) => (props.open ? 'visible' : 'hidden')};
  transition: all 0.15s linear;
`;

const DropdownItemDiv = styled.div`
  margin: 20px 0px;
  display: block;
`;

const TopNav = (props) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [daoService] = useContext(DaoServiceContext);
  const [daoData] = useContext(DaoDataContext);
  const [isElementOpen, setElementOpen] = React.useState(false);
  const toggleElement = () => setElementOpen(!isElementOpen);
  const { isShowing, toggle } = useModal();
  const {
    location: { pathname },
  } = props;

  return (
    <TopNavDiv>
      {daoService && daoService.mcDao.daoContract && (
        <>
          {isElementOpen ? (
            <BackdropOpenDiv blank onClick={toggleElement} />
          ) : (
            <BackdropDiv onClick={toggleElement} />
          )}
          {currentUser && <BcToast />}

          {pathname === `/dao/${daoService.daoAddress}/sign-in` ? (
            <ButtonBackDiv>
              <Link to={`/dao/${daoService.daoAddress}/`}>{'<='} Back</Link>
            </ButtonBackDiv>
          ) : (
            <>
              {pathname === `/dao/${daoService.daoAddress}/sign-up` ||
              pathname === '/confirm' ? (
                <ButtonBackDiv>
                  <Link to={`/dao/${daoService.daoAddress}/`}>{'<='} Back</Link>
                </ButtonBackDiv>
              ) : (
                <>
                  {pathname ===
                  `/dao/${daoService.daoAddress}/proposal-engine` ? (
                    <ButtonBackDiv>
                      <Link to={`/dao/${daoService.daoAddress}/proposals`}>
                        {'<='} Back
                      </Link>
                    </ButtonBackDiv>
                  ) : (
                    <BrandLink to={`/dao/${daoService.daoAddress}/`}>
                      <span className="DaoText">
                        {(daoData && daoData.name) || 'PokéMol DAO'}
                      </span>
                    </BrandLink>
                  )}
                </>
              )}
            </>
          )}

          {currentUser ? (
            <AuthDiv>
              <AuthButton onClick={toggleElement}>
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
              </AuthButton>
              <DropdownDiv open={isElementOpen}>
                <DropdownItemDiv open>
                  <Link
                    to={
                      '/dao/' + daoService.daoAddress.toLowerCase() + '/account'
                    }
                    onClick={toggleElement}
                  >
                    Account
                  </Link>
                </DropdownItemDiv>
                <DropdownItemDiv open>
                  <LinkButton
                    onClick={() => {
                      toggleElement();
                      toggle('signOutMsg');
                    }}
                    to="/"
                  >
                    {'<='} Sign out
                  </LinkButton>
                </DropdownItemDiv>
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
                    to={`/dao/${daoService.daoAddress}/sign-out`}
                    onClick={() => {
                      toggle('signOutMsg');
                      toggleElement();
                    }}
                  >
                    Yes, sign me out.
                  </Link>
                </Modal>
              </DropdownDiv>
            </AuthDiv>
          ) : (
            <AuthDiv>
              <Link
                className="Auth__Button"
                to={`/dao/${daoService.daoAddress}/sign-in`}
              >
                Sign in {'=>'}
              </Link>
            </AuthDiv>
          )}
        </>
      )}
    </TopNavDiv>
  );
};
export default withRouter(TopNav);
