/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable array-callback-return */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus, faBackspace } from '@fortawesome/free-solid-svg-icons';
import { Table, ModalConfirm } from 'components';
import { getLocales, request } from 'utils';
import SellerModalModer from './Modal';

let sellers = [''];

class ModerSellers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      method: 'one',
      category: '0',
      product: '0',
      subcategory: '0',
      subproduct: '0',
      data: {
        categories: [],
        products: [],
        sellers: [],
        canView: false,
        employees: [],
        typeOfKlads: [],
      },
      sellers: [''],
      seller: '',
      items: [],
      confirmModal: false,
      deleteSeller: 0,
      editModal: false,
      editSeller: {},
      categorySort: 'all',
      productSort: 'all',
      sorted: [],
    };
    this.getData = this.getData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addSeller = this.addSeller.bind(this);
    this.deleteSeller = this.deleteSeller.bind(this);
    this.createSeller = this.createSeller.bind(this);
    this.confirmToggle = this.confirmToggle.bind(this);
    this.sellerDelete = this.sellerDelete.bind(this);
    this.editToggle = this.editToggle.bind(this);
    this.sort = this.sort.bind(this);
  }

  editToggle(id) {
    if (+id === 0) {
      this.setState({
        editModal: !this.state.editModal,
      });
    } else {
      this.state.data.sellers.map((item) => {
        if (String(item.id) === String(id)) {
          this.setState({
            editSeller: item,
          });
        }
      });

      this.setState({
        editModal: !this.state.editModal,
      });
    }
  }

  confirmToggle(id) {
    this.setState({
      confirmModal: !this.state.confirmModal,
      deleteSeller: id,
    });
  }

  updateItems(items) {
    this.setState({
      items,
    });
  }

  prepareTableData() {
    const items = [];

    const data = {};

    this.state.sorted.map((item) => {
      this.state.data.categories.map((category) => {
        if (String(item.category) === String(category.id)) {
          data.category = category.name;

          if (String(category.sub) === '1') {
            category.subcategories.map((subcategory) => {
              if (String(subcategory.id) === String(item.subcategory)) {
                data.category += ` / ${subcategory.name}`;
              }
            });
          }
        }
      });

      this.state.data.products.map((product) => {
        if (String(item.product) === String(product.id)) {
          data.product = product.name;

          if (String(product.sub) === '1') {
            product.subproducts.map((subproduct) => {
              if (String(subproduct.id) === String(item.subproduct)) {
                data.product += ` / ${subproduct.name}${subproduct.city ? (` (${subproduct.city})`) : ''}`;
              }
            });
          }
        }
      });

      const itemModified = {
        id: item.id,
        category: data.category,
        product: data.product,
        status: item.status,
      };

      this.state.data.employees.map((employer) => {
        if (String(employer.systemId) === String(item.user)) {
          itemModified.user = employer.login + (employer.notice ? (` (${employer.notice})`) : '');
        }
      });

      this.state.data.typeOfKlads.map((types) => {
        if (String(types.id) === String(item.typeofklad)) {
          itemModified.type = getLocales(types.name);
        }
      });

      items.push(itemModified);
    });

    this.setState({
      items,
    });
  }

  addSeller() {
    sellers.push('');

    this.setState({
      sellers,
    }, () => {
      window.scrollTo(0, document.body.scrollHeight);
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
          type: 'shipment',
          subtype: 'sellers',
          shop: this.props.match.params.shopId,
          action: 'getModer',
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
            sorted: response.data.data.sellers,
            loading: false,
          });
          this.prepareTableData();
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

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox' ? 'checked' : 'value'];
    const { name } = e.target;

    if (name === 'category') {
      this.state.data.categories.map((item) => {
        if (String(item.id) === String(value)) {
          if (String(item.sub) === '1') {
            this.setState({
              subcategory: '0',
            });
          } else {
            this.setState({
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
              subproduct: '0',
            });
          } else {
            this.setState({
              subproduct: '0',
            });
          }

          this.setState({
            [name]: value,
          });
        }
      });
    } else if (name === 'sellers') {
      sellers[e.target.id] = value;

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

  createSeller() {
    this.setState({
      loading: true,
    });

    if (String(this.state.category) !== '0' && String(this.state.product) !== '0'
       && (this.state.sellers.length > 0 || this.state.seller.length > 0)) {
      const addresses = this.state.method === 'one'
        ? this.state.sellers
        : this.state.seller.split('\n\n');

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
            action: 'create',
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
              sellers: [''],
              loading: false,
            });
            sellers = [''];
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

  sort(e) {
    const sorted = [];
    if (e.target.name === 'categorySort') {
      this.state.data.sellers.map((item) => {
        if ((String(item.category) === String(e.target.value) || String(e.target.value) === 'all')
        && (String(this.state.productSort) === 'all' || String(this.state.productSort) === String(item.product))) {
          sorted.push(item);
        }
      });

      this.setState({
        sorted,
        categorySort: e.target.value,
      }, () => {
        this.prepareTableData();
      });
    } else {
      this.state.data.sellers.map((item) => {
        if ((String(item.product) === String(e.target.value) || String(e.target.value) === 'all')
        && (String(this.state.categorySort) === 'all' || String(this.state.categorySort) === String(item.category))) {
          sorted.push(item);
        }
      });

      this.setState({
        sorted,
        productSort: e.target.value,
      }, () => {
        this.prepareTableData();
      });
    }
  }

  sellerDelete() {
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
          id: this.state.deleteSeller,
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
          toast.success(response.data.message);
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

  render() {
    const tableColumns = [
      {
        title: 'ID', dataIndex: 'id', key: 'id', sort: true,
      },
      {
        title: getLocales('Город / Район'), dataIndex: 'category', key: 'category', sort: true,
      },
      {
        title: getLocales('Товар / Фасовка'), dataIndex: 'product', key: 'product', sort: true,
      },
      {
        title: getLocales('Тип'), dataIndex: 'type', key: 'type', sort: true,
      },
      {
        title: getLocales('Создатель'), dataIndex: 'user', key: 'user', sort: true,
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
              className={`btn  font-m auth-btn ${String(item.status) === '1'
                ? ' btn-primary'
                : (String(item.status) === '2'
                  ? ' btn-danger'
                  : ' btn-secondary')}`}
            >
              {' '}
              {String(item.status) === '1'
                ? getLocales('В продаже')
                : (String(item.status) === '2' ? getLocales('На проверке')
                  : (String(item.status) === '3' ? getLocales('На доработке')
                    : getLocales('Зарезервирован')))}
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
              onClick={() => this.editToggle(item.id)}
              className="btn btn-secondary btn-table"
            >
              <FontAwesomeIcon icon={faSearchPlus} />
            </button>

            <button
              type="button"
              disabled={String(item.status) === '0'}
              onClick={() => this.confirmToggle(item.id)}
              className="btn btn-danger btn-table"
            >
              <FontAwesomeIcon icon={faBackspace} />
            </button>
          </div>
        ),
      },
    ];

    return (
      <>
        <div className="row">
          <div className="col-lg-12">
            <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h4 className="font-m">
                  {getLocales('Адреса для модерации')}
                </h4>

                <div className="avatar-block">
                  <h4 className="font-m">
                    {getLocales('Сортировка')}
                  </h4>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Город')}
                        </label>
                        <select
                          disabled={this.state.loading}
                          value={this.state.categorySort}
                          onChange={this.sort}
                          name="categorySort"
                          className="form-control"
                        >
                          <option value="all">{getLocales('Все')}</option>
                          {this.state.data.categories.map((item) => (
                            <option value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Товар')}
                        </label>
                        <select
                          disabled={this.state.loading}
                          value={this.state.productSort}
                          onChange={this.sort}
                          name="productSort"
                          className="form-control"
                        >
                          <option value="all">{getLocales('Все')}</option>
                          {this.state.data.products.map((item) => (
                            <option value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="margin-15">
                  {this.state.items.length <= 0
                    ? (
                      <div className="text-center font-m">
                        {getLocales('Адреса отсутствуют')}
                      </div>
                    )
                    : (
                      <Table
                        columns={tableColumns}
                        items={this.state.items}
                        updateItems={this.updateItems}
                        rowsPerPage="10"
                      />
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <SellerModalModer
          typeOfKlads={this.state.data.typeOfKlads}
          employees={this.state.data.employees}
          canView={this.state.data.canView}
          {...this.props}
          getData={this.getData}
          modal={this.state.editModal}
          toggle={this.editToggle}
          seller={this.state.editSeller}
          categories={this.state.data.categories}
          products={this.state.data.products}
        />

        <ModalConfirm
          action={getLocales('Вы действительно хотите перенести данный адрес в раздел удаленных товаров?')}
          consequences=""
          modal={this.state.confirmModal}
          toggle={this.confirmToggle}
          loading={this.state.loading}
          sendData={this.sellerDelete}
        />
      </>
    );
  }
}

export default ModerSellers;
