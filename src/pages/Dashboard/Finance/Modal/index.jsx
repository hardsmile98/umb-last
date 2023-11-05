/* eslint-disable no-nested-ternary */
import React from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { getLocales } from 'utils';
import moment from 'moment';

function ModalFinance({
  modal,
  toggle,
  operation,
}) {
  return (
    <Modal
      size="md"
      isOpen={modal}
      toggle={toggle}
    >
      <div className="modal-header text-center">
        <h4 className="modal-title font-m">
          {getLocales('Финансовая операция #')}
          {operation.id}
        </h4>
      </div>

      <ModalBody>
        <div className="row">
          <div className="col-lg-12">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Операция')}
              </label>
              <input
                id="operation"
                disabled
                autoComplete="off"
                value={operation.name}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Дата создания')}
              </label>
              <input
                disabled
                autoComplete="off"
                value={moment.unix(operation.created / 1000).format('LLL')}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Кошелек')}
              </label>
              <input
                disabled
                autoComplete="off"
                value={operation.wallet}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-lg-12">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Сумма')}
              </label>
              <div className="input-group">
                <input
                  value={operation.sum}
                  disabled
                  type="number"
                  className="form-control"
                  placeholder="Введите сумму"
                />
                <span className="input-group-text">
                  BTC
                </span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-control-label font-m">
              {getLocales('Статус')}
            </label>
            <input
              disabled
              autoComplete="off"
              value={String(operation.status) === '1'
                ? getLocales('Завершена')
                : (String(operation.status) === '-1'
                  ? getLocales('Отменена')
                  : getLocales('Ожидает подтверждений'))}
              className="form-control"
            />
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="submit"
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

export default ModalFinance;
