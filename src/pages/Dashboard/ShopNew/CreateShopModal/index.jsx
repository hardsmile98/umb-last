import React from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { getLocales } from 'utils';

function CreateShopModal({
  modal,
  toggle,
  sendData,
  loading,
}) {
  return (
    <Modal size="md" isOpen={modal} toggle={toggle}>
      <div className="modal-header text-center">
        <h4 className="modal-title font-m">
          {getLocales('Подтверждение')}
        </h4>
      </div>

      <ModalBody>
        <div className="avatar-block font-m">
          <div className="row">
            <div className="col-lg-3 confirm-terms">
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>

            <div className="col-lg-9">
              {getLocales('Нажимая кнопку')}
              ,
              {' '}
              <b>{getLocales('принять')}</b>
              ,
              {' '}
              {getLocales('Вы автоматически соглашаетесь с')}
              {' '}
              <NavLink to="/dashboard/support/faq/terms">
                {getLocales('пользовательскимсоглашением')}
              </NavLink>
              .
            </div>
          </div>
        </div>
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
                value={getLocales('Принять')}
                onClick={sendData}
                disabled={loading}
                className="btn btn-primary font-m auth-btn"
              >
                {loading
                  ? getLocales('Загрузка...')
                  : getLocales('Принять')}
              </button>
            </div>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default CreateShopModal;
