/* eslint-disable react/destructuring-assignment */
import moment from 'moment';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { request } from 'utils';

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        balances: {
          mine: {
            trusted: 0,
            untrusted_pending: 0,
          },
        },
        transactions: [],
        settings: {},
        sum: 0,
        cryptokassa: 0,
      },
      wallet: '',
      sum: 0,
      satoshi: 3,
    };
    this.getData = this.getData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox' ? 'checked' : 'value'];
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
          section: 'settings',
          type: 'getWallet',
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
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'settings',
          type: 'send',
          address: this.state.wallet,
          amount: this.state.sum,
          satoshi: this.state.satoshi,
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
    return (
      <div className="row">
        <div className="col-lg-6">
          <div className={`income font-m income-orange animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
            <h5>
              <span>
                Баланс
              </span>
            </h5>

            <h2>
              <span>
                {this.state.data.balances.mine.trusted}
                {' '}
                BTC /
                {' '}
                {Math.round(this.state.data.balances.mine.trusted * this.state.data.settings.RUB)}
                {' '}
                RUB /
                {' '}
                {Math.round(this.state.data.balances.mine.trusted * this.state.data.settings.USD)}
                {' '}
                USD
                {' '}
              </span>
            </h2>

          </div>
        </div>

        <div className="col-lg-6">
          <div className={`income font-m animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
            <h5>
              <span>
                Ожидает подтверждения
              </span>
            </h5>

            <h2>
              <span>
                {this.state.data.balances.mine.untrusted_pending}
                {' '}
                BTC /
                {' '}
                {Math.round(
                  this.state.data.balances.mine.untrusted_pending * this.state.data.settings.RUB,
                )}
                {' '}
                RUB /
                {' '}
                {Math.round(
                  this.state.data.balances.mine.untrusted_pending * this.state.data.settings.USD,
                )}
                {' '}
                USD
                {' '}
              </span>
            </h2>
          </div>
        </div>

        <div className="col-lg-12">
          <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <div className="row">
                <div className="col-lg-12">
                  <h3 className="font-m">
                    Кошелек
                  </h3>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="avatar-block font-m text-center">
                        {this.state.data.settings.fee30min}
                        {' '}
                        sat/vByte
                        <br />
                        30 мин
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="avatar-block font-m text-center">
                        {this.state.data.settings.fee60min}
                        {' '}
                        sat/vByte
                        <br />
                        60 мин
                      </div>
                    </div>

                    <div className="col-lg-8">
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          Адрес для перевода
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          className="form-control"
                          placeholder="Вставьте адрес"
                          name="wallet"
                          value={this.state.wallet}
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          Сумма перевода
                        </label>
                        <div className="input-group">
                          <input
                            type="number"
                            autoComplete="off"
                            className="form-control"
                            placeholder="Введите сумму"
                            name="sum"
                            value={this.state.sum}
                            onChange={this.handleChange}
                          />
                          <span className="input-group-text">
                            BTC
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-8">
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          Комиссия
                          {this.state.satoshi}
                          {' '}
                          sat/vByte
                        </label>
                        <input
                          type="range"
                          name="satoshi"
                          onChange={this.handleChange}
                          min="1"
                          max="200"
                          step="1"
                          value={this.state.satoshi}
                          className="form-control-range"
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 center-flex">
                      <button
                        type="button"
                        className="btn btn-primary font-m auth-btn"
                        onClick={this.sendData}
                      >
                        Отправить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <h3 className="font-m">
                Последние 100 транзакций
              </h3>

              <div className="avatar-block font-m">
                <div className="row no-margin">
                  <div className="col-lg-1">
                    Тип
                  </div>

                  <div className="col-lg-3">
                    Кошелек
                  </div>

                  <div className="col-lg-2">
                    Сумма
                  </div>

                  <div className="col-lg-2">
                    Дата
                  </div>

                  <div className="col-lg-4">
                    TXID
                  </div>
                </div>
              </div>

              {this.state.data.transactions.map((item) => (
                <div className="avatar-block font-m">
                  <div className="row">
                    <div className="col-lg-1">
                      {item.category
                        .replace(/send/g, 'Отправка')
                        .replace(/receive/g, 'Получение')}
                    </div>

                    <div className="col-lg-3">
                      {item.address}
                    </div>

                    <div className="col-lg-2">
                      {item.amount}
                    </div>

                    <div className="col-lg-2">
                      {moment.unix(item.time).format('LLL')}
                    </div>

                    <div className="col-lg-4">
                      {item.txid}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Wallet;
