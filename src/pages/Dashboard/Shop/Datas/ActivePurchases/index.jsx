/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { Table } from 'components';
import { request, getLocales } from 'utils';

let interval;

// TODO
class ActivePurchases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        purchases: [],
        categories: [],
        subcategories: [],
        products: [],
        subproducts: [],
        currency: '',
      },
      items: [],
    };
    this.getData = this.getData.bind(this);
    this.prepareTableData = this.prepareTableData.bind(this);
    this.updateItems = this.updateItems.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    this.getData();
    interval = setInterval(this.getData, 5000);
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  prepareTableData() {
    const items = [];

    const data = {};

    this.state.data.purchases.reverse().map((item) => {
      this.state.data.categories.map((category) => {
        if (item.category === category.id) {
          data.category = category.name;
          if (category.sub === 1) {
            this.state.data.subcategories.map((subcategory) => {
              if (subcategory.id === item.subcategory) {
                data.category += ` / ${subcategory.name}`;
              }
            });
          }
        }
      });
      this.state.data.products.map((product) => {
        if (item.product === product.id) {
          data.product = product.name;
          if (product.sub === 1) {
            this.state.data.subproducts.map((subproduct) => {
              if (subproduct.id === item.subproduct) {
                data.product += ` / ${subproduct.name}`;
              }
            });
          }
        }
      });
      const itemModified = {
        id: item.id,
        category: data.category,
        product: data.product,
        user: item.user,
        userName: item.login,
        sum: `${item.sum} ${this.state.data.currency}`,
        type: item.type,
        date: moment.unix(item.created / 1000).format('LLL'),
      };
      items.push(itemModified);
    });

    this.setState({
      items,
    });
  }

  updateItems(items) {
    this.setState({
      items,
    });
  }

  sendMessage(id) {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'datas',
          subtype: 'presellers',
          shop: this.props.match.params.shopId,
          action: 'sendMessage',
          id,
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
          this.props.history.push(`/dashboard/shops/${this.props.match.params.shopId}/feedback/chats/${response.data.data.id}`);
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
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'datas',
          subtype: 'activePurchases',
          shop: this.props.match.params.shopId,
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
        title: getLocales('Город / Район'), dataIndex: 'category', key: 'category', sort: true,
      },
      {
        title: getLocales('Товар / Фасовка'), dataIndex: 'product', key: 'product', sort: true,
      },
      {
        title: getLocales('Сумма'), dataIndex: 'sum', key: 'sum', sort: true,
      },
      {
        title: getLocales('Способ оплаты'), dataIndex: 'type', key: 'type', sort: true,
      },
      {
        title: getLocales('Пользователь'),
        dataIndex: '',
        key: 'operations',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        render: (e, item) => (item.user === 0
          ? 'Anonym'
          : (
            <div className="sparkline8">
              <NavLink to={`/dashboard/shops/${this.props.match.params.shopId}/datas/users/${item.user}`}>
                {item.userName}
              </NavLink>
            </div>
          )),
      },
      {
        title: '',
        dataIndex: '',
        key: 'operations',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        render: () => (
          <div className="sparkline8">
            <span className="text-warning">
              {getLocales('Ожидает оплаты')}
            </span>
          </div>
        ),
      },
    ];

    return (
      <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
        <div className="block-body">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="font-m">
                {
              getLocales('Активные заказы')
}
              </h3>

              {this.state.data.purchases <= 0
                ? (
                  <div className="text-center font-m">
                    {getLocales('Активные заказы отсутствуют')}
                  </div>
                )
                : (
                  <Table
                    search={false}
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

    );
  }
}

export default ActivePurchases;
