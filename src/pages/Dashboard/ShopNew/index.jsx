/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { request, getLocales } from 'utils';
import CreateShopModal from './CreateShopModal';

class ShopNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        subdomain: '',
        currencies: [],
      },
      currency: '',
      subdomain: '',
      modal: false,
    };
    this.getData = this.getData.bind(this);
    this.sendData = this.sendData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
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
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'new',
          type: 'get',
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

  toggle() {
    const { state } = this;

    if (!state.currency || !state.subdomain) {
      toast.error(getLocales('Заполнены не все поля'));
      return;
    }

    this.setState({
      modal: !state.modal,
    });
  }

  sendData() {
    const { state } = this;

    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'new',
          type: 'create',
          currency: state.currency,
          subdomain: state.subdomain,
        },
        action: 'shops',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      const { props } = this;

      if (response.status === 200) {
        if (response.data.success) {
          toast.success(response.data.message);
          props.history.push(`/dashboard/shops/${response.data.data.id}`);
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
    const { state } = this;

    return (
      <>
        <div className="row">
          <div className="col-lg-4">
            <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h4 className="font-m">
                  {getLocales('Создание магазина')}
                </h4>

                <br />

                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Субдомен')}
                  </label>

                  <div className="input-group">
                    <input
                      type="text"
                      value={state.subdomain}
                      onChange={this.handleChange}
                      autoComplete="off"
                      className="form-control"
                      placeholder={getLocales('Введите субдомен')}
                      name="subdomain"
                    />
                    <span className="input-group-text font-m">
                      .
                      {state.data.subdomain}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Валюта')}
                  </label>

                  <select
                    value={state.currency}
                    onChange={this.handleChange}
                    name="currency"
                    className="form-control"
                  >
                    <option disabled value="">{getLocales('Не выбрано')}</option>
                    {state.data.currencies.map((item) => (
                      <option
                        value={item.name}
                      >
                        {getLocales(item.title)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-right">
                  <Link to="/dashboard/shops">
                    <button
                      type="button"
                      disabled={state.loading}
                      className="btn btn-secondary font-m left"
                    >
                      {state.loading
                        ? getLocales('Загрузка...')
                        : getLocales('Назад')}
                    </button>
                  </Link>

                  <button
                    type="button"
                    onClick={this.toggle}
                    disabled={state.loading}
                    className="btn btn-primary font-m"
                  >
                    {state.loading
                      ? getLocales('Загрузка...')
                      : getLocales('Создать магазин')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CreateShopModal
          sendData={this.sendData}
          loading={state.loading}
          modal={state.modal}
          toggle={this.toggle}
        />
      </>
    );
  }
}

export default ShopNew;
