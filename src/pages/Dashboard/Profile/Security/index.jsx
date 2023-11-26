/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import md5 from 'md5';

import { getLocales, request } from 'utils';
import { Table } from 'components';
import ModalSecretConfirm from './ModalSecretConfirm';
import ModalTelegram from './ModalTelegram';

const tableColumns = [
  {
    title: 'ID', dataIndex: 'id', key: 'id', sort: true,
  },
  {
    title: getLocales('Устройство'), dataIndex: 'device', key: 'device', sort: false,
  },
  {
    title: getLocales('Последняя активность'), dataIndex: 'activity', key: 'activity', sort: true,
  },
  {
    title: getLocales('Первая активность'), dataIndex: 'date', key: 'date', sort: true,
  },
  {
    title: getLocales('Cтатус'),
    dataIndex: '',
    key: 'operations',
    itemClassName: 'text-center',
    headerClassName: 'text-center',
    render: (e, item) => (
      <div className="sparkline8">
        <button
          disabled
          type="button"
          className={`btn font-m btn-sessions auth-btn ${String(item.status) === '1'
            ? ' btn-primary'
            : ' btn-danger'}`}
        >
          {' '}
          {String(item.status) === '1'
            ? getLocales('Текущая сессия')
            : getLocales('Сессия завершена')}
        </button>
      </div>
    ),
  },
];

class Security extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        user: {
          twoAuth: 'none',
          bot: {},
        },
        sessions: [],
      },
      items: [],
      loading: true,
      password: '',
      newPassword: '',
      newPasswordTwo: '',
      secret: '',
      modal: false,
      confirm: false,
      action: 'changePassword',
    };
    this.getData = this.getData.bind(this);
    this.sendData = this.sendData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.confirmModal = this.confirmModal.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  componentDidMount() {
    this.getData();
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

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'security',
          type: 'get',
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
          this.setState({
            data: response.data.data,
            loading: false,
          });
          this.prepareTableData();
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

  changePassword() {
    const { state } = this;

    if (md5(state.password) !== state.data.user.password) {
      toast.error(getLocales('Текущий пароль неверный'));
      return;
    }

    if (state.newPassword.length < 6) {
      toast.error(getLocales('Минимальная длина пароля - 6 символов'));
      return;
    }

    if (state.newPassword !== state.newPasswordTwo) {
      toast.error(getLocales('Пароли не совпадают'));
      return;
    }

    this.setState({
      action: 'changePassword',
    });

    this.confirmModal();
  }

  confirmModal() {
    const { state } = this;

    this.setState({
      confirm: !state.confirm,
    });
  }

  toggle() {
    const { state } = this;

    this.setState({
      modal: !state.modal,
    });
  }

  prepareTableData() {
    const { state } = this;

    const newItems = state.data.sessions.map((item) => ({
      id: item.id,
      device: item.device,
      activity: moment.unix(item.activity / 1000).format('LLL'),
      date: moment.unix(item.date / 1000).format('LLL'),
      status: item.status,
    }));

    this.setState({
      items: newItems,
    });
  }

  updateItems(items) {
    this.setState({
      items,
    });
  }

  sendData() {
    const { state } = this;

    if (md5(state.password) === state.data.user.password || state.action === 'disable2Auth') {
      if (state.newPassword.length >= 6 || state.action === 'disable2Auth') {
        if (state.newPassword === state.newPasswordTwo || state.action === 'disable2Auth') {
          this.setState({
            loading: true,
          });

          const data = {
            api: 'user',
            body: {
              data: {
                section: 'security',
                type: state.action,
                password: state.password,
                newPassword: state.newPassword,
                secret: state.secret,
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
                this.setState({
                  loading: false,
                  password: '',
                  newPassword: '',
                  newPasswordTwo: '',
                  secret: '',
                });
                this.confirmModal();
                toast.success(response.data.message);
                this.getData();
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
          toast.error(getLocales('Пароли не совпадают'));
        }
      } else {
        toast.error(getLocales('Минимальная длина пароля - 6 символов'));
      }
    } else {
      toast.error(getLocales('Текущий пароль неверный'));
    }
  }

  render() {
    const { state } = this;

    return (
      <>
        <div className="row">
          <div className="col-lg-4">
            <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <div className="row">
                  <div className="col-lg-12">
                    <h3 className="font-m">
                      {getLocales('Изменение пароля')}
                    </h3>
                    <br />
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Текущий пароль')}
                      </label>
                      <input
                        onChange={this.handleChange}
                        value={state.password}
                        autoComplete="off"
                        type="text"
                        name="password"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Новый пароль')}
                      </label>
                      <input
                        onChange={this.handleChange}
                        value={state.newPassword}
                        autoComplete="off"
                        type="password"
                        name="newPassword"
                        className="form-control"
                      />
                      <small>
                        {getLocales('Минимальная длина пароля - 6 символов')}
                      </small>
                    </div>

                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Повторите новый пароль')}
                      </label>
                      <input
                        onChange={this.handleChange}
                        value={state.newPasswordTwo}
                        autoComplete="off"
                        type="password"
                        name="newPasswordTwo"
                        className="form-control"
                      />
                    </div>

                    <button
                      type="button"
                      value="Подтвердить"
                      onClick={this.changePassword}
                      className="btn btn-primary right font-m auth-btn"
                    >
                      {getLocales('Подтвердить')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <div className="row">
                  <div className="col-lg-12">
                    <h3 className="font-m">
                      {getLocales('Двухфакторная аутентификация')}
                    </h3>

                    <br />

                    {state.data.user.twoAuth === 'none'
                      ? (
                        <>
                          <div className="xbox__body font-m">
                            <span>
                              <p>
                                {getLocales('Подключение аккаунта Telegram улучшит защиту Вашей учетной записи и позволит получать через Telegram уведомления, выбранные в')}
                                {' '}
                                <Link to="/dashboard/profile/settings">
                                  {getLocales('настройках аккаунта')}
                                </Link>
                                {getLocales(', а также управлять магазином и аккаунтом из мессенджера.')}
                              </p>
                              <p>
                                {getLocales('Будьте внимательны, убедитесь в том, что Вы сможете восстановить аккаунт в случае утери доступа к аккаунту Telegram. Без доступа к аккаунту Telegram, Вы')}
                                {' '}
                                <span className="text-danger">
                                  {getLocales('не сможете восстановить пароль')}
                                </span>
                                {' '}
                                {getLocales('от вашей учетной записи без секретного слова.')}
                              </p>
                            </span>
                          </div>

                          <div className="row">
                            <div className="col-lg-12 text-center">
                              <button
                                type="button"
                                value="Подключить"
                                style={{ width: '50%' }}
                                onClick={this.toggle}
                                className="btn btn-secondary font-m auth-btn"
                              >
                                {getLocales('Подключить')}
                              </button>
                            </div>
                          </div>
                        </>
                      )
                      : (
                        <>
                          <span className="font-m">
                            <p>
                              {getLocales('К Вашему аккаунту подключена двухфакторная аутентификация. В разделе')}
                              {' '}
                              <Link to="/dashboard/profile/settings">
                                {getLocales('настройки аккаунта')}
                              </Link>
                              {' '}
                              {getLocales('Вы можете выбрать действия, при которых наш бот')}
                              {' '}
                              {getLocales('будет присылать Вам уведомления.')}
                            </p>
                          </span>

                          <div className="form-group">
                            <label className="form-control-label font-m">
                              Telegram ID
                            </label>
                            <input
                              disabled
                              value={state.data.user.bot.chatid}
                              className="form-control"
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-control-label font-m">
                              {getLocales('Имя')}
                            </label>
                            <input
                              disabled
                              value={state.data.user.bot.first_name}
                              className="form-control"
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-control-label font-m">
                              Username
                            </label>
                            <input
                              disabled
                              value={state.data.user.bot.username
                                ? `@${state.data.user.bot.username}`
                                : getLocales('Нет')}
                              className="form-control"
                            />
                          </div>

                          <div className="row">
                            <div className="col-lg-12 text-center">
                              <button
                                type="button"
                                style={{ width: '50%' }}
                                value="Отвязать аккаунт"
                                onClick={() => {
                                  this.setState({
                                    action: 'disable2Auth',
                                  });
                                  this.confirmModal();
                                }}
                                className="btn btn-danger font-m right"
                              >
                                {getLocales('Отвязать аккаунт')}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <div className="row">
                  <div className="col-lg-12">
                    <h3 className="font-m">
                      {getLocales('История сессий')}
                    </h3>

                    <Table
                      search
                      columns={tableColumns}
                      items={state.items}
                      updateItems={this.updateItems}
                      rowsPerPage="5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ModalSecretConfirm
          loading={state.loading}
          sendData={this.sendData}
          handleChange={this.handleChange}
          modal={state.confirm}
          toggle={this.confirmModal}
        />

        <ModalTelegram
          getData={this.getData}
          modal={state.modal}
          toggle={this.toggle}
        />
      </>
    );
  }
}

export default Security;
