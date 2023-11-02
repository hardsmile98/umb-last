import React from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { getLocales } from 'utils';

function ModalSecretConfirm({
  modal,
  toggle,
  loading,
  handleChange,
  sendData,
}) {
  return (
    <Modal size="md" isOpen={modal} toggle={toggle}>
      <div className="modal-header text-center">
        <h4 className="modal-title font-m">
          {getLocales('Подтверждение действия')}
        </h4>
      </div>

      <ModalBody>
        <div className="form-group">
          <label
            htmlFor="secret"
            className="form-control-label font-m"
          >
            {getLocales('Секретная фраза аккаунта')}
          </label>

          <input
            id="secret"
            disabled={loading}
            autoComplete="off"
            type="password"
            onChange={handleChange}
            name="secret"
            placeholder={getLocales('Введите секретную фразу')}
            className="form-control"
          />
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
                disabled={loading}
                onClick={sendData}
                value={getLocales('Подтвердить')}
                className="btn font-m auth-btn btn-primary"
              >
                {loading ? getLocales('Загрузка...') : getLocales('Подтвердить')}
              </button>
            </div>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default ModalSecretConfirm;
