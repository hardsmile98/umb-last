/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import { toast } from 'react-toastify';
import { request, getLocales } from 'utils';

class BotModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      notice: '',
    };
    this.sendData = this.sendData.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
          type: 'bots',
          subtype: 'telegram',
          shop: this.props.shopId,
          id: this.props.bot.id,
          notice: this.state.notice,
          action: 'edit',
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
          this.setState({
            loading: false,
          });

          toast.success(response.data.message);

          this.props.loadData();
          this.props.toggle();
        } else {
          this.setState({
            loading: false,
          });
          toast.error(response.data.message);
        }
      } else {
        this.setState({
          loading: false,
        });
        toast.error('Сервер недоступен');
      }
    });
  }

  render() {
    return (
      <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
        <div className="modal-header">
          <h4 className="font-m">
            {getLocales('Бот')}
            {' '}
            #
            {this.props.bot.id}
          </h4>
        </div>

        <ModalBody>
          <div className="form-group">
            <label className="form-control-label font-m">
              {getLocales('Тип')}
            </label>
            <input
              disabled
              autoComplete="off"
              value={this.props.bot.type.toUpperCase()}
              name="type"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-control-label font-m">
              {getLocales('Токен')}
            </label>
            <input
              disabled
              autoComplete="off"
              value={this.props.bot.token}
              name="token"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-control-label font-m">
              {getLocales('Дата добавления')}
            </label>
            <input
              disabled
              autoComplete="off"
              name="created"
              value={moment.unix(this.props.bot.created / 1000).format('LLL')}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-control-label font-m">
              {getLocales('Заметка')}
            </label>
            <input
              maxLength="50"
              disabled={this.state.loading}
              defaultValue={this.props.bot.notice}
              autoComplete="off"
              type="text"
              onChange={this.handleChange}
              name="notice"
              placeholder={getLocales('Введите примечание')}
              className="form-control"
            />
            <small>
              {getLocales('Максимальная длина заметки - 50 символов')}
            </small>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-4">
                <button
                  type="button"
                  value="Закрыть"
                  className="btn btn-secondary font-m auth-btn"
                  onClick={this.props.toggle}
                >
                  {getLocales('Закрыть')}
                </button>
              </div>

              <div className="col-lg-8">
                <button
                  type="button"
                  disabled={this.state.loading}
                  onClick={this.sendData}
                  className="btn btn-primary font-m auth-btn"
                >
                  {this.state.loading
                    ? getLocales('Загрузка...')
                    : getLocales('Сохранить')}
                </button>
              </div>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default BotModal;
