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
          {getLocales('Сумма адресов в наличии')}
        </h4>
      </div>

      <ModalBody>
        <div className="row">
          <div className="col-lg-12">
            <ul className="avatar-block font-m">
              <li>
                <li>Москва - 35 адресов</li>
                <ul>
                  <li>
                    <li>
                      Арбат - 25 адресов
                    </li>
                    <ul>
                      <li>
                        Яблоки - 10 адресов
                      </li>
                      <li>
                        Груши - 15 адресов
                      </li>
                    </ul>
                  </li>
                  <li>
                    Китай-город - 10 адресов
                  </li>
                </ul>
              </li>
              <li>Саратов - 15 адресов</li>
              <li>Питер - 10 адресов</li>
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
