/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-danger */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { ModalConfirm } from 'components';
import { request, getLocales } from 'utils';

class ShopMainSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        available: {},
        settings: {},
        subscription: false,
        subscriptionPrice: 0,
        autoDebit: 0,
      },
      modal: false,
    };
    this.getData = this.getData.bind(this);
    this.sendData = this.sendData.bind(this);
    this.toggle = this.toggle.bind(this);
    this.buy = this.buy.bind(this);
    this.debtOff = this.debtOff.bind(this);
  }

  debtOff() {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'settings',
          shop: this.props.match.params.shopId,
          action: 'debitOff',
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

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  buy() {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'settings',
          shop: this.props.match.params.shopId,
          action: 'disableAdvert',
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
          this.toggle();
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

  componentDidMount() {
    this.getData();
  }

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'settings',
          shop: this.props.match.params.shopId,
          action: 'get',
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

  sendData(e) {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'settings',
          shop: this.props.match.params.shopId,
          action: 'change',
          name: e.target.name,
          value: e.target.value.toString(),
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
      <>
        <div className="row">
          <div className="col-lg-8">
            <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h3 className="font-m">
                  {getLocales('Настройки')}
                </h3>

                <div className="row">
                  {Object.keys(this.state.data.available).map((keyName) => (
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales(this.state.data.available[keyName].title)}
                        </label>

                        {this.state.data.available[keyName].type === 'select'
                          ? (
                            <>
                              <select
                                onChange={this.sendData}
                                value={this.state.data.settings[keyName]
                                  ? this.state.data.settings[keyName]
                                  : this.state.data.available[keyName].default}
                                name={this.state.data.available[keyName].name}
                                className="form-control"
                              >
                                {this.state.data.available[keyName].values.split(',')
                                  .map((value, key) => (
                                    <option value={value}>
                                      {getLocales(this.state.data.available[keyName].valuesNames.split(',')[key])}
                                    </option>
                                  ))}
                              </select>
                              {this.state.data.available[keyName].tip
                                ? (
                                  <small dangerouslySetInnerHTML={{
                                    __html:
                                getLocales(this.state.data.available[keyName].tip),
                                  }}
                                  />
                                )
                                : ''}
                            </>
                          )
                          : (
                            <>
                              <input
                                name={this.state.data.available[keyName].name}
                                onChange={this.sendData}
                                className="form-control"
                                value={this.state.data.settings[keyName]
                                  ? this.state.data.settings[keyName]
                                  : this.state.data.available[keyName].default}
                              />
                              {this.state.data.available[keyName].tip
                                ? (
                                  <small dangerouslySetInnerHTML={{
                                    __html:
                                    getLocales(this.state.data.available[keyName].tip),
                                  }}
                                  />
                                ) : ''}
                            </>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h3 className="font-m">
                  {getLocales('Отключение рекламы')}
                </h3>

                {this.state.data.subscription === false
                  ? (
                    <>
                      <div
                        className="avatar-block font-m notice-chat"
                        dangerouslySetInnerHTML={{
                          __html:
                      getLocales('Отключение рекламы в ботах и на сайте автопродаж.<br/>Стоимость указана за 1 месяц отключения.'),
                        }}
                      />

                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Стоимость')}
                        </label>
                        <div className="input-group">
                          <input
                            disabled
                            value={this.state.data.subscriptionPrice}
                            className="form-control"
                          />
                          <span className="input-group-text">$</span>
                        </div>
                      </div>

                      <div
                        aria-hidden
                        className="btn btn-primary auth-btn font-m"
                        onClick={this.toggle}
                      >
                        {getLocales('Подключить')}
                      </div>
                    </>
                  )
                  : (
                    <>
                      <div className="avatar-block font-m notice-chat">
                        {getLocales('Подписка активна')}
                      </div>

                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Активна до')}
                        </label>
                        <input
                          disabled
                          value={moment.unix(this.state.data.subscription / 1000).format('LLL')}
                          className="form-control"
                        />
                      </div>
                      {this.state.data.autoDebit === 1
                        ? (
                          <div
                            aria-hidden
                            className="btn btn-danger auth-btn font-m"
                            onClick={this.debtOff}
                          >
                            {getLocales('Отключить автопродление')}
                          </div>
                        )
                        : (
                          <div
                            aria-hidden
                            className="btn btn-primary auth-btn font-m"
                            onClick={this.debtOff}
                          >
                            {getLocales('Включить автопродление')}
                          </div>
                        )}
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>

        <ModalConfirm
          action={getLocales('Вы действительно хотите подключить подписку на отключение рекламы?')}
          consequences={getLocales('Средства будут списаны с Вашего баланса, данное действие необратимо, вернуть средства не будет возможным.')}
          modal={this.state.modal}
          toggle={this.toggle}
          loading={this.state.loading}
          sendData={this.buy}
        />
      </>
    );
  }
}

export default ShopMainSettings;
