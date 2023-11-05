/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { request, getLocales } from 'utils';

class SetAsNoffoundModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: 0,
      fine: 0,
      fineInd: 0,
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox'
      ? 'checked'
      : 'value'];
    const { name } = e.target;

    this.setState({
      [name]: value,
    });
  }

  sendData() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'datas',
          subtype: 'purchases',
          shop: this.props.shop,
          action: 'setNotFound',
          id: this.props.purchase,
          record: this.state.record,
          fine: this.state.fine,
          fineInd: this.state.fineInd,
        },
        action: 'shops',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          toast.success(response.data.message);
          this.props.getData();
          this.props.toggle();
        } else {
          this.setState({
            loading: false,
          });
          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  }

  render() {
    return (
      <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
        <div className="modal-header text-center">
          <h4 className="modal-title font-m">
            {getLocales('Опции для ненахода')}
          </h4>
        </div>

        <ModalBody>
          <div className="form-group">
            <label className="form-control-label font-m">
              {getLocales('Учитывать покупку в общем обороте')}
            </label>
            <select
              disabled={this.state.loading}
              value={this.state.record}
              onChange={this.handleChange}
              name="record"
              className="form-control"
            >
              <option value="0">{getLocales('Нет')}</option>
              <option value="1">{getLocales('Да')}</option>
            </select>
          </div>

          {!this.props.ownerAdd && (
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Оштрафовать курьера')}
              </label>
              <select
                disabled={this.state.loading}
                value={this.state.fine}
                onChange={this.handleChange}
                name="fine"
                className="form-control"
              >
                <option value="0">{getLocales('Нет')}</option>
                <option value="1">{getLocales('Да')}</option>
                <option value="2">{getLocales('Да, но по отдельному тарифу')}</option>
              </select>
            </div>
          )}

          {String(this.state.fine) === '2' && (
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Штраф для курьера')}
              </label>
              <div className="input-group">
                <input
                  disabled={this.state.loading}
                  value={this.state.fineInd}
                  name="fineInd"
                  onChange={this.handleChange}
                  className="form-control"
                />
                <span className="input-group-text">
                  {this.props.currency}
                </span>
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-4">
                <button
                  type="button"
                  value={getLocales('Закрыть')}
                  className="btn btn-secondary font-m auth-btn"
                  onClick={this.props.toggle}
                >
                  {getLocales('Закрыть')}
                </button>
              </div>

              <div className="col-lg-8">
                <button
                  type="button"
                  value="Отметить"
                  onClick={this.sendData}
                  disabled={this.props.loading}
                  className="btn btn-primary font-m auth-btn"
                >
                  {this.props.loading
                    ? getLocales('Загрузка...')
                    : getLocales('Отметить')}
                </button>
              </div>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default SetAsNoffoundModal;
