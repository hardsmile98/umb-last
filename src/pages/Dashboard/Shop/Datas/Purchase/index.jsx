/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { request, getLocales } from 'utils';
import SetAsNoffoundModal from './SetAsNoffoundModal';

class PurchaseItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        purchase: {
          exchange: {},
        },
        currency: 'EE',
      },
      modal: false,
    };
    this.getData = this.getData.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  componentDidMount() {
    this.getData();
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
          subtype: 'purchases',
          shop: this.props.match.params.shopId,
          action: 'getPurchase',
          id: this.props.match.params.purchaseId,
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

  render() {
    return (
      <>
        <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="font-m">
                  {getLocales('Покупка')}
                  {' #'}
                  {this.props.match.params.purchaseId}
                  {' '}
                  {(String(this.state.data.purchase.notfound) === '0' && this.state.data.purchase.courier) && (
                    <span
                      aria-hidden
                      className="right pointer"
                      onClick={this.toggle}
                    >
                      {getLocales('Отметить как ненаход')}
                    </span>
                  )}
                </h3>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Локация')}
                  </label>
                  <input
                    name="location"
                    value={this.state.data.purchase.category + (this.state.data.purchase.subcategory
                      ? (` / ${this.state.data.purchase.subcategory}`)
                      : '')}
                    className="form-control"
                    disabled
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Товар')}
                  </label>
                  <input
                    name="product"
                    value={this.state.data.purchase.product + (this.state.data.purchase.subproduct
                      ? (` / ${this.state.data.purchase.subproduct}`)
                      : '')}
                    className="form-control"
                    disabled
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Покупатель')}
                  </label>
                  <div className="input-group mb-3">
                    <input
                      name="nameUser"
                      value={this.state.data.purchase.nameUser}
                      className="form-control"
                      disabled
                    />

                    {String(this.state.data.purchase.user) !== '0'
                      ? (
                        <NavLink
                          to={`/dashboard/shops/${this.props.match.params.shopId}/datas/users/${this.state.data.purchase.user}`}
                        >
                          <button
                            className="btn btn-secondary font-m"
                            type="button"
                            id="button-addon2"
                          >
                            {getLocales('Перейти в профиль')}
                          </button>
                        </NavLink>
                      )
                      : ''}
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                {this.state.data.purchase.seller
                  ? (
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Адрес')}
                      </label>
                      <textarea
                        value={this.state.data.purchase.seller}
                        className="form-control"
                        disabled
                      >
                        {this.state.data.purchase.seller}
                      </textarea>
                    </div>
                  )
                  : (
                    <div className="avatar-block notice-chat font-m text-center">
                      <p>
                        {getLocales('Адрес не был выдан, по причине того, что в наличии не было товара по данному направлению, после пополнения магазина адресами, заказам, с невыданным адресом по данному направлению будет автоматически распределяться добавленный товар, в порядке очереди.')}
                      </p>
                    </div>
                  )}
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Сумма')}
                  </label>
                  <div className="input-group">
                    <input
                      disabled
                      value={this.state.data.purchase.sum}
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
                    {getLocales('Способ оплаты')}
                  </label>
                  <input
                    name="method"
                    value={this.state.data.purchase.type}
                    className="form-control"
                    disabled
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Заказ создан')}
                  </label>
                  <input
                    name="method"
                    value={moment.unix(this.state.data.purchase.created / 1000).format('LLL')}
                    className="form-control"
                    disabled
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Кошелек для оплаты')}
                  </label>
                  <input
                    name="method"
                    value={this.state.data.purchase.exchange.wallet}
                    className="form-control"
                    disabled
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Сумма для оплаты')}
                  </label>
                  <input
                    disabled
                    value={this.state.data.purchase.exchange.sum}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-lg-8">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Начислено на баланс')}
                  </label>
                  <div className="input-group">
                    <input
                      disabled
                      value={this.state.data.purchase.exchange.toUser}
                      className="form-control"
                    />
                    <span className="input-group-text">
                      BTC
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Дата завершения покупки')}
                  </label>
                  <div className="input-group">
                    <input
                      disabled
                      value={moment.unix(this.state.data.purchase.closed / 1000).format('LLL')}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              {!!this.state.data.purchase.courier && (
              <>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Создатель адреса')}
                    </label>
                    <input disabled value={this.state.data.purchase.courier} className="form-control" />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Заказ отмечен как ненаход')}
                    </label>
                    <input
                      disabled
                      value={String(this.state.data.purchase.notfound) === '0'
                        ? getLocales('Нет')
                        : getLocales('Да')}
                      className="form-control"
                    />
                  </div>
                </div>
              </>
              )}
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

        <SetAsNoffoundModal
          getData={this.getData}
          shop={this.props.match.params.shopId}
          purchase={this.props.match.params.purchaseId}
          currency={this.state.data.currency}
          ownerAdd={this.state.data.purchase.ownerAdd}
          toggle={this.toggle}
          modal={this.state.modal}
        />
      </>
    );
  }
}

export default PurchaseItem;
