/* eslint-disable no-nested-ternary */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { request, getLocales } from 'utils';

let subproducts = [
  {
    name: '',
    discount: 0,
    price: 0,
    bonus: 0,
    fine: 0,
    sum: 0,
    city: '',
  },
];
const deleted = [];

class ProductsAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      name: '',
      sub: 0,
      price: 0,
      discount: 0,
      fine: 0,
      bonus: 0,
      image: '',
      subproducts: [{
        name: '',
        discount: 0,
        price: 0,
        bonus: 0,
        fine: 0,
        sum: 0,
        city: '',
      }],
      action: 'create',
      deleted: [],
      description: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.addSubproduct = this.addSubproduct.bind(this);
    this.deleteSubproduct = this.deleteSubproduct.bind(this);
    this.sendData = this.sendData.bind(this);
    this.getProduct = this.getProduct.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.getProduct();
    }
  }

  getProduct() {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'shipment',
          subtype: 'products',
          id: this.props.match.params.id,
          shop: this.props.match.params.shopId,
          action: 'getProduct',
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
            name: response.data.data.name,
            sub: response.data.data.sub,
            price: response.data.data.price,
            discount: response.data.data.discount,
            description: response.data.data.description,
            fine: response.data.data.fine,
            bonus: response.data.data.bonus,
            image: response.data.data.image,
            subproducts: response.data.data.subproducts.length > 0
              ? response.data.data.subproducts
              : subproducts,
            loading: false,
            action: 'edit',
          });
          subproducts = response.data.data.subproducts.length > 0
            ? response.data.data.subproducts
            : subproducts;
        } else {
          this.setState({
            loading: false,
          });
          this.props.history.goBack();
          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  }

  addSubproduct() {
    subproducts.push({
      name: '',
      discount: 0,
      price: 0,
      bonus: 0,
      fine: 0,
      sum: 0,
      city: '',
    });

    this.setState({
      subproducts,
    });
  }

  sendData() {
    if (this.state.name !== '') {
      this.setState({
        loading: true,
      });

      const data = {
        api: 'user',
        body: {
          data: {
            section: 'shop',
            type: 'shipment',
            subtype: 'products',
            name: this.state.name,
            sub: this.state.sub,
            image: this.state.image,
            discount: this.state.discount,
            price: this.state.price,
            fine: this.state.fine,
            description: this.state.description,
            bonus: this.state.bonus,
            subproducts: this.state.subproducts,
            shop: this.props.match.params.shopId,
            action: this.state.action,
            deleted: this.state.deleted,
            id: this.props.match.params.id,
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
              name: '',
              sub: 0,
              price: 0,
              discount: 0,
              fine: 0,
              bonus: 0,
              description: '',
              image: '',
              subproducts: [{
                name: '',
                discount: '',
                price: '',
                bonus: '',
                fine: '',
                sum: '',
                city: '',
              }],
              loading: false,
            });
            subproducts = [{
              name: '',
              discount: 0,
              price: 0,
              bonus: 0,
              fine: 0,
              sum: 0,
              city: '',
            }];
            this.props.history.goBack();
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
      toast.error('Заполните название категории');
    }
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox' ? 'checked' : 'value'];
    const { name } = e.target;

    if (name.slice(0, 10) === 'subproduct') {
      subproducts[e.target.id][name.slice(10).toLowerCase()] = value;
      this.setState({
        subproducts,
      });
    }

    this.setState({
      [name]: value,
    });
  }

  deleteSubproduct(id) {
    if (this.state.action === 'edit') {
      deleted.push(this.state.subproducts[id].id);
      this.setState({
        deleted,
      });
    }
    subproducts.splice(id, 1);
    this.setState({
      subproducts,
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-12">
          <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <h4 className="font-m">
                {getLocales('Добавление товара')}
              </h4>
              {this.state.action === 'edit' && (
              <div
                className="avatar-block font-m text-center"
                style={{ margin: '0 !important' }}
              >
                <span className="text-danger">
                  {getLocales('При удалении фасовки - адреса, из данной фасовки перенесутся в раздел удаленных адресов. Будьте осторожны с изменением.')}
                </span>
              </div>
              )}

              <div className="row">
                <div className="col-lg-12 margin-15">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Название')}
                        </label>
                        <input
                          disabled={this.state.loading}
                          value={this.state.name}
                          onChange={this.handleChange}
                          autoComplete="off"
                          type="text"
                          placeholder={getLocales('Введите название товара')}
                          name="name"
                          className="form-control"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Изображение')}
                        </label>
                        <input
                          disabled={this.state.loading}
                          value={this.state.image}
                          onChange={this.handleChange}
                          autoComplete="off"
                          type="text"
                          placeholder={getLocales('Вставьте ссылку на изображение')}
                          name="image"
                          className="form-control"
                        />
                        <small>
                          {getLocales('Для загрузки изображений рекомендуем воспользоваться нашим фотохостингом')}
                          {' '}
                          <a target="_blank" href="https://umb.photos" rel="noreferrer">umb.photos</a>
                        </small>
                      </div>

                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Фасовка')}
                        </label>
                        <select
                          disabled={this.state.loading}
                          value={this.state.sub}
                          onChange={this.handleChange}
                          name="sub"
                          className="form-control"
                        >
                          <option value="0">{getLocales('Отсутствует')}</option>
                          <option value="1">{getLocales('Присутствует')}</option>
                        </select>
                      </div>
                      {this.state.sub === 0
                        ? (
                          <div className="form-group">
                            <label className="form-control-label font-m">
                              {getLocales('Цена')}
                            </label>
                            <div className="input-group">
                              <input
                                disabled={this.state.loading}
                                value={this.state.price}
                                onChange={this.handleChange}
                                autoComplete="off"
                                type="number"
                                placeholder={getLocales('Введите цену товара')}
                                name="price"
                                className="form-control"
                              />
                              <span className="input-group-text">{this.props.currency}</span>
                            </div>
                          </div>
                        )
                        : ''}
                    </div>

                    <div className="col-lg-6">
                      {this.state.sub === 1
                        ? (
                          <div className="form-group">
                            <label className="form-control-label font-m">
                              {getLocales('Описание товара')}
                            </label>
                            <div className="input-group">
                              <textarea
                                disabled={this.state.loading}
                                value={this.state.description}
                                onChange={this.handleChange}
                                autoComplete="off"
                                type="text"
                                placeholder={getLocales('Введите описание товара, доступно использование тегов HTML')}
                                name="description"
                                className="form-control"
                              />
                            </div>
                          </div>
                        )
                        : (
                          <>
                            <div className="form-group">
                              <label className="form-control-label font-m">
                                {getLocales('Скидка')}
                              </label>
                              <div className="input-group">
                                <input
                                  disabled={this.state.loading}
                                  value={this.state.discount}
                                  onChange={this.handleChange}
                                  autoComplete="off"
                                  type="number"
                                  placeholder={getLocales('Введите скидку товара')}
                                  name="discount"
                                  className="form-control"
                                />
                                <span className="input-group-text">%</span>
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-control-label font-m">
                                {getLocales('Плата за добавление адреса')}
                              </label>
                              <div className="input-group">
                                <input
                                  disabled={this.state.loading}
                                  value={this.state.bonus}
                                  onChange={this.handleChange}
                                  autoComplete="off"
                                  type="number"
                                  placeholder={getLocales('Введите сумму')}
                                  name="bonus"
                                  className="form-control"
                                />
                                <span className="input-group-text">{this.props.currency}</span>
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-control-label font-m">
                                {getLocales('Штраф за ненаход')}
                              </label>
                              <div className="input-group">
                                <input
                                  disabled={this.state.loading}
                                  value={this.state.fine}
                                  onChange={this.handleChange}
                                  autoComplete="off"
                                  type="number"
                                  placeholder={getLocales('Введите сумму')}
                                  name="fine"
                                  className="form-control"
                                />
                                <span className="input-group-text">{this.props.currency}</span>
                              </div>
                            </div>
                          </>
                        )}
                    </div>

                    {this.state.sub === 0
                      ? ''
                      : (
                        <div className="col-lg-12">
                          <div className="avatar-block">
                            <div className="row">
                              {this.state.subproducts.map((item, key) => (
                                <div className="col-lg-3">
                                  <div className="avatar-block">
                                    <div className="form-group">
                                      <label className="form-control-label font-m">
                                        {getLocales('Название')}
                                      </label>
                                      <input
                                        disabled={this.state.loading}
                                        value={item.name}
                                        id={key}
                                        onChange={this.handleChange}
                                        autoComplete="off"
                                        type="text"
                                        placeholder={getLocales('Введите название фасовки')}
                                        name="subproductName"
                                        className="form-control"
                                      />
                                    </div>

                                    <div className="form-group">
                                      <label className="form-control-label font-m">
                                        {getLocales('Цена')}
                                      </label>
                                      <div className="input-group">
                                        <input
                                          disabled={this.state.loading}
                                          value={item.price}
                                          id={key}
                                          onChange={this.handleChange}
                                          autoComplete="off"
                                          type="number"
                                          placeholder={getLocales('Введите цену подтовара')}
                                          name="subproductPrice"
                                          className="form-control"
                                        />
                                        <span className="input-group-text">{this.props.currency}</span>
                                      </div>
                                    </div>

                                    <div className="form-group">
                                      <label className="form-control-label font-m">
                                        {getLocales('Скидка')}
                                      </label>
                                      <div className="input-group">
                                        <input
                                          disabled={this.state.loading}
                                          value={item.discount}
                                          id={key}
                                          onChange={this.handleChange}
                                          autoComplete="off"
                                          type="number"
                                          placeholder={getLocales('Введите процент скидки')}
                                          name="subproductDiscount"
                                          className="form-control"
                                        />
                                        <span className="input-group-text">%</span>
                                      </div>
                                    </div>

                                    <div className="form-group">
                                      <label className="form-control-label font-m">
                                        {getLocales('Плата за добавление адреса')}
                                      </label>
                                      <div className="input-group">
                                        <input
                                          disabled={this.state.loading}
                                          value={item.bonus}
                                          id={key}
                                          onChange={this.handleChange}
                                          autoComplete="off"
                                          type="number"
                                          placeholder={getLocales('Введите сумму')}
                                          name="subproductBonus"
                                          className="form-control"
                                        />
                                        <span className="input-group-text">{this.props.currency}</span>
                                      </div>
                                    </div>

                                    <div className="form-group">
                                      <label className="form-control-label font-m">
                                        {getLocales('Штраф за ненаход')}
                                      </label>
                                      <div className="input-group">
                                        <input
                                          disabled={this.state.loading}
                                          value={item.fine}
                                          id={key}
                                          onChange={this.handleChange}
                                          autoComplete="off"
                                          type="fine"
                                          placeholder={getLocales('Введите сумму')}
                                          name="subproductFine"
                                          className="form-control"
                                        />
                                        <span className="input-group-text">{this.props.currency}</span>
                                      </div>
                                    </div>

                                    <div className="form-group">
                                      <label className="form-control-label font-m">
                                        {getLocales('Себестоимость')}
                                      </label>
                                      <div className="input-group">
                                        <input
                                          disabled={this.state.loading}
                                          value={item.sum}
                                          id={key}
                                          onChange={this.handleChange}
                                          autoComplete="off"
                                          type="sum"
                                          placeholder={getLocales('Введите себестоимость')}
                                          name="subproductSum"
                                          className="form-control"
                                        />
                                        <span className="input-group-text">{this.props.currency}</span>
                                      </div>
                                    </div>

                                    <div className="form-group">
                                      <label className="form-control-label font-m">
                                        {getLocales('Заметка')}
                                      </label>
                                      <input
                                        disabled={this.state.loading}
                                        value={item.city}
                                        id={key}
                                        onChange={this.handleChange}
                                        autoComplete="off"
                                        type="city"
                                        placeholder={getLocales('Введите заметку (Например: город)')}
                                        name="subproductCity"
                                        className="form-control"
                                      />
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => this.deleteSubproduct(key)}
                                      disabled={this.state.loading}
                                      className="btn btn-danger font-m auth-btn margin-15"
                                    >
                                      {this.state.loading
                                        ? <>{getLocales('Загрузка...')}</>
                                        : <>{getLocales('Удалить')}</> }

                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={this.addSubproduct}
                              style={{ marginBottom: '60px' }}
                              disabled={this.state.loading}
                              className="btn btn-secondary font-m auth-btn margin-15"
                            >
                              {this.state.loading
                                ? <>{getLocales('Загрузка...')}</>
                                : <>{getLocales('Добавить')}</> }

                            </button>
                          </div>
                        </div>
                      )}

                    {this.state.sub === 0
                      ? (
                        <div className="col-lg-12">
                          <div className="form-group">
                            <label className="form-control-label font-m">
                              {getLocales('Описание товара')}
                            </label>
                            <div className="input-group">
                              <textarea
                                disabled={this.state.loading}
                                value={this.state.description}
                                onChange={this.handleChange}
                                autoComplete="off"
                                type="text"
                                placeholder={getLocales('Введите описание товара, доступно использование тегов HTML')}
                                name="description"
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div>
                      )
                      : ''}

                  </div>
                  <div className="row margin-15">
                    <div className="col-lg-2">
                      <button
                        type="button"
                        onClick={this.props.history.goBack}
                        disabled={this.state.loading}
                        className="btn btn-secondary auth-btn font-m left"
                      >
                        {this.state.loading
                          ? getLocales('Загрузка...')
                          : getLocales('Назад')}
                      </button>
                    </div>

                    <div className="col-lg-6" />

                    <div className="col-lg-4">
                      <button
                        type="button"
                        onClick={this.sendData}
                        disabled={this.state.loading}
                        className="btn btn-primary font-m auth-btn right"
                      >
                        {this.state.loading
                          ? <>{getLocales('Загрузка...')}</>
                          : (this.state.action === 'edit'
                            ? <>{getLocales('Сохранить')}</>
                            : <>{getLocales('Добавить товар')}</>)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductsAdd;
