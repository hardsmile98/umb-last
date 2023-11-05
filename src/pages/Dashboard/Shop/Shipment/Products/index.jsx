/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { NavLink, Link } from 'react-router-dom';
import { ModalConfirm } from 'components';
import { request, getLocales } from 'utils';

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        products: [],
        currency: '',
      },
      confirmModal: false,
    };
    this.getData = this.getData.bind(this);
    this.confirmToggle = this.confirmToggle.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  confirmToggle(id) {
    this.setState({
      confirmModal: !this.state.confirmModal,
      currenctProduct: id,
    });
  }

  componentDidMount() {
    this.getData();
  }

  deleteProduct() {
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
          id: this.state.currenctProduct,
          shop: this.props.match.params.shopId,
          action: 'delete',
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
          this.confirmToggle();
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

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'shipment',
          subtype: 'products',
          name: this.state.name,
          sub: this.state.sub,
          subcategories: this.state.subcategories,
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

  render() {
    return (
      <>
        <div className="row">
          <div className="col-lg-12">
            <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h4 className="font-m">
                  {getLocales('Товары')}
                </h4>

                <div className="row">
                  <div className="col-lg-12 margin-15">
                    <div className="row">
                      {this.state.data.products.length > 0
                        ? this.state.data.products.map((item) => (
                          <div className="col-lg-3">
                            <div className="avatar-block">
                              <div className="text-center">
                                <h4 className="font-m">{item.name}</h4>
                                <div className="text-left font-m">
                                  {getLocales('Фасовка')}
                                  :
                                  <span className="highlight">
                                    {String(item.sub) === '1'
                                      ? <>{getLocales('Да')}</>
                                      : <>{getLocales('Нет')}</>}
                                  </span>
                                  <br />
                                  {getLocales('Скидка')}
                                  :
                                  <span className="highlight">
                                    {item.discount}
                                    %
                                  </span>
                                  <br />
                                  {getLocales('Адресов в наличии')}
                                  :
                                  <span className="highlight">
                                    {item.sellers}
                                    {' '}
                                    {getLocales('шт.')}
                                  </span>
                                  <br />
                                  {getLocales('Продаж')}
                                  :
                                  <span className="highlight">
                                    {item.sales}
                                    {' '}
                                    {getLocales('шт.')}
                                  </span>
                                  <br />
                                  {getLocales('Сумма продаж')}
                                  :
                                  <span className="highlight">
                                    {item.salessum.toFixed(2)}
                                    {' '}
                                    {this.state.data.currency}
                                  </span>
                                  <br />
                                </div>

                                <div className="text-center">
                                  <div className="row">
                                    <div className="col-lg-8">
                                      <Link to={`${this.props.match.url}/${item.id}`}>
                                        <button
                                          type="button"
                                          disabled={this.state.loading}
                                          className="btn btn-secondary font-m auth-btn margin-15"
                                        >
                                          {this.state.loading
                                            ? getLocales('Загрузка...')
                                            : getLocales('Открыть')}

                                        </button>
                                      </Link>
                                    </div>

                                    <div className="col-lg-4">
                                      <button
                                        type="button"
                                        onClick={() => { this.confirmToggle(item.id); }}
                                        disabled={this.state.loading}
                                        className="btn btn-danger font-m auth-btn margin-15"
                                      >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                        : (
                          <div className="text-center">
                            {getLocales('Товары отсутствуют')}
                          </div>
                        )}

                      <div className="col-lg-12">
                        <NavLink to={`${this.props.match.url}/add`}>
                          <button
                            type="button"
                            disabled={this.state.loading}
                            className="btn btn-primary margin-15 font-m auth-btn right"
                          >
                            {this.state.loading
                              ? getLocales('Загрузка...')
                              : getLocales('Добавить товар')}
                          </button>
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ModalConfirm
          action={getLocales('Вы действительно хотите удалить данный товар?')}
          consequences={getLocales('Все адреса данного товара будут перенесены в раздел удаленных адресов.')}
          modal={this.state.confirmModal}
          toggle={this.confirmToggle}
          loading={this.state.loading}
          sendData={this.deleteProduct}
        />
      </>
    );
  }
}

export default Products;
