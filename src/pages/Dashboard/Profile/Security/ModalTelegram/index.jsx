/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { getLocales, request } from 'utils';

class ModalTelegram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secret: '',
      code: '',
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
    const { state, props } = this;

    this.setState({
      loading: true,
    });

    if (state.secret !== '') {
      if (state.secret !== '') {
        const data = {
          api: 'user',
          body: {
            data: {
              section: 'security',
              type: 'connect2Auth',
              secret: state.secret,
              code: state.code,
            },
            action: 'profile',
          },
          headers: {
            authorization: localStorage.getItem('token'),
          },
        };

        request(data, (response) => {
          if (response.status === 200) {
            if (response.data.success) {
              toast.success(response.data.message);
              this.setState({
                loading: false,
                secret: '',
                code: '',
              });

              props.getData();

              props.toggle();
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
      } else {
        toast.error(getLocales('Секретный код не введен'));
      }
    } else {
      toast.error(getLocales('Секретная фраза не введена'));
    }
  }

  render() {
    const { state, props } = this;

    return (
      <Modal
        size="md"
        isOpen={props.modal}
        toggle={props.toggle}
      >
        <div className="modal-header text-center">
          <h4 className="modal-title font-m">
            {getLocales('Подключение Telegram')}
          </h4>
        </div>

        <ModalBody>
          <div className="form-group">
            <label htmlFor="secret" className="form-control-label font-m">
              {getLocales('Секретная фраза')}
            </label>
            <input
              autoComplete="off"
              value={state.secret}
              disabled={state.loading}
              onChange={this.handleChange}
              type="password"
              name="secret"
              id="secret"
              placeholder={getLocales('Введите секретную фразу')}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="code" className="form-control-label font-m">
              {getLocales('Секретный код от Телеграм бота')}
            </label>
            <input
              autoComplete="off"
              value={state.code}
              disabled={state.loading}
              onChange={this.handleChange}
              type="number"
              name="code"
              id="code"
              placeholder={getLocales('Введите код')}
              className="form-control"
            />
            <small>
              <span dangerouslySetInnerHTML={{
                __html: getLocales("Для получения кода от <a href='https://t.me/twoauthshopbiz_bot' target='_blank' rel='noopener noreferrer'>нашего Telegram-бота</a>, найдите <a href='https://t.me/twoauthshopbiz_bot' target='_blank' rel='noopener noreferrer'>его</a> по логину <a href='https://t.me/twoauthshopbiz_bot' target='_blank' rel='noopener noreferrer'>@twoauthshopbiz_bot</a> в месседжере Telegram и напишите <a href='https://t.me/twoauthshopbiz_bot' target='_blank' rel='noopener noreferrer'>ему</a> сообщение с текстом '/start', без кавычек."),
              }}
              />
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
                  onClick={props.toggle}
                >
                  {getLocales('Закрыть')}
                </button>
              </div>

              <div className="col-lg-8">
                <button
                  type="button"
                  onClick={this.sendData}
                  value="Подтвердить"
                  disabled={state.loading}
                  className="btn btn-primary font-m auth-btn"
                >
                  {state.loading
                    ? getLocales('Загрузка...')
                    : getLocales('Подтвердить')}
                </button>
              </div>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ModalTelegram;
