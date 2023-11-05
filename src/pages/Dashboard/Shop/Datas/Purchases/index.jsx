/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { Table } from 'components';
import { request, getLocales } from 'utils';

class Purchases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        purchases: [],
        currency: 'EE',
        users: [],
      },
      items: [],
      sorted: [],
      categorySort: 'all',
      productSort: 'all',
      typeSort: 'all',
      dateFrom: '',
      dateTo: '',
      categories: [],
      products: [],
      types: [],
    };
    this.getData = this.getData.bind(this);
    this.prepareTableData = this.prepareTableData.bind(this);
    this.updateItems = this.updateItems.bind(this);
    this.sort = this.sort.bind(this);
  }

  getCAndP() {
    const categories = [];
    const products = [];
    const types = [];

    if (this.state.data.purchases.length > 0) {
      this.state.data.purchases.map((item) => {
        if (categories.indexOf(item.category) === -1) {
          categories.push(item.category);
        }
        if (products.indexOf(item.product) === -1) {
          products.push(item.product);
        }
        if (types.indexOf(item.type) === -1) {
          types.push(item.type);
        }
      });

      this.setState({
        categories,
        products,
        types,
      });
    }
  }

  sort(e) {
    const sorted = [];

    if (e.target.name === 'categorySort') {
      this.state.data.purchases.map((item) => {
        if ((+item.closed <= +this.state.dateTo || String(this.state.dateTo) === '')
            && (+item.closed >= +new Date(this.state.dateFrom) || String(this.state.dateFrom) === '')
            && (String(item.category) === String(e.target.value) || String(e.target.value) === 'all')
            && (String(this.state.productSort) === 'all' || String(this.state.productSort) === String(item.product))
            && (String(this.state.typeSort) === 'all' || String(this.state.typeSort) === String(item.type))) {
          sorted.push(item);
        }
      });
      this.setState({
        sorted,
        categorySort: e.target.value,
      }, () => {
        this.prepareTableData();
      });
    } else if (e.target.name === 'dateFrom') {
      this.state.data.purchases.map((item) => {
        if ((+item.closed >= +new Date(e.target.value) || String(e.target.value) === '')
            && (+item.closed <= +new Date(this.state.dateTo) || String(this.state.dateTo) === '')
            && (String(item.category) === String(this.state.categorySort) || String(this.state.categorySort) === 'all')
            && (String(this.state.productSort) === 'all' || String(this.state.productSort) === String(item.product))
            && (String(this.state.typeSort) === 'all' || String(this.state.typeSort) === String(item.type))) {
          sorted.push(item);
        }
      });
      this.setState({
        sorted,
        dateFrom: e.target.value,
      }, () => {
        this.prepareTableData();
      });
    } else if (e.target.name === 'dateTo') {
      this.state.data.purchases.map((item) => {
        if ((+item.closed <= +new Date(e.target.value) || String(e.target.value) === '')
        && (+item.closed >= +new Date(this.state.dateFrom) || String(this.state.dateFrom) === '')
        && (String(item.category) === String(this.state.categorySort) || String(this.state.categorySort) === 'all')
        && (String(this.state.productSort) === 'all' || String(this.state.productSort) === String(item.product))
        && (String(this.state.typeSort) === 'all' || String(this.state.typeSort) === String(item.type))) {
          sorted.push(item);
        }
      });
      this.setState({
        sorted,
        dateTo: e.target.value,
      }, () => {
        this.prepareTableData();
      });
    } else if (e.target.name === 'typeSort') {
      this.state.data.purchases.map((item) => {
        if ((+item.closed <= +this.state.dateTo || String(this.state.dateTo) === '')
        && (+item.closed >= +new Date(this.state.dateFrom) || String(this.state.dateFrom) === '')
        && (String(item.category) === String(this.state.categorySort) || String(this.state.categorySort) === 'all')
        && (String(this.state.productSort) === 'all' || String(this.state.productSort) === String(item.product))
        && (String(e.target.value) === 'all' || String(e.target.value) === String(item.type))) {
          sorted.push(item);
        }
      });

      this.setState({
        sorted,
        typeSort: e.target.value,
      }, () => {
        this.prepareTableData();
      });
    } else {
      this.state.data.purchases.map((item) => {
        if ((+item.closed <= +this.state.dateTo || String(this.state.dateTo) === '')
        && (+item.closed >= +new Date(this.state.dateFrom) || String(this.state.dateFrom) === '')
        && (String(item.product) === String(e.target.value) || String(e.target.value) === 'all')
        && (String(this.state.categorySort) === 'all' || String(this.state.categorySort) === String(item.category))
        && (String(this.state.typeSort) === 'all' || String(this.state.typeSort) === String(item.type))) {
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

  componentDidMount() {
    this.getData();
  }

  prepareTableData() {
    const items = [];

    this.state.sorted.map((item) => {
      let itemModified;
      if (String(item.user) === '0') {
        itemModified = {
          id: item.id,
          category: item.category,
          subcategory: item.subcategory ? item.subcategory : '-',
          product: item.product,
          subproduct: item.subproduct ? item.subproduct : '-',
          sum: `${item.sum} ${this.state.data.currency}`,
          date: moment.unix(item.closed / 1000).format('LLL'),
          status: item.status,
          login: 'Anonym',
          user: 0,
          type: item.type,
          notfound: item.notfound,
        };
      } else {
        this.state.data.users.map((user) => {
          if (String(item.user) === String(user.id)) {
            itemModified = {
              id: item.id,
              category: item.category,
              subcategory: item.subcategory ? item.subcategory : '-',
              product: item.product,
              subproduct: item.subproduct ? item.subproduct : '-',
              sum: `${item.sum} ${this.state.data.currency}`,
              date: moment.unix(item.closed / 1000).format('LLL'),
              status: item.status,
              login: user.name,
              user: item.user,
              type: item.type,
              notfound: item.notfound,
            };
          }
        });
        if (!itemModified) {
          itemModified = {
            id: item.id,
            category: item.category,
            subcategory: item.subcategory ? item.subcategory : '-',
            product: item.product,
            subproduct: item.subproduct ? item.subproduct : '-',
            sum: `${item.sum} ${this.state.data.currency}`,
            date: moment.unix(item.closed / 1000).format('LLL'),
            status: item.status,
            login: 'Anonym',
            user: 0,
            type: item.type,
            notfound: item.notfound,
          };
        }
      }
      items.push(itemModified);
    });

    this.setState({
      items,
    }, () => {
      this.getCAndP();
    });
  }

  updateItems(items) {
    this.setState({
      items,
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
          section: 'shop',
          type: 'datas',
          subtype: 'purchases',
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
            sorted: response.data.data.purchases,
            loading: false,
          }, () => {
            this.prepareTableData();
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
    const tableColumns = [
      {
        title: 'ID', dataIndex: 'id', key: 'id', sort: true,
      },
      {
        title: getLocales('Город'), dataIndex: 'category', key: 'category', sort: true,
      },
      {
        title: getLocales('Район'), dataIndex: 'subcategory', key: 'subcategory', sort: true,
      },
      {
        title: getLocales('Товар'), dataIndex: 'product', key: 'product', sort: true,
      },
      {
        title: getLocales('Фасовка'), dataIndex: 'subproduct', key: 'subproduct', sort: true,
      },
      {
        title: getLocales('Сумма'), dataIndex: 'sum', key: 'sum', sort: true,
      },
      {
        title: getLocales('Покупатель'),
        dataIndex: 'user',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        key: 'operations',
        render: (e, item) => (String(item.user) === '0'
          ? 'Anonym'
          : (
            <NavLink to={`/dashboard/shops/${this.props.match.params.shopId}/datas/users/${item.user}`}>
              {item.login}
            </NavLink>

          )),
      },
      {
        title: getLocales('Способ оплаты'), dataIndex: 'type', key: 'type', sort: true,
      },
      {
        title: getLocales('Дата'), dataIndex: 'date', key: 'date', sort: true,
      },
      {
        title: getLocales('Теги'),
        dataIndex: 'tags',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        key: 'operations',
        render: (e, item) => (String(item.notfound) === '1'
          ? (
            <span
              title={getLocales('Ненаход')}
              className="text-danger"
            >
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </span>
          )
          : ''),
      },
      {
        title: getLocales('Действие'),
        dataIndex: 'name',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        key: 'operations',
        render: (e, item) => (
          <NavLink
            to={`/dashboard/shops/${this.props.match.params.shopId}/datas/purchases/${item.id}`}
          >
            <button type="button" className="btn btn-secondary font-m">
              {getLocales('Подробнее')}
            </button>
          </NavLink>
        ),
      },
    ];

    return (
      <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
        <div className="block-body">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="font-m">
                {getLocales('Покупки')}
              </h3>

              {this.state.data.purchases <= 0
                ? (
                  <div className="text-center font-m">
                    {getLocales('Покупки отсутствуют')}
                  </div>
                )
                : (
                  <>
                    <div className="avatar-block">
                      <h4 className="font-m">
                        {getLocales('Сортировка')}
                      </h4>

                      <div className="row">
                        <div className="col-lg-4">
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
                              {this.state.categories.map((item) => (
                                <option value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-lg-4">
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
                              {this.state.products.map((item) => (
                                <option
                                  value={item}
                                >
                                  {item}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="form-group">
                            <label className="form-control-label font-m">
                              {getLocales('Способ оплаты')}
                            </label>
                            <select
                              disabled={this.state.loading}
                              value={this.state.typeSort}
                              onChange={this.sort}
                              name="typeSort"
                              className="form-control"
                            >
                              <option value="all">{getLocales('Все')}</option>
                              {this.state.types.map((item) => (
                                <option
                                  value={item}
                                >
                                  {item}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="form-group">
                            <label className="form-control-label font-m">
                              {getLocales('Дата от')}
                            </label>
                            <input
                              type="date"
                              disabled={this.state.loading}
                              value={this.state.dateFrom}
                              onChange={this.sort}
                              name="dateFrom"
                              className="form-control"
                            />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="form-group">
                            <label className="form-control-label font-m">
                              {getLocales('Дата до')}
                            </label>
                            <input
                              type="date"
                              disabled={this.state.loading}
                              value={this.state.dateTo}
                              onChange={this.sort}
                              name="dateTo"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {this.state.items.length > 0
                      ? (
                        <Table
                          columns={tableColumns}
                          items={this.state.items}
                          updateItems={this.updateItems}
                          rowsPerPage="10"
                        />
                      )
                      : (
                        <div className="font-m text-center">
                          {getLocales('Покупки отсутствуют')}
                        </div>
                      )}
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Purchases;
