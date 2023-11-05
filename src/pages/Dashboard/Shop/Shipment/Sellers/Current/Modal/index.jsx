/* eslint-disable array-callback-return */
/* eslint-disable react/no-deprecated */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import { toast } from 'react-toastify';
import { request, getLocales } from 'utils';

class SellerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      category: 0,
      subcategory: 0,
      product: 0,
      subproduct: 0,
      value: '',
      typeofklad: 0,
      id: 0,
      creationDate: null,
      user: 0,
      subproducts: [],
      subcategories: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  sendData() {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'shipment',
          subtype: 'sellers',
          shop: this.props.match.params.shopId,
          id: this.state.id,
          category: this.state.category.toString(),
          subcategory: this.state.subcategory.toString(),
          product: this.state.product.toString(),
          typeofklad: this.state.typeofklad,
          subproduct: this.state.subproduct.toString(),
          value: this.state.value,
          user: this.state.user,
          action: 'update',
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
            category: 0,
            subcategory: 0,
            product: 0,
            subproduct: 0,
            value: '',
            id: 0,
            user: 0,
            typeofklad: 0,
            loading: false,
          });
          toast.success(response.data.message);
          this.props.toggle();
          this.props.getData();
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

  componentWillReceiveProps(nextProps) {
    if (this.props.seller !== nextProps.seller) {
      this.setState({
        category: nextProps.seller.category,
        subcategory: nextProps.seller.subcategory,
        product: nextProps.seller.product,
        subproduct: nextProps.seller.subproduct,
        value: nextProps.seller.value,
        typeofklad: nextProps.seller.typeofklad,
        comment: nextProps.seller.comment,
        status: nextProps.seller.status,
        id: nextProps.seller.id,
        creationDate: nextProps.seller.creationDate,
        user: nextProps.seller.user,
      }, () => {
        this.props.categories.map((item) => {
          if (String(item.id) === String(this.state.category)) {
            if (String(item.sub) === '1') {
              this.setState({
                subcategories: item.subcategories,
              });
            } else {
              this.setState({
                subcategories: [],
                subcategory: 0,
              });
            }
          }
        });

        this.props.products.map((item) => {
          if (String(item.id) === String(this.state.product)) {
            if (String(item.sub) === '1') {
              this.setState({
                subproducts: item.subproducts,
              });
            } else {
              this.setState({
                subproducts: [],
                subproduct: 0,
              });
            }
          }
        });
      });
    }
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox'
      ? 'checked'
      : 'value'];

    const { name } = e.target;

    if (name === 'category') {
      this.props.categories.map((item) => {
        if (String(item.id) === String(value)) {
          if (String(item.sub) === '1') {
            this.setState({
              subcategories: item.subcategories,
              subcategory: 0,
            });
          } else {
            this.setState({
              subcategories: [],
              subcategory: 0,
            });
          }
          this.setState({
            [name]: value,
          });
        }
      });
    } else if (name === 'product') {
      this.props.products.map((item) => {
        if (String(item.id) === String(value)) {
          if (String(item.sub) === '1') {
            this.setState({
              subproducts: item.subproducts,
              subproduct: 0,
            });
          } else {
            this.setState({
              subproducts: [],
              subproduct: 0,
            });
          }

          this.setState({
            [name]: value,
          });
        }
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
  }

  render() {
    return (
      <Modal
        size="lg"
        isOpen={this.props.modal}
        toggle={this.props.toggle}
      >
        <div className="modal-header text-center">
          <h4 className="modal-title font-m">
            {getLocales('Адрес')}
            {' '}
            #
            {this.state.id}
          </h4>
        </div>

        <ModalBody>
          <div className="row">
            <div className="col-lg-12">
              {String(this.state.status) === '0'
                ? (
                  <div
                    className="avatar-block font-m no-margin"
                    style={{ margin: '0 !important' }}
                  >
                    <span className="text-danger">
                      {getLocales('Данный адрес находится в резервации возможно изменение только содержания товара.')}
                    </span>
                  </div>
                )
                : ''}
            </div>

            <div className="col-lg-6">
              <div className={`form-group ${String(this.state.status) === '0' ? 'margin-15' : ''}`}>
                <label className="form-control-label font-m">{getLocales('Город')}</label>
                <select
                  disabled={this.state.loading || String(this.state.status) === '2'}
                  value={this.state.category}
                  onChange={this.handleChange}
                  name="category"
                  className="form-control"
                >
                  <option disabled value="0">{getLocales('Не выбран')}</option>
                  {this.props.categories.map((item) => (
                    <option value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {this.state.subcategories.length > 0
                ? (
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Район')}
                    </label>
                    <select
                      disabled={this.state.loading || String(this.state.status) === '2'}
                      value={this.state.subcategory}
                      onChange={this.handleChange}
                      name="subcategory"
                      className="form-control"
                    >
                      <option disabled value="0">{getLocales('Не выбран')}</option>
                      {this.state.subcategories.map((item) => (
                        <option value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )
                : ''}

              {this.props.canView
                ? (
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Создатель адреса')}
                    </label>
                    <select
                      disabled={this.state.loading}
                      value={this.state.user}
                      onChange={this.handleChange}
                      name="user"
                      className="form-control"
                    >
                      <option disabled value="0">{getLocales('Не выбран')}</option>
                      {this.props.employees.map((item) => (
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

              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Дата создания')}
                </label>
                <input
                  disabled
                  value={this.state.creationDate
                    ? moment.unix(this.state.creationDate / 1000).format('LLL')
                    : getLocales('Нет информации')}
                  name="creationDate"
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Товар')}
                </label>
                <select
                  disabled={this.state.loading || String(this.state.status) === '2'}
                  value={this.state.product}
                  onChange={this.handleChange}
                  name="product"
                  className="form-control"
                >
                  <option disabled value="0">{getLocales('Не выбран')}</option>
                  {this.props.products.map((item) => (
                    <option value={item.id}>
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
                      disabled={this.state.loading || String(this.state.status) === '2'}
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

              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Тип клада')}
                </label>
                <select
                  disabled={this.state.loading}
                  value={this.state.typeofklad}
                  onChange={this.handleChange}
                  name="typeofklad"
                  className="form-control"
                >
                  {this.props.typeOfKlads.map((item) => (
                    <option value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>
            <div className="col-lg-12">
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Адрес')}
                </label>
                <textarea
                  placeholder={getLocales('Введите содержание')}
                  disabled={this.state.loading}
                  value={this.state.value}
                  onChange={this.handleChange}
                  name="value"
                  className="form-control sellers-textarea"
                />
              </div>
              {!this.props.admin
                ? (
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Комментарий для доработки')}
                    </label>
                    <textarea
                      placeholder={getLocales('Введите содержание')}
                      disabled
                      value={this.state.comment}
                      onChange={this.handleChange}
                      name="value"
                      className="form-control sellers-textarea"
                    />
                  </div>
                )
                : ''}
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-4">
                <div className="mr-auto">
                  <button
                    type="button"
                    value="Закрыть"
                    className="btn btn-secondary font-m auth-btn"
                    onClick={this.props.toggle}
                  >
                    {getLocales('Закрыть')}
                  </button>
                </div>
              </div>

              <div className="col-lg-8">
                <button
                  type="button"
                  disabled={this.state.loading}
                  onClick={this.sendData}
                  className="btn btn-primary font-m auth-btn"
                >
                  {this.state.loading
                    ? getLocales('Загрузка...')
                    : getLocales('Сохранить')}
                </button>
              </div>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default SellerModal;
