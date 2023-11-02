import React from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { getLocales } from 'utils';

function Tip({
  modal,
  toggle,
  sendData,
  loading,
}) {
  return (
    <Modal size="md" isOpen={modal} toggle={toggle}>
      <div className="modal-header text-center">
        <h4 className="modal-title font-m">
          {getLocales('Подсказка')}
        </h4>
      </div>
      <ModalBody />

      <ModalFooter>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4">
              <button
                type="button"
                value={getLocales('Закрыть')}
                className="btn btn-secondary font-g auth-btn"
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
                className="btn font-g auth-btn btn-primary"
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

export default Tip;
