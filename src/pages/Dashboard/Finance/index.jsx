/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';

import { toast } from 'react-toastify';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleDown, faArrowAltCircleUp,
  faSearchPlus, faCopy, faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';

import { Table, ModalConfirm } from 'components';
import { request, getLocales } from 'utils';
import FinanceModal from './Modal';
import ModalSend from './ModalSend';

let interval;

class Finance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        courses: {
          RUB: 0,
          USD: 0,
          UAH: 0,
          fee30min: 0,
          fee60min: 0,
        },
        user: {
          balance: 0,
        },
        wallets: [],
      },
      paymentSum: 0,
      withdrawalSum: 0,
      withdrawalSumFiat: 0,
      wallet: '',
      items: [],
      withType: 'moment',
      confirmModal: false,
      paymentCancel: 0,
      operation: {},
      modal: false,
      fiatName: 'USD',
      satoshi: 1,
      transFee: 0,
      transSum: 0,
      typeSend: 'ALL',
      password: '',
    };
    this.getData = this.getData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createPayment = this.createPayment.bind(this);
    this.createWithdrawal = this.createWithdrawal.bind(this);
    this.cancelPayment = this.cancelPayment.bind(this);
    this.confirmToggle = this.confirmToggle.bind(this);
    this.toggle = this.toggle.bind(this);
    this.createWallet = this.createWallet.bind(this);
    this.sendAll = this.sendAll.bind(this);
    this.toggleSend = this.toggleSend.bind(this);
    this.sendForAll = this.sendForAll.bind(this);
    this.sendSum = this.sendSum.bind(this);
  }

  componentDidMount() {
    this.getData();
    interval = setInterval(this.getData, 1000);
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  handleChange(e) {
    const { state } = this;

    const value = e.target[e.target.type === 'checkbox' ? 'checked' : 'value'];
    const { name } = e.target;

    if (name === 'withdrawalSumFiat') {
      this.setState({
        [name]: value,
        withdrawalSum: +((value / state.data.courses[state.fiatName]).toFixed(8).replace(',', '.')),
      });
    } else if (name === 'withdrawalSum') {
      this.setState({
        [name]: value,
        withdrawalSumFiat: Math.round(value * state.data.courses[state.fiatName]),
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
  }

  getData(open) {
    const { state, props } = this;

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'main',
          type: 'get',
        },
        action: 'finance',
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
          });

          if (!state.modalSend) {
            this.setState({
              loading: false,
            });
          }

          if (state.satoshi === 1) {
            this.setState({
              satoshi: +response.data.data.courses.fee60min,
            });
          }

          this.prepareTableData();

          if (props.match.params.operationId) {
            this.toggle(props.match.params.operationId);
          }

          if (open) {
            this.toggle(open);
          }
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

  confirmToggle(id) {
    const { state } = this;

    this.setState({
      confirmModal: !state.confirmModal,
      paymentCancel: id,
    });
  }

  toggle(id) {
    const { state } = this;

    state.data.operations.forEach((operation) => {
      if (operation.id === id) {
        this.setState({
          operation,
        });
      }
    });

    this.setState({
      modal: !state.modal,
    });
  }

  prepareTableData() {
    const { state } = this;

    const items = [];

    state.data.operations.forEach((item) => {
      const itemModified = {
        id: item.id,
        type: item.type,
        name: getLocales(item.name),
        sum: `${item.sum} BTC`,
        created: moment.unix(item.created / 1000).format('LLL'),
        status: item.status,
      };

      items.push(itemModified);
    });

    this.setState({
      items,
    });
  }

  updateItems(items) {
    this.setState({
      items,
    });
  }

  cancelPayment() {
    const { state } = this;

    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'main',
          type: 'cancelPayment',
          id: state.paymentCancel,
        },
        action: 'finance',
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
            confirmModal: false,
          });
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

  createWallet() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'main',
          type: 'createWallet',
        },
        action: 'finance',
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

  createPayment() {
    const { state } = this;

    this.setState({
      loading: true,
    });

    if (state.paymentSum >= 10) {
      const data = {
        api: 'user',
        body: {
          data: {
            section: 'main',
            type: 'createPayment',
            sum: state.paymentSum,
          },
          action: 'finance',
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
              paymentSum: 0,
            });
            toast.success(response.data.message);
            this.getData(response.data.data.id);
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
      this.setState({
        loading: false,
      });
      toast.error('Минимальная сумма пополнения - 10 долларов');
    }
  }

  createWithdrawal() {
    const { state } = this;

    this.setState({
      loading: true,
    });

    if (state.withdrawalSum > 0) {
      if (state.wallet !== 0) {
        const data = {
          api: 'user',
          body: {
            data: {
              section: 'main',
              type: 'createWithdrawal',
              sum: state.withdrawalSum,
              wallet: state.wallet,
            },
            action: 'finance',
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
                withdrawalSum: 0,
                withdrawalSumFiat: 0,
                wallet: 0,
              });
              toast.success(response.data.message);
              this.getData(response.data.data.id);
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
        this.setState({
          loading: false,
        });
        toast.error('Не выбран кошелек для вывода');
      }
    } else {
      this.setState({
        loading: false,
      });
      toast.error('Введите сумму вывода');
    }
  }

  sendForAll() {
    const { state } = this;

    this.setState({
      loading: true,
    });

    const data = {
      api: 'withdrawal',
      body: {
        data: {
          wallet: state.wallet,
          type: 'all',
          sendType: 'send',
          sum: state.typeSend === 'ALL'
            ? (+state.transSum - (state.transFee * state.satoshi))
            : +state.transSum,
          satoshi: state.satoshi,
          password: state.password,
        },
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          toast.success(response.data.message);
          this.toggleSend();
          this.setState({
            loading: false,
            wallet: '',
            transSum: 0,
            withdrawalSum: 0,
            withdrawalSumFiat: 0,
            password: '',
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

  sendSum() {
    const { state } = this;

    if (state.wallet) {
      this.setState({
        loading: true,
      });

      const data = {
        api: 'withdrawal',
        body: {
          data: {
            wallet: state.wallet,
            type: 'sum',
            sum: +state.withdrawalSum,
            sendType: 'pred',
            withType: state.withType,
            password: state.password,
          },
        },
        headers: {
          authorization: localStorage.getItem('token'),
        },
      };

      request(data, (response) => {
        if (response.status === 200) {
          if (response.data.success) {
            if (state.withType === 'moment') {
              this.setState({
                transFee: response.data.data.fee,
                transSum: response.data.data.sum,
                typeSend: 'SUM',
              }, () => {
                this.toggleSend();
              });
            } else {
              this.setState({
                wallet: '',
                withdrawalSum: 0,
                withdrawalSumFiat: 0,
                password: '',
              });
              toast.success(response.data.message);
            }
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
      toast.error('Вставьте адрес, куда требуется перевести средства');
    }
  }

  sendAll() {
    const { state } = this;

    if (state.wallet) {
      this.setState({
        loading: true,
      });

      const data = {
        api: 'withdrawal',
        body: {
          data: {
            wallet: state.wallet,
            type: 'all',
            sendType: 'pred',
            withType: state.withType,
            password: state.password,
          },
        },
        headers: {
          authorization: localStorage.getItem('token'),
        },
      };

      request(data, (response) => {
        if (response.status === 200) {
          if (response.data.success) {
            if (state.withType === 'moment') {
              this.setState({
                transFee: response.data.data.fee,
                transSum: response.data.data.sum,
                typeSend: 'ALL',
              }, () => {
                this.toggleSend();
              });
            } else {
              this.setState({
                wallet: '',
                withdrawalSum: 0,
                withdrawalSumFiat: 0,
                password: '',
              });

              toast.success(response.data.message);
            }
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
      toast.error('Вставьте адрес, куда требуется перевести средства');
    }
  }

  toggleSend() {
    const { state } = this;

    this.setState({
      modalSend: !state.modalSend,
    });
  }

  render() {
    const tableColumns = [
      {
        title: 'ID', dataIndex: 'id', key: 'id', sort: true,
      },
      {
        title: getLocales('Тип'),
        dataIndex: '',
        key: 'operations',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        render: (e, item) => (
          <div className="sparkline8">
            <span className={(item.name === 'Покупка услуги' || item.name === 'Вывод средств')
              ? 'text-danger' : 'text-success'}
            >
              <FontAwesomeIcon icon={(item.name === 'Покупка услуги' || item.name === 'Вывод средств')
                ? faArrowAltCircleUp
                : faArrowCircleDown}
              />
            </span>
          </div>
        ),
      },
      {
        title: getLocales('Операция'), dataIndex: 'name', key: 'name', sort: true,
      },
      {
        title: getLocales('Сумма'), dataIndex: 'sum', key: 'sum', sort: true,
      },
      {
        title: getLocales('Создана'), dataIndex: 'created', key: 'created', sort: true,
      },
      {
        title: getLocales('Статус'),
        dataIndex: '',
        key: 'operations',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        render: (e, item) => (
          <div className="sparkline8">
            <button
              type="button"
              className={`btn  font-m auth-btn ${item.status === 1
                ? ' btn-primary'
                : (item.status === -1
                  ? ' btn-danger'
                  : ' btn-secondary')}`}
            >
              {' '}
              {item.status === 1
                ? getLocales('Завершена')
                : (item.status === -1
                  ? getLocales('Отменена')
                  : getLocales('Ожидает подтверждений'))}
            </button>
          </div>
        ),
      },
      {
        title: getLocales('Действия'),
        dataIndex: '',
        key: 'operations',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        render: (e, item) => (
          <div className="sparkline8">
            <button
              type="button"
              onClick={() => {
                this.toggle(item.id);
              }}
              className="btn btn-secondary btn-table"
            >
              <FontAwesomeIcon icon={faSearchPlus} />
            </button>
          </div>
        ),
      },
    ];

    const { state } = this;

    return (
      <>
        <div className="row">
          <div className="col-lg-4">
            <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h3 className="font-m">
                  {getLocales('Кошелек')}
                </h3>

                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Баланс')}
                      </label>
                      <div className="input-group">
                        <input
                          name="available"
                          disabled
                          value={state.data.user.balance.toFixed(8)}
                          type="number"
                          autoComplete="off"
                          className="form-control"
                        />
                        <span className="input-group-text">BTC</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Баланс в')}
                        {' '}
                        {state.fiatName}
                      </label>
                      <div className="input-group">
                        <input
                          name="availableFiat"
                          disabled
                          value={Math.round(
                            state.data.user.balance * state.data.courses[state.fiatName],
                          )}
                          type="number"
                          autoComplete="off"
                          className="form-control"
                        />
                        <div className="input-group-append">
                          <select
                            disabled={state.loading}
                            onChange={this.handleChange}
                            value={state.fiatName}
                            name="fiatName"
                            className="form-control"
                          >
                            <option value="USD">USD ▼</option>
                            <option value="RUB">RUB ▼</option>
                            <option value="UAH">UAH ▼</option>
                            <option value="KZT">KZT ▼</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <h3 className="font-m">
                      {getLocales('Адреса')}
                      {' '}
                      <span
                        aria-hidden
                        className="right text-danger cursor-pointer pointer"
                        onClick={this.createWallet}
                      >
                        <FontAwesomeIcon icon={faPlusCircle} />
                        {' '}
                        {getLocales('Создать адрес')}
                      </span>
                    </h3>

                    <div className="row">
                      {state.data.wallets.map((item) => (
                        <div className="col-lg-12 address-block">
                          <div className="input-group">
                            <input
                              name="available"
                              disabled
                              value={item.value}
                              autoComplete="off"
                              className="form-control"
                            />
                            <div className="input-group-append">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(item.value);
                                  toast.success(getLocales('Успешно добавлено в буфер обмена'));
                                }}
                                className="btn btn-secondary"
                                type="button"
                              >
                                <FontAwesomeIcon icon={faCopy} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h3 className="font-m">
                  {getLocales('Вывод средств')}
                </h3>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="avatar-block notice font-m">
                      <b>
                        {getLocales('Типы выводов')}
                        :
                      </b>
                      <br />
                      <b>{getLocales('Моментальный')}</b>
                      {' - '}
                      {getLocales('комиссию сети оплачиваете Вы, транзакция отправляется в течении 2-3 минут после создания заявки на вывод.')}
                      <br />
                      <b>{getLocales('Массовый')}</b>
                      {' - '}
                      {getLocales('комиссию сети оплачивает сервис, выплата производится раз в 12 часов, в 6 утра и в 6 вечера по UTC+3 (Московское время), заявку на вывод можно создать в любое время.')}
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Тип вывода')}
                      </label>
                      <select
                        disabled={state.loading}
                        value={state.withType}
                        onChange={this.handleChange}
                        name="withType"
                        className="form-control"
                      >
                        <option value="moment">{getLocales('Моментальный')}</option>
                        <option value="mass">{getLocales('Массовый')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-lg-8">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Адрес для перевода')}
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control"
                        placeholder={getLocales('Вставьте адрес')}
                        name="wallet"
                        value={state.wallet}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Пароль')}
                        {' '}
                      </label>
                      <input
                        type="password"
                        autoComplete="off"
                        className="form-control"
                        placeholder={getLocales('Введите пароль')}
                        name="password"
                        value={state.password}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-lg-5">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Сумма перевода')}
                        {' '}
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          autoComplete="off"
                          className="form-control"
                          placeholder={getLocales('Введите сумму')}
                          name="withdrawalSum"
                          value={state.withdrawalSum}
                          onChange={this.handleChange}
                        />
                        <span className="input-group-text">
                          BTC
                        </span>
                        <div className="input-group-append">
                          <button
                            type="button"
                            onClick={this.sendAll}
                            className="btn btn-secondary font-m"
                          >
                            {getLocales('Вывести всё')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Сумма перевода в')}
                        {' '}
                        {state.fiatName}
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          autoComplete="off"
                          className="form-control"
                          placeholder={getLocales('Введите сумму')}
                          name="withdrawalSumFiat"
                          value={state.withdrawalSumFiat}
                          onChange={this.handleChange}
                        />
                        <div className="input-group-append">
                          <select
                            disabled={state.loading}
                            onChange={this.handleChange}
                            value={state.fiatName}
                            name="fiatName"
                            className="form-control"
                          >
                            <option value="USD">USD ▼</option>
                            <option value="RUB">RUB ▼</option>
                            <option value="UAH">UAH ▼</option>
                            <option value="KZT">KZT ▼</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6" />
                  <div className="col-lg-6">
                    <button
                      type="button"
                      onClick={this.sendSum}
                      disabled={state.loading}
                      className="btn btn-primary font-m auth-btn"
                    >
                      {state.loading
                        ? getLocales('Загрузка...')
                        : getLocales('Отправить средства')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h3 className="font-m">
                  {getLocales('Финансовые операции')}
                </h3>
                <br />

                {state.items.length <= 0
                  ? (
                    <div className="text-center font-m">
                      {getLocales('Операции отсутствуют')}
                    </div>
                  )
                  : (
                    <Table
                      search={false}
                      columns={tableColumns}
                      items={state.items}
                      updateItems={this.updateItems}
                      rowsPerPage="10"
                    />
                  )}
              </div>
            </div>
          </div>
        </div>

        <FinanceModal
          modal={state.modal}
          toggle={this.toggle}
          operation={state.operation}
        />

        <ModalConfirm
          action={getLocales('Вы действительно хотите отменить данную заявку на пополнение?')}
          consequences={getLocales('Данное действие безвозвратно, если Вы уже перевели средства, или сделаете это после, средства не начислятся на баланс.')}
          modal={state.confirmModal}
          toggle={this.confirmToggle}
          loading={state.loading}
          sendData={this.cancelPayment}
        />

        <ModalSend
          courses={state.data.courses}
          type={state.typeSend}
          send={this.sendForAll}
          loading={state.loading}
          modal={state.modalSend}
          toggle={this.toggleSend}
          satoshi={state.satoshi}
          sum={state.transSum}
          fee={state.transFee}
          wallet={state.wallet}
          handleChange={this.handleChange}
        />
      </>
    );
  }
}

export default Finance;
