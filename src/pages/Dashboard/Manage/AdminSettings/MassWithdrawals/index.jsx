/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import { faCopy, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table } from 'components';
import { request } from 'utils';

let interval = '';

class MassWithdrawals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        withdrawals: [],
        users: [],
        finance: [],
      },
      sumOfWith: 0,
      items: [],
    };

    this.getData = this.getData.bind(this);
    this.sendData = this.sendData.bind(this);
    this.updateItems = this.updateItems.bind(this);
    this.prepareTableData = this.prepareTableData.bind(this);
    this.setOk = this.setOk.bind(this);
  }

  componentDidMount() {
    this.getData();
    interval = setInterval(this.getData, 10000);
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  getData() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'settings',
          type: 'getMassWith',
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

  setOk(id) {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'settings',
          type: 'setModerMass',
          id,
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

  sendData(id) {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'settings',
          type: 'setPayedOnceMass',
          id,
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

  updateItems(items) {
    this.setState({
      items,
    });
  }

  prepareTableData() {
    const items = [];

    let sumOfWith = 0;

    this.state.data.finance.map((item) => {
      this.state.data.users.map((user) => {
        if (+user.id === +item.user) {
          const itemModified = {
            id: item.id,
            wallet: item.wallet,
            sum: `${item.sum} BTC`,
            created: moment.unix(item.created / 1000).format('LLL'),
            userId: user.id,
            finish: moment.unix(item.finish / 1000).format('LLL'),
            user: user.login,
          };

          items.push(itemModified);
        }
      });
    });

    if (this.state.data.withdrawals.length > 0) {
      this.state.data.withdrawals.map((item) => {
        sumOfWith += +item.sum;
      });
    }

    this.setState({
      items,
      sumOfWith,
    });
  }

  render() {
    const tableColumns = [
      {
        title: 'ID', dataIndex: 'id', key: 'id', sort: true,
      },
      {
        title: 'Кошелек', dataIndex: 'wallet', key: 'wallet', sort: true,
      },
      {
        title: 'Сумма', dataIndex: 'sum', key: 'sum', sort: true,
      },
      {
        title: 'Создана', dataIndex: 'created', key: 'created', sort: true,
      },
      {
        title: 'Исполнена', dataIndex: 'finish', key: 'finish', sort: true,
      },
      {
        title: 'Пользователь',
        dataIndex: '',
        key: 'operations',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        render: (e, item) => (
          <div className="sparkline8">
            <NavLink to={`/dashboard/manage/datas/users/${item.userId}`}>
              {item.user}
            </NavLink>
          </div>
        ),
      },
    ];
    return (
      <>
        <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="font-m">
                  Заявки на массовый вывод
                </h3>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="avatar-block font-m text-center">
                      {this.state.sumOfWith}
                      {' '}
                      BTC
                      <br />
                      Сумма заявок
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="avatar-block font-m">
                      <div className="row">
                        <div className="col-lg-1">
                          ID
                        </div>

                        <div className="col-lg-4">
                          Кошелек
                        </div>

                        <div className="col-lg-1">
                          Сумма
                        </div>

                        <div className="col-lg-4">
                          Юзер
                        </div>
                      </div>
                    </div>
                  </div>
                  {this.state.data.withdrawals.map((item) => (
                    <div className="col-lg-12">
                      <div className="avatar-block font-m">
                        <div className="row">
                          <div className="col-lg-1 center">
                            {item.id}
                          </div>

                          <div className="col-lg-3 center">
                            {item.wallet}
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.wallet);
                                toast.success('Скопировано');
                              }}
                              className="btn btn-primary auth-btn"
                            >
                              <FontAwesomeIcon icon={faCopy} />
                            </button>
                          </div>

                          <div className="col-lg-1 center">
                            {item.sum}
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.sum);
                                toast.success('Скопировано');
                              }}
                              className="btn btn-primary auth-btn"
                            >
                              <FontAwesomeIcon icon={faCopy} />
                            </button>
                          </div>

                          <div className="col-lg-2 center">
                            {this.state.data.users
                              .map((user) => (+user.id === +item.user
                                ? (
                                  <NavLink to={`/dashboard/manage/datas/users/${item.user}`}>
                                    {user.login}
                                    {' '}
                                    (выводов:
                                    {' '}
                                    {item.last}
                                    )
                                    {' '}
                                    {+item.isPremium === 1 && <FontAwesomeIcon icon={faStar} />}
                                  </NavLink>
                                )
                                : ''))}
                          </div>

                          <div className="col-lg-2">
                            {+item.isPremium === 0 && +item.last < 2 && +item.moder === 0
                              ? (
                                <button
                                  type="button"
                                  className="btn btn-primary font-m"
                                  onClick={() => this.setOk(item.id)}
                                >
                                  одобрить
                                </button>
                              )
                              : (
                                <button
                                  type="button"
                                  className="btn btn-primary font-m"
                                  onClick={() => this.sendData(item.id)}
                                >
                                  отметить оплачнной
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="block animate__animated animate__fadeIn ">
          <div className="block-body">
            <h3 className="font-m">
              Исполненные выводы
            </h3>

            <Table
              columns={tableColumns}
              items={this.state.items}
              updateItems={this.updateItems}
              rowsPerPage="10"
            />
          </div>
        </div>
      </>
    );
  }
}

export default MassWithdrawals;
