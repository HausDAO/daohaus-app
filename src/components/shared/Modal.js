import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.scss';

const Modal = ({ isShowing, hide, children }) =>
  isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="ModalBackdrop" />
          <div
            className="Modal"
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
          >
            <button
              type="button"
              className="Close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={hide}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </button>
            <div className="Contents FlexCenter">{children}</div>
          </div>
        </React.Fragment>,
        document.body,
      )
    : null;

export default Modal;
