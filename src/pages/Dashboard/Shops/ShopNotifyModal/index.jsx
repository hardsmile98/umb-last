import React from 'react';
import { NavLink } from 'react-router-dom';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { getLocales } from 'utils';

function ShopNotifyModal({
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
          {getLocales('Уведомление')}
        </h4>
      </div>

      <ModalBody>
        <div className="avatar-block font-m no-margin text-center">
          {getLocales('У вас не создано ни одного магазина')}
        </div>
      </ModalBody>

      <ModalFooter>
        <NavLink to="/dashboard/shops/new">
          <button
            type="button"
            className="btn btn-primary font-m auth-btn"
          >
            {getLocales('Создать магазин')}
          </button>
        </NavLink>
      </ModalFooter>
    </Modal>
  );
}

export default ShopNotifyModal;
