/* eslint-disable no-nested-ternary */
import React from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';

function ModalOrder() {
  const { props } = this;

  return (
    <Modal
      size="lg"
      isOpen={props.modal}
      toggle={props.toggle}
    >
      <div className="modal-header text-center">
        <h4 className="modal-title font-m">
          Информация о заказе
        </h4>
      </div>

      <ModalBody>
        <div className="avatar-block notice-chat">
          <h4 className="font-m">
            Информация о заказе в магазине
          </h4>
          {JSON.stringify(props.order.purchase).toString()}
        </div>

        <div className="avatar-block notice-chat">
          <h4 className="font-m">
            Информация о платеже
          </h4>
          <b>ID</b>
          :
          {' '}
          {props.order.deposit.id}
          <br />
          <b>Способ оплаты</b>
          :
          {' '}
          {props.order.deposit.type}
          <br />
          <b>Куда оплатить</b>
          :
          {' '}
          {props.order.deposit.walletPay}
          <br />
          <b>Сумма оплаты</b>
          :
          {' '}
          {props.order.deposit.sumPay}
          <br />
          <b>Обменник ID</b>
          :
          {' '}
          {props.order.deposit.exId}
          <br />
          <b>TXID</b>
          :
          {' '}
          {props.order.deposit.txid}
          <br />
          <b>Статус</b>
          :
          {' '}
          {String(props.order.deposit.status) === '-1'
            ? 'Отменен'
            : (String(props.order.deposit.status) === '0'
              ? 'Ожидает оплаты'
              : (String(props.order.deposit.status) === '1'
                ? 'Ожидает подтверждений'
                : 'Оплачен'))}
          <br />
          <b>Дата</b>
          :
          {' '}
          {String(props.order.deposit.status) === '2'
            ? moment.unix(props.order.deposit.closed / 1000).format('LLL')
            : moment.unix(props.order.deposit.created / 1000).format('LLL')}
        </div>

        {String(props.order.deposit.status) !== '2' && (
          <>
            <div className="form-group">
              <label htmlFor="password" className="form-control-label font-m">
                Пароль
              </label>
              <input
                name="password"
                id="password"
                onChange={props.handleChange}
                value={props.password}
                className="form-control"
              />
            </div>

            <button
              type="button"
              onClick={() => props.setPayedOrder(props.order.deposit.id)}
              className="btn btn-primary font-m auth-btn"
            >
              Отметить оплаченным
            </button>
          </>
        )}
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          onClick={props.toggle}
          className="btn btn-secondary font-m auth-btn"
        >
          Закрыть
        </button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalOrder;
