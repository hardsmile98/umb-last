/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { getLocales } from 'utils';

class DispanserModal extends Component {
  render() {
    return (
      <Modal
        size="lg"
        isOpen={this.props.modal}
        toggle={this.props.toggle}
      >
        <div className="modal-header text-center">
          <h4 className="modal-title font-m">
            {this.props.action === 'create'
              ? getLocales('Создание бота распределителя')
              : getLocales('Изменение бота распределителя')}
          </h4>
        </div>

        <ModalBody>
          <div className="form-group">
            <label className="form-control-label font-m">
              {getLocales('Имя')}
            </label>
            <input
              className="form-control"
              disabled={this.props.loading}
              value={this.props.name}
              onChange={this.props.handleChange}
              placeholder={getLocales('Введите имя бота')}
              name="name"
            />
          </div>

          <div className="form-group">
            <label className="form-control-label font-m">
              {getLocales('Юзернейм')}
            </label>
            <div className="input-group">
              <span className="input-group-text">
                @
              </span>
              <input
                disabled={this.props.loading}
                className="form-control"
                value={this.props.username}
                onChange={this.props.handleChange}
                placeholder={getLocales('Введите юзернейм бота')}
                name="username"
              />
            </div>
            <small>
              {getLocales('Юзернейм - уникальный идентификатор профиля в ТГ')}
            </small>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-4">
                <button
                  type="button"
                  value={getLocales('Закрыть')}
                  disabled={this.props.loading}
                  className="btn btn-secondary font-m auth-btn"
                  onClick={this.props.toggle}
                >
                  {getLocales('Закрыть')}
                </button>
              </div>

              <div className="col-lg-8">
                <button
                  type="button"
                  className="btn btn-primary font-m auth-btn"
                  disabled={this.props.loading}
                  onClick={this.props.sendData}
                >
                  {this.props.loading ? getLocales('Загрузка...')
                    : (this.props.action === 'create'
                      ? (`${getLocales('Приобрести за ') + this.props.price}$`)
                      : getLocales('Сохранить'))}

                </button>
              </div>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default DispanserModal;
