import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { Table } from 'components';
import { request } from 'utils';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        user: {
          shops: [],
          finance: [],
        },
      },
      domain: '',
      items: [],
      adder: 0,
      password: '',
    };

    this.getData = this.getData.bind(this);
    this.blockAction = this.blockAction.bind(this);
    this.sendData = this.sendData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.giveOnion = this.giveOnion.bind(this);
    this.giveNormalDomain = this.giveNormalDomain.bind(this);
    this.prepareTableData = this.prepareTableData.bind(this);
    this.updateItems = this.updateItems.bind(this);
    this.addition = this.addition.bind(this);
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
    const { props } = this;

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'datas',
          type: 'getUserProfile',
          id: props.match.params.id,
        },
        action: 'admin',
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
            name: response.data.data.user.name,
            balance: response.data.data.user.balance,
            comission: response.data.data.user.comission,
            shopLimit: response.data.data.user.shopLimit,
            notice: response.data.data.user.notice,
            type: response.data.data.user.type,
            premium: response.data.data.user.premium,
          }, () => {
            this.prepareTableData();
          });
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

  sendData() {
    const { props, state } = this;

    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'datas',
          type: 'updateUser',
          name: state.name,
          balance: state.balance,
          usertype: state.type,
          comission: state.comission,
          id: props.match.params.id,
          notice: state.notice,
          shopLimit: state.shopLimit,
          premium: state.premium,
        },
        action: 'admin',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
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
  }

  prepareTableData() {
    const { state } = this;

    const newItems = state.data.user.finance.map((item) => ({
      id: item.id,
      type: item.type
        .replace(/shopPlus/g, 'Доход от шопа')
        .replace(/createWithdrawal/g, 'Вывод')
        .replace(/createPayment/g, 'Пополнение')
        .replace(/purchase/g, 'Покупка услуги'),
      sum: `${item.sum} BTC`,
      created: moment.unix(item.created / 1000).format('LLL'),
      wallet: item.wallet,
    })).reverse();

    this.setState({
      items: newItems,
    });
  }

  updateItems(items) {
    this.setState({
      items,
    });
  }

  giveNormalDomain(id) {
    const { state } = this;

    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'datas',
          type: 'giveDomain',
          shop: id,
          domain: state.domain.toLowerCase(),
        },
        action: 'admin',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          toast.success(response.data.message);
          this.getData();
          this.setState({
            domain: '',
          });
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

  giveOnion(id) {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'datas',
          type: 'giveDomainOnion',
          shop: id,
        },
        action: 'admin',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
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
  }

  addition() {
    const { state, props } = this;

    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'datas',
          type: 'addition',
          id: props.match.params.id,
          password: state.password,
          sum: state.adder,
        },
        action: 'admin',
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
            adder: 0,
            password: '',
          }, () => {
            this.getData();
          });
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

  blockAction(id) {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'datas',
          type: 'blockAction',
          user: id,
        },
        action: 'admin',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
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
  }

  render() {
    const tableColumns = [
      {
        title: 'ID', dataIndex: 'id', key: 'id', sort: true,
      },
      {
        title: 'Тип операции', dataIndex: 'type', key: 'type', sort: true,
      },
      {
        title: 'Кошелек', dataIndex: 'wallet', key: 'wallet', sort: true,
      },
      {
        title: 'Сумма', dataIndex: 'sum', key: 'sum', sort: true,
      },
      {
        title: 'Дата', dataIndex: 'created', key: 'created', sort: true,
      },
    ];

    const { state, props } = this;

    return (
      <div className="row margin-15">
        <div className="col-lg-8">
          <div className={`block animate__animated animate__fadeIn margin-15 ${state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <h3 className="font-m">
                Пользователь #
                {props.match.params.id}
                {' '}
                {state.data.user.premium === 1 && (
                  <FontAwesomeIcon
                    className="text-danger"
                    icon={faStar}
                  />
                )}
              </h3>

              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      Логин
                    </label>
                    <input
                      className="form-control"
                      value={state.data.user.login}
                      disabled
                      name="login"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      Имя в ТП
                    </label>
                    <input
                      className="form-control"
                      value={state.name}
                      onChange={this.handleChange}
                      name="name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      Заметка
                    </label>
                    <input
                      className="form-control"
                      value={state.notice}
                      onChange={this.handleChange}
                      name="notice"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      Тип юзера
                    </label>
                    <select
                      className="form-control"
                      value={state.type}
                      onChange={this.handleChange}
                      name="type"
                    >
                      <option value="user">Пользователь</option>
                      <option value="support">Агент поддержки</option>
                      <option value="admin">Администратор</option>
                      <option value="superadmin">Супер-админ</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      Лимит шопов
                    </label>
                    <input
                      className="form-control"
                      value={state.shopLimit}
                      onChange={this.handleChange}
                      name="shopLimit"
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      Баланс
                    </label>
                    <input
                      className="form-control"
                      disabled
                      value={state.balance}
                      onChange={this.handleChange}
                      name="balance"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      Комиссия
                    </label>
                    <input
                      className="form-control"
                      value={state.comission}
                      onChange={this.handleChange}
                      name="comission"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      Зарегистрирован
                    </label>
                    <input
                      className="form-control"
                      disabled
                      value={moment.unix(state.data.user.regdate / 1000).format('LLL')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      Премиум юзер
                    </label>
                    <select
                      className="form-control"
                      value={state.premium}
                      onChange={this.handleChange}
                      name="premium"
                    >
                      <option value="0">Нет</option>
                      <option value="1">Да</option>
                    </select>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div
                    aria-hidden
                    onClick={() => props.history.goBack()}
                    className="btn btn-secondary font-m left"
                  >
                    Назад
                  </div>
                  <div
                    aria-hidden
                    onClick={this.sendData}
                    className="btn btn-primary font-m right"
                  >
                    Сохранить
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      Пароль
                    </label>
                    <input
                      className="form-control"
                      value={state.password}
                      onChange={this.handleChange}
                      name="password"
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      Добавить к балансу
                    </label>
                    <div className="input-group">
                      <input
                        name="adder"
                        type="number"
                        onChange={this.handleChange}
                        value={state.adder}
                        className="form-control"
                      />
                      <span
                        aria-hidden
                        onClick={this.addition}
                        className="input-group-text pointer"
                      >
                        Добавить
                      </span>
                    </div>
                    <small>
                      Если списать, просто указваем отрицательное число, например -0.05
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <h3 className="font-m">
                Его магазины или где он является сотрудником
              </h3>
              {state.data.user.shops.length > 0
                ? (
                  <>
                    {state.data.user.shops.map((item) => (
                      <div className="avatar-block text-left">
                        <h3 className="font-m">
                          Магазин #
                          {item.id}
                        </h3>

                        <div className="form-group">
                          <label className="form-control-label font-m">
                            База
                          </label>
                          <input
                            className="form-control"
                            value={item.db}
                            disabled
                            name="login"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-control-label font-m">
                            Уникальный ID
                          </label>
                          <input
                            className="form-control"
                            value={item.uniqueId}
                            disabled
                            name="login"
                          />
                        </div>

                        <NavLink to={`/dashboard/shops/${item.uniqueId}/`}>
                          <div className="btn btn-secondary font-m auth-btn">
                            Открыть магазин
                          </div>
                        </NavLink>

                        <div className="form-group margin-15">
                          <label className="form-control-label font-m">
                            Домен для подключения (ТОЛЬКО ДОМЕН БЕЗ http И /)
                          </label>
                          <input
                            className="form-control"
                            value={state.domain}
                            onChange={this.handleChange}
                            name="domain"
                          />
                          <small>Пример: google.com</small>
                        </div>

                        <div className="row margin-15">
                          <div className="col-lg-6">
                            <div
                              aria-hidden
                              className="btn btn-primary font-m auth-btn"
                              onClick={() => this.giveNormalDomain(item.id)}
                            >
                              Подключить
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div
                              aria-hidden
                              className="btn btn-primary font-m auth-btn"
                              onClick={() => this.giveOnion(item.id)}
                            >
                              Выдать ONION
                            </div>
                          </div>

                          <div className="col-lg-12">
                            <div className="avatar-block notice font-m">
                              Для подключения домена Вам необходимо
                              установить наши NS сервера в настройках домена:
                              <br />
                              <br />
                              lady.ns.cloudflare.com
                              <br />
                              micah.ns.cloudflare.com
                              <br />
                              <br />
                              В каждом сервисе по продаже доменов
                              изменение NS серверов производится по-разному, если
                              Вы не знаете как изменить NS сервера, обратитесь,
                              пожалуйста, в службу поддержки сервиса, где приобретали домен.
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )
                : (
                  <div className="text-center">
                    Шопов нет
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="col-lg-12">
          <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <h3 className="font-m">
                Движение средств
              </h3>

              {state.data.user.finance.length > 0
                ? (
                  <Table
                    columns={tableColumns}
                    items={state.items}
                    updateItems={this.updateItems}
                    rowsPerPage="10"
                  />
                )
                : (
                  <div className="text-center font-m">
                    операции отсутствуют
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfile;
