import React from 'react';
import { getLocales } from 'utils';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

function AddressesModal({
  modal,
  toggle,
}) {
  return (
    <Modal
      size="md"
      isOpen={modal}
      toggle={toggle}
    >
      <div className="modal-header text-center">
        <h4 className="modal-title font-m">
          {getLocales('Количество адресов в наличии')}
        </h4>
      </div>

      <ModalBody>
        <div className="row">
          <div className="col-lg-12">
            <ul className="avatar-block font-m">
              <li>
                <li>
                  <b>Москва</b>
                  {' - 35 адресов'}
                </li>
                <ul>
                  <li>
                    <li>
                      <b>Арбат</b>
                      {' - 25 адресов'}
                    </li>
                    <ul>
                      <li>
                        <b>Яблоки</b>
                        {' - 10 адресов'}
                      </li>
                      <li>
                        <b>Груши</b>
                        {' - 15 адресов'}
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <b>Саратов</b>
                {' - 10 адресов'}
              </li>
            </ul>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                value={getLocales('Закрыть')}
                className="btn btn-secondary font-m auth-btn"
                onClick={toggle}
              >
                {getLocales('Закрыть')}
              </button>
            </div>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default AddressesModal;
