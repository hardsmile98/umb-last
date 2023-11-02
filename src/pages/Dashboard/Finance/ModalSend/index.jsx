/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { getLocales } from 'utils';

function ModalSend({
  modal,
  toggle,
  courses,
  wallet,
  type,
  sum,
  fee,
  satoshi,
  handleChange,
  send,
  loading,
}) {
  return (
    <Modal
      size="lg"
      isOpen={modal}
      toggle={toggle}
    >
      <div className="modal-header text-center">
        <h4 className="modal-title font-m">
          {getLocales('Вывод средств')}
        </h4>
      </div>

      <ModalBody>
        <div className="row">
          <div className="col-lg-12">
            <div
              className="alert alert-secondary font-m"
              role="alert"
            >
              {getLocales('Комиссия сети влияет на скорость подверждения транзакции, чем выше комиссия - тем быстрее подтвердится Ваш вывод.')}
              <div className="row margin-15">
                <div className="col-lg-12 text-center">
                  <b>{getLocales('Рекомендуемые комиссии')}</b>
                </div>

                <div className="col-lg-6 text-center">
                  <b>
                    {'~ 30 '}
                    {getLocales('минут')}
                    <br />
                    {courses.fee30min}
                    {' sat/vByte'}
                  </b>
                </div>

                <div className="col-lg-6 text-center">
                  <b>
                    {'~ 60 '}
                    {getLocales('минут')}
                    <br />
                    {courses.fee60min}
                    {' sat/vByte'}
                  </b>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Кошелек')}
              </label>
              <input
                disabled
                autoComplete="off"
                value={wallet}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-lg-4">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Сумма к списанию')}
              </label>
              <div className="input-group">
                <input
                  value={type === 'ALL'
                    ? sum
                    : (+sum + (fee * satoshi))}
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

          <div className="col-lg-12">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Комиссия сети')}
                {' '}
                {satoshi}
                {' '}
                sat/vByte
              </label>
              <input
                type="range"
                name="satoshi"
                onChange={handleChange}
                min={+courses.fee60min}
                max="256"
                step="1"
                value={satoshi}
                className="form-control-range"
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Комиссия сети в BTC')}
              </label>
              <div className="input-group">
                <input
                  value={(fee * satoshi).toFixed(8)}
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

          <div className="col-lg-6">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Сумма к получению')}
              </label>
              <div className="input-group">
                <input
                  value={type === 'ALL'
                    ? (sum - (fee * satoshi)).toFixed(8)
                    : sum.toFixed(8)}
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
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4">
              <button
                type="button"
                value="Закрыть"
                className="btn btn-secondary
              font-m auth-btn"
                onClick={toggle}
              >
                {getLocales('Закрыть')}
              </button>
            </div>

            <div className="col-lg-2" />

            <div className="col-lg-6">
              <button
                type="button"
                onClick={send}
                disabled={loading}
                value="Отправить"
                className="btn btn-primary font-m auth-btn"
              >
                {loading
                  ? getLocales('Загрузка...')
                  : getLocales('Отправить')}
              </button>
            </div>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default ModalSend;
