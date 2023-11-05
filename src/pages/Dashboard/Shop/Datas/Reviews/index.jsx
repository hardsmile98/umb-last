/* eslint-disable react/sort-comp */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { Table } from 'components';
import { request, getLocales } from 'utils';

// TODO
class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: {
        reviewsAc: [],
        reviewsDe: [],
        users: [],
      },
      items1: [],
      items2: [],
    };
    this.getData = this.getData.bind(this);
    this.sendData = this.sendData.bind(this);
    this.getUserLogin = this.getUserLogin.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getUserLogin(id) {
    this.state.data.users.map((user) => {
      if (user.id === id) {
        return user.name;
      }
    });
  }

  prepareTableData() {
    const items1 = [];
    const items2 = [];
    let name;

    this.state.data.reviewsAc.map((item) => {
      this.state.data.users.map((user) => {
        if (user.id === item.user) {
          name = user.name;
        }
      });
      const itemModified = {
        loc: `${item.category} / ${item.product}`,
        message: JSON.parse(item.review).text,
        status: JSON.parse(item.review).status,
        user: item.user,
        userName: name,
        id: item.id,
      };
      items1.push(itemModified);
    });

    this.state.data.reviewsDe.map((item) => {
      this.state.data.users.map((user) => {
        if (user.id === item.user) {
          name = user.name;
        }
      });
      const itemModified = {
        loc: `${item.category} / ${item.product}`,
        message: JSON.parse(item.review).text,
        status: JSON.parse(item.review).status,
        user: item.user,
        userName: name,
        id: item.id,
      };
      items2.push(itemModified);
    });

    this.setState({
      items1,
      items2,
    });
  }

  sendData(id) {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'datas',
          subtype: 'reviews',
          shop: this.props.match.params.shopId,
          action: 'set',
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
          toast.success(response.data.message);
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
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'datas',
          subtype: 'reviews',
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
        title: getLocales('Город / Товар'), dataIndex: 'loc', key: 'loc', sort: true,
      },
      {
        title: getLocales('Отзыв'), dataIndex: 'message', key: 'message', sort: true,
      },
      {
        title: getLocales('Пользователь'),
        dataIndex: 'user',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        key: 'operations',
        render: (e, item) => (
          <NavLink
            to={`/dashboard/shops/${this.props.match.params.shopId}/datas/users/${item.user}`}
          >
            {item.userName}
          </NavLink>
        ),
      },
      {
        title: getLocales('Действие'),
        dataIndex: 'name',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        key: 'operations',
        render: (e, item) => (
          <button
            type="button"
            onClick={() => this.sendData(item.id)}
            className={`btn font-m ${item.status === 0 ? 'btn-secondary' : 'btn-danger'}`}
          >
            {item.status === 0
              ? getLocales('Одобрить')
              : getLocales('Скрыть')}
          </button>
        ),
      },
    ];

    return (
      <>
        <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <h3 className="font-m">
              {getLocales('Отображаемые отзывы')}
            </h3>

            {this.state.data.reviewsAc.length > 0
              ? (
                <Table
                  columns={tableColumns}
                  items={this.state.items1}
                  updateItems={this.updateItems}
                  rowsPerPage="10"
                />
              )
              : (
                <div className="text-center font-m">
                  {getLocales('Отзывы отсутствуют')}
                </div>
              )}
          </div>
        </div>

        <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <h3 className="font-m">
              {getLocales('Отзывы для модерации')}
            </h3>

            {this.state.data.reviewsDe.length > 0
              ? (
                <Table
                  columns={tableColumns}
                  items={this.state.items2}
                  updateItems={this.updateItems}
                  rowsPerPage="10"
                />
              )
              : (
                <div className="text-center font-m">
                  {getLocales('Отзывы отсутствуют')}
                </div>
              )}
          </div>
        </div>
      </>
    );
  }
}

export default Reviews;
