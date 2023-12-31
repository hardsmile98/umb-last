/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { Table } from 'components';
import { getLocales, request } from 'utils';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        user: {
          purchasesList: [],
        },
        currency: 'EE',
      },
      items: [],
      persDisc: 0,
      notFounded: 0,
    };

    this.getData = this.getData.bind(this);
    this.prepareTableData = this.prepareTableData.bind(this);
    this.updateItems = this.updateItems.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.discountZero = this.discountZero.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setPers = this.setPers.bind(this);
    this.setNotice = this.setNotice.bind(this);
    this.setBalanceZero = this.setBalanceZero.bind(this);
    this.blockAction = this.blockAction.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  updateItems(items) {
    this.setState({
      items,
    });
  }

  prepareTableData() {
    const items = [];

    this.state.data.user.purchasesList.map((item) => {
      const itemModified = {
        id: item.id,
        category: item.category,
        subcategory: item.subcategory ? item.subcategory : '-',
        product: item.product,
        subproduct: item.subproduct ? item.subproduct : '-',
        sum: `${item.sum} ${this.state.data.currency}`,
        date: moment.unix(item.closed / 1000).format('LLL'),
        status: item.status,
        type: item.type,
      };
      items.push(itemModified);
    });

    this.setState({
      items,
    });
  }

  componentDidMount() {
    this.getData();
  }

  setBalanceZero() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'datas',
          subtype: 'users',
          shop: this.props.match.params.shopId,
          action: 'setBalanceZero',
          id: this.props.match.params.userId,
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

  discountZero() {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'datas',
          subtype: 'users',
          shop: this.props.match.params.shopId,
          action: 'discountZero',
          id: this.props.match.params.userId,
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

  setNotice() {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'datas',
          subtype: 'users',
          shop: this.props.match.params.shopId,
          action: 'setNotice',
          id: this.props.match.params.userId,
          notice: this.state.notice,
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

  setPers() {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'datas',
          subtype: 'users',
          shop: this.props.match.params.shopId,
          action: 'setPers',
          id: this.props.match.params.userId,
          discount: this.state.persDisc,
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

  blockAction() {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'datas',
          subtype: 'users',
          shop: this.props.match.params.shopId,
          action: 'blockAction',
          id: this.props.match.params.userId,
        },
        action: 'shops',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        toast.success(response.data.message);
        this.getData();
      } else {
        toast.error('Сервер недоступен');
      }
    });
  }

  sendMessage() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'datas',
          subtype: 'users',
          shop: this.props.match.params.shopId,
          action: 'sendMessage',
          id: this.props.match.params.userId,
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
          this.props.history.push(`/dashboard/shops/${this.props.match.params.shopId}/feedback/chats/${response.data.data.id}`);
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

  getData() {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'datas',
          subtype: 'users',
          shop: this.props.match.params.shopId,
          action: 'getUser',
          id: this.props.match.params.userId,
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
          let notFounded = 0;

          response.data.data.user.purchasesList.map((item) => {
            if (item.notfound === 1) {
              notFounded += 1;
            }
          });

          this.setState({
            data: response.data.data,
            loading: false,
            notFounded,
            persDisc: response.data.data.user.persDisc,
            notice: response.data.data.user.notice,
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

  render() {
    const tableColumns = [
      {
        title: 'ID', dataIndex: 'id', key: 'id', sort: true,
      },
      {
        title: getLocales('Город'), dataIndex: 'category', key: 'category', sort: true,
      },
      {
        title: getLocales('Район'), dataIndex: 'subcategory', key: 'subcategory', sort: true,
      },
      {
        title: getLocales('Товар'), dataIndex: 'product', key: 'product', sort: true,
      },
      {
        title: getLocales('Фасовка'), dataIndex: 'subproduct', key: 'subproduct', sort: true,
      },
      {
        title: getLocales('Сумма'), dataIndex: 'sum', key: 'sum', sort: true,
      },
      {
        title: getLocales('Способ оплаты'), dataIndex: 'type', key: 'type', sort: true,
      },
      {
        title: getLocales('Дата'), dataIndex: 'date', key: 'date', sort: true,
      },
      {
        title:
        getLocales('Действие'),
        dataIndex: 'name',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        key: 'operations',
        render: (e, item) => (
          <NavLink
            to={`/dashboard/shops/${this.props.match.params.shopId}/datas/purchases/${item.id}`}
          >
            <button type="button" className="btn btn-secondary font-m">
              {getLocales('Подробнее')}
            </button>
          </NavLink>
        ),
      },
    ];

    return (
      <>
        <div className={`block animate__animated animate__fadeIn no-margin ${this.state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="font-m">
                  {getLocales('Покупатель')}
                  {' '}
                  #
                  {this.props.match.params.userId}
                  {' '}
                  <span
                    aria-hidden
                    onClick={this.discountZero}
                    className="right pointer"
                  >
                    {getLocales('Обнулить скидки пользователя')}
                  </span>
                </h3>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Имя')}
                  </label>
                  <input
                    name="location"
                    value={this.state.data.user.name}
                    className="form-control"
                    disabled
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Юзернейм')}
                  </label>
                  <input
                    name="product"
                    value={this.state.data.user.username ? this.state.data.user.username : 'Отсутствует'}
                    className="form-control"
                    disabled
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    Telegram ID
                  </label>
                  <input
                    name="product"
                    value={this.state.data.user.chatid ? this.state.data.user.chatid : 'Отсутствует'}
                    className="form-control"
                    disabled
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Баланс')}
                  </label>
                  <div className="input-group">
                    <input disabled value={this.state.data.user.balance} className="form-control" />
                    <span className="input-group-text">{this.state.data.currency}</span>
                    <a aria-hidden onClick={this.setBalanceZero}>
                      <span className="input-group-text">
                        {getLocales('Обнулить')}
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Персональная скидка')}
                  </label>

                  <div className="input-group">
                    <input
                      name="persDisc"
                      onChange={this.handleChange}
                      value={this.state.persDisc}
                      className="form-control"
                    />
                    <span className="input-group-text">%</span>
                    <a aria-hidden onClick={this.setPers}>
                      <span className="input-group-text">
                        {getLocales('Сохранить')}
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Сумма покупок')}
                  </label>
                  <div className="input-group">
                    <input
                      disabled
                      value={this.state.data.user.purchasesSum}
                      className="form-control"
                    />
                    <span className="input-group-text">
                      {this.state.data.currency}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Кол-во покупок')}
                  </label>
                  <input
                    disabled
                    value={this.state.data.user.purchases}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Ненаходов')}
                  </label>
                  <input
                    disabled
                    value={this.state.notFounded}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Скидка пользователя в %')}
                  </label>
                  <div className="input-group">
                    <input
                      disabled
                      value={this.state.data.user.percent}
                      className="form-control"
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Скидка пользователя в')}
                    {' '}
                    {this.state.data.currency}
                  </label>
                  <div className="input-group">
                    <input disabled value={this.state.data.user.sum} className="form-control" />
                    <span className="input-group-text">{this.state.data.currency}</span>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Пригласительный код')}
                  </label>
                  <input disabled value={this.state.data.user.refid} className="form-control" />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Привлечено покупателей')}
                  </label>
                  <input
                    disabled
                    value={this.state.data.user.referalls
                      ? this.state.data.user.referalls
                      : 0}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Зарегистрирован')}
                  </label>
                  <input
                    disabled
                    value={moment.unix(this.state.data.user.regdate / 1000).format('LLL')}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-lg-8">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Персональная заметка')}
                  </label>
                  <div className="input-group">
                    <input
                      name="notice"
                      onChange={this.handleChange}
                      value={this.state.notice}
                      className="form-control"
                    />
                    <a
                      aria-hidden
                      onClick={this.setNotice}
                    >
                      <span className="input-group-text">
                        {getLocales('Сохранить')}
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <button
                  type="button"
                  onClick={() => { this.props.history.goBack(); }}
                  className="btn btn-secondary font-m left"
                >
                  {getLocales('Назад')}
                </button>

                <button
                  type="button"
                  onClick={this.blockAction}
                  className={`btn font-m right block-for-block-button ${this.state.data.user.block === 0 ? 'btn-danger' : 'btn-success'}`}
                >
                  {getLocales(String(this.state.data.user.block) === '0'
                    ? 'Заблокировать'
                    : 'Разблокировать')}
                </button>
                <button
                  type="button"
                  onClick={this.sendMessage}
                  className="btn btn-primary font-m right"
                >
                  {getLocales('Отправить сообщение')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="xtabs template xtabs_bottom animate__animated animate__fadeIn">
          <div className="xtabs__body">
            <a className="xtabs__item font-m active">
              <span>{getLocales('История покупок')}</span>
            </a>
          </div>
        </div>

        <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="font-m">
                  {getLocales('Покупки')}
                </h3>

                {this.state.data.user.purchasesList.length > 0
                  ? (
                    <Table
                      columns={tableColumns}
                      items={this.state.items}
                      updateItems={this.updateItems}
                      rowsPerPage="10"
                    />
                  )
                  : (
                    <div className="font-m text-center">
                      {getLocales('Покупки отсутствуют')}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default UserProfile;
