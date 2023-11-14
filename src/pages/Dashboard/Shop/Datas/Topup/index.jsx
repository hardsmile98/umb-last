/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { request, getLocales } from 'utils';

const getType = (reason) => {
  switch (reason) {
    case 'topup':
      return getLocales('Пополнение');
    case 'overpay':
      return getLocales('Переплата');
    case 'smallPay':
      return getLocales('Недоплата');
    default:
      return null;
  }
};

class TopupItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: {
        topup: {
        },
        currency: 'EE',
      },
    };
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    // this.setState({
    //   loading: true,
    // });

    // const data = {
    //   api: 'user',
    //   body: {
    //     data: {
    //       section: 'shop',
    //       type: 'datas',
    //       subtype: 'topups',
    //       shop: this.props.match.params.shopId,
    //       action: 'getTopup',
    //       id: this.props.match.params.topupId,
    //     },
    //     action: 'shops',
    //   },
    //   headers: {
    //     authorization: localStorage.getItem('token'),
    //   },
    // };

    // request(data, (response) => {
    //   if (response.status === 200) {
    //     if (response.data.success) {
    //       this.setState({
    //         data: response.data.data,
    //         loading: false,
    //       });
    //     } else {
    //       this.setState({
    //         loading: false,
    //       });
    //       toast.error(response.data.message);
    //     }
    //   } else {
    //     toast.error('Сервер недоступен');
    //   }
    // });

    const response = {
      data: {
        success: true,
        message: 'Данные успешно отправлены',
        data: {
          topup: {
            id: 1325,
            reason: 'topup',
            user: 73,
            nameUser: 'Maxim',
            sum: 850,
            created: '1697319518048',
            closed: '1697319903749',
            status: 1,
            type: 'LTC',
            deposit: 593690,
            toUser: 0.0001,
            purchase: 0,
          },
          currency: 'RUB',
        },
      },
    };

    this.setState({ data: response.data.data });
  }

  render() {
    return (
      <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
        <div className="block-body">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="font-m">
                {getLocales('Пополнение')}
                {' #'}
                {this.props.match.params.topupId}
              </h3>
            </div>

            <div className="col-lg-4">
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Тип')}
                </label>
                <input
                  name="location"
                  value={getType(this.state.data.topup.reason)}
                  className="form-control"
                  disabled
                />
              </div>
            </div>

            <div className="col-lg-4">
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Сумма')}
                </label>
                <div className="input-group">
                  <input
                    disabled
                    value={this.state.data.topup.sum}
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
                  {getLocales('Пользователь')}
                </label>
                <div className="input-group mb-3">
                  <input
                    name="nameUser"
                    value={this.state.data.topup.nameUser}
                    className="form-control"
                    disabled
                  />

                  {String(this.state.data.topup.user) !== '0' && (
                    <NavLink
                      to={`/dashboard/shops/${this.props.match.params.shopId}/datas/users/${this.state.data.topup.user}`}
                    >
                      <button
                        className="btn btn-secondary font-m"
                        type="button"
                        id="button-addon2"
                      >
                        {getLocales('Перейти в профиль')}
                      </button>
                    </NavLink>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Способ оплаты')}
                </label>
                <input
                  name="method"
                  value={this.state.data.topup.type}
                  className="form-control"
                  disabled
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Начислено на баланс')}
                </label>
                <div className="input-group">
                  <input
                    disabled
                    value={this.state.data.topup.toUser}
                    className="form-control"
                  />
                  <span className="input-group-text">
                    BTC
                  </span>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Пополнение создано')}
                </label>
                <input
                  name="method"
                  value={moment.unix(this.state.data.topup.created / 1000).format('LLL')}
                  className="form-control"
                  disabled
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Пополнение завершено')}
                </label>
                <input
                  name="method"
                  value={moment.unix(this.state.data.topup.closed / 1000).format('LLL')}
                  className="form-control"
                  disabled
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary font-m"
            onClick={() => this.props.history.goBack()}
          >
            {getLocales('Назад')}
          </button>
        </div>
      </div>
    );
  }
}

export default TopupItem;
