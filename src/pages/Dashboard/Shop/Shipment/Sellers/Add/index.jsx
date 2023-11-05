/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { request, getLocales } from 'utils';

let sellers = [{
  value: '',
  typeofklad: 0,
}];

// TODO
class SellersAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      method: 'one',
      category: '0',
      product: '0',
      subcategory: '0',
      subproduct: '0',
      allkladtypes: 0,
      subcategories: [],
      subproducts: [],
      data: {
        categories: [],
        products: [],
        sellers: [],
        employees: [],
        yourId: 0,
        typeOfKlads: [],
      },
      sellers: [{
        value: '',
        typeofklad: 0,
      }],
      seller: '',
      doubles: 1,
      customCreater: 0,
      spam: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.addSeller = this.addSeller.bind(this);
    this.deleteSeller = this.deleteSeller.bind(this);
    this.getData = this.getData.bind(this);
    this.createSeller = this.createSeller.bind(this);
  }

  createSeller() {
    this.setState({
      loading: true,
    });

    if (String(this.state.category) !== '0' && String(this.state.product) !== '0'
      && (this.state.sellers.length > 0 || this.state.seller.length > 0)) {
      let addresses = [];

      if (this.state.method === 'one') {
        addresses = this.state.sellers;
      } else {
        const sels = this.state.seller.split('\n\n');

        sels.map((sel) => {
          addresses.push({
            value: sel,
            typeofklad: this.state.allkladtypes,
          });
        });
      }

      const data = {
        api: 'user',
        body: {
          data: {
            section: 'shop',
            type: 'shipment',
            subtype: 'sellers',
            category: this.state.category,
            subcategory: this.state.subcategory,
            product: this.state.product,
            subproduct: this.state.subproduct,
            addresses,
            shop: this.props.match.params.shopId,
            action: 'createv2',
            adder: this.props.admin ? this.state.customCreater : this.state.data.yourId,
            doubleCheck: this.state.doubles,
            spam: this.state.spam,
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
              category: '0',
              subcategory: '0',
              product: '0',
              subproduct: '0',
              seller: '',
              sellers: [{
                value: '',
                typeofklad: 0,
              }],
              subcategories: [],
              subproducts: [],
              loading: false,
            });
            sellers = [{
              value: '',
              typeofklad: 0,
            }];
            this.getData();
            toast.success(response.data.message);
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
      toast.error('Заполнены не все поля');
    }
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
          type: 'shipment',
          subtype: 'sellers',
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
            customCreater: response.data.data.yourId,
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

  addSeller() {
    sellers.push({
      value: '',
      typeofklad: 0,
    });

    this.setState({
      sellers,
    }, () => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox' ? 'checked' : 'value'];
    const { name } = e.target;

    if (name === 'category') {
      this.state.data.categories.map((item) => {
        if (String(item.id) === String(value)) {
          if (String(item.sub) === '1') {
            this.setState({
              subcategories: item.subcategories,
              subcategory: '0',
            });
          } else {
            this.setState({
              subcategories: [],
              subcategory: '0',
            });
          }

          this.setState({
            [name]: value,
          });
        }
      });
    } else if (name === 'product') {
      this.state.data.products.map((item) => {
        if (String(item.id) === String(value)) {
          if (String(item.sub) === '1') {
            this.setState({
              subproducts: item.subproducts,
              subproduct: '0',
            });
          } else {
            this.setState({
              subproducts: [],
              subproduct: '0',
            });
          }

          this.setState({
            [name]: value,
          });
        }
      });
    } else if (name === 'sellers') {
      sellers[e.target.id].value = value;

      this.setState({
        sellers,
      });
    } else if (name === 'typeofklad') {
      sellers[e.target.id].typeofklad = +value;

      this.setState({
        sellers,
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
  }

  deleteSeller(id) {
    sellers.splice(id, 1);
    this.setState({
      sellers,
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-12">
          <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <h4 className="font-m">
                {getLocales('Добавление адресов')}
              </h4>
              <br />
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Способ добавления')}
                    </label>
                    <select
                      disabled={this.state.loading}
                      value={this.state.method}
                      onChange={this.handleChange}
                      name="method"
                      className="form-control"
                    >
                      <option value="one">{getLocales('По одному')}</option>
                      <option value="many">{getLocales('Массово')}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Проверка на дубли')}
                    </label>
                    <select
                      disabled={this.state.loading}
                      value={this.state.doubles}
                      onChange={this.handleChange}
                      name="doubles"
                      className="form-control"
                    >
                      <option value="1">{getLocales('Включена')}</option>
                      <option value="0">{getLocales('Выключена')}</option>
                    </select>
                  </div>

                  {this.props.admin
                    ? (
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Добавить от имени')}
                        </label>
                        <select
                          disabled={this.state.loading}
                          value={this.state.customCreater}
                          onChange={this.handleChange}
                          name="customCreater"
                          className="form-control"
                        >
                          {this.state.data.employees.map((item) => (
                            <option value={item.systemId}>
                              {item.login}
                              {' '}
                              {item.notice ? (`(${item.notice})`) : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )
                    : ''}
                  {this.state.method === 'one'
                    ? ''
                    : (
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Тип кладов')}
                        </label>
                        <select
                          disabled={this.state.loading}
                          value={this.state.allkladtypes}
                          onChange={this.handleChange}
                          name="allkladtypes"
                          className="form-control"
                        >
                          {this.state.data.typeOfKlads.map((item) => (
                            <option
                              value={item.id}
                            >
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Город')}
                    </label>
                    <select
                      disabled={this.state.loading}
                      value={this.state.category}
                      onChange={this.handleChange}
                      name="category"
                      className="form-control"
                    >
                      <option disabled value="0">{getLocales('Не выбран')}</option>
                      {this.state.data.categories.map((item) => (
                        <option
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {this.state.subcategories.length > 0 ? (
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Район')}
                      </label>
                      <select
                        disabled={this.state.loading}
                        value={this.state.subcategory}
                        onChange={this.handleChange}
                        name="subcategory"
                        className="form-control"
                      >
                        <option disabled value="0">{getLocales('Не выбран')}</option>
                        {this.state.subcategories.map((item) => (
                          <option
                            value={item.id}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                    : ''}

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Товар')}
                    </label>
                    <select
                      disabled={this.state.loading}
                      value={this.state.product}
                      onChange={this.handleChange}
                      name="product"
                      className="form-control"
                    >
                      <option disabled value="0">{getLocales('Не выбран')}</option>
                      {this.state.data.products.map((item) => (
                        <option
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {this.state.subproducts.length > 0
                    ? (
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Фасовка')}
                        </label>
                        <select
                          disabled={this.state.loading}
                          value={this.state.subproduct}
                          onChange={this.handleChange}
                          name="subproduct"
                          className="form-control"
                        >
                          <option disabled value="0">{getLocales('Не выбран')}</option>
                          {this.state.subproducts.map((item) => (
                            <option value={item.id}>
                              {item.name}
                              {' '}
                              {item.city ? (` (${item.city})`) : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )
                    : ''}
                </div>

                <div className="col-lg-12">
                  {this.state.method === 'one'
                    ? (
                      <div className="row">
                        {this.state.sellers.map((item, key) => (
                          <div className="col-lg-12">
                            <div className="avatar-block">
                              <span className="font-m">
                                {getLocales('Адрес')}
                                {' '}
                                #
                                {key + 1}
                              </span>
                              <div className="row margin-15">
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label className="form-control-label font-m">
                                      {getLocales('Тип клада')}
                                    </label>
                                    <select
                                      disabled={this.state.loading}
                                      id={key}
                                      value={item.typeofklad}
                                      onChange={this.handleChange}
                                      name="typeofklad"
                                      className="form-control"
                                    >
                                      {this.state.data.typeOfKlads.map((option) => (
                                        <option
                                          value={option.id}
                                        >
                                          {option.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="col-lg-12">
                                  <div className="form-group">
                                    <label className="form-control-label font-m">
                                      {getLocales('Содержание')}
                                    </label>
                                    <textarea
                                      placeholder={getLocales('Содержание')}
                                      disabled={this.state.loading}
                                      id={key}
                                      value={item.value}
                                      onChange={this.handleChange}
                                      name="sellers"
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => this.deleteSeller(key)}
                                disabled={this.state.loading}
                                className="btn btn-danger font-m auth-btn margin-15"
                              >
                                {this.state.loading
                                  ? getLocales('Загрузка...')
                                  : getLocales('Удалить')}
                              </button>
                            </div>
                          </div>
                        ))}

                        <div className="col-lg-12">
                          <button
                            type="button"
                            onClick={this.addSeller}
                            disabled={this.state.loading}
                            className="btn btn-secondary font-m auth-btn margin-15"
                          >
                            {this.state.loading
                              ? getLocales('Загрузка...')
                              : getLocales('Добавить')}
                          </button>
                        </div>
                      </div>
                    )
                    : (
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Адреса')}
                        </label>
                        <textarea
                          placeholder={getLocales('Каждый новый адрес необходимо вводить с интервалом 2 строки')}
                          disabled={this.state.loading}
                          value={this.state.seller}
                          onChange={this.handleChange}
                          name="seller"
                          className="form-control sellers-textarea"
                        />
                        <small>
                          {getLocales('Каждый новый адрес необходимо вводить с интервалом 2 строки')}
                        </small>
                      </div>
                    )}
                </div>

                <div className="col-lg-12">
                  <div className="avatar-block margin-15">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="form-control-label font-m">
                            {getLocales('Рассылка о пополнении')}
                          </label>
                          <select
                            disabled={this.state.loading}
                            value={this.state.spam}
                            onChange={this.handleChange}
                            name="spam"
                            className="form-control"
                          >
                            <option value="0">{getLocales('Нет')}</option>
                            <option value="1">{getLocales('Да')}</option>
                          </select>
                        </div>
                      </div>

                      {this.state.method === 'many'
                        ? (
                          <div className="col-lg-6">
                            <div className="form-group">
                              <label className="form-control-label font-m">
                                {getLocales('Итого к добавлению')}
                              </label>
                              <input
                                disabled
                                value={`${this.state.seller.length > 0
                                  ? this.state.seller.split('\n\n').length
                                  : 0} ${getLocales('шт.')}`}
                                className="form-control"
                              />
                            </div>
                          </div>
                        )
                        : ''}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row margin-15">
                <div className="col-lg-2" />
                <div className="col-lg-6" />
                <div className="col-lg-4">
                  <button
                    type="button"
                    onClick={this.createSeller}
                    disabled={this.state.loading}
                    className="btn btn-primary font-m auth-btn right"
                  >
                    {this.state.loading
                      ? getLocales('Загрузка...')
                      : (this.state.action === 'edit'
                        ? getLocales('Сохранить')
                        : getLocales('Добавить адреса'))}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SellersAdd;
