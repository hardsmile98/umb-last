import React from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { getLocales } from 'utils';

function ModalConfirm({
  modal,
  toggle,
  action,
  consequences,
  loading,
  sendData,
}) {
  return (
    <Modal
      size="md"
      isOpen={modal}
      toggle={toggle}
    >
      <div className="modal-header text-center">
        <h4 className="modal-title font-m">
          {getLocales('Подтверждение действия')}
        </h4>
      </div>

      <ModalBody>
        <p className="avatar-block font-m">
          {action}
          {' '}
          {consequences ? (
            <>
              <br />

              <span className="text-danger">
                {consequences}
              </span>
            </>
          ) : ''}
        </p>
      </ModalBody>

      <ModalFooter>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4">
              <button
                type="button"
                value={getLocales('Закрыть')}
                className="btn btn-secondary font-m auth-btn"
                onClick={toggle}
              >
                {getLocales('Закрыть')}
              </button>
            </div>

            <div className="col-lg-8">
              <button
                type="button"
                disabled={loading}
                onClick={sendData}
                value={getLocales('Подтвердить')}
                className="btn font-m auth-btn btn-primary"
              >
                {loading
                  ? getLocales('Загрузка...')
                  : getLocales('Подтвердить')}
              </button>
            </div>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default ModalConfirm;
