/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { Table } from 'components';
import { request, getLocales } from 'utils';

class DataUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        users: [],
        currency: '',
      },
      items: [],
      sortPlatform: 'all',
      sorted: [],
    };
    this.getData = this.getData.bind(this);
    this.prepareTableData = this.prepareTableData.bind(this);
    this.updateItems = this.updateItems.bind(this);
    this.sort = this.sort.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  sort(e) {
    this.setState({
      [e.target.name]: e.target.value,
    }, () => {
      const result = [];
      this.state.data.users.map((item) => {
        if (this.state.sortPlatform === 'site') {
          if (+item.chatid === 0) {
            result.push(item);
          }
        } else if (this.state.sortPlatform === 'telegram') {
          if (+item.chatid > 0) {
            result.push(item);
          }
        } else {
          result.push(item);
        }
      });
      this.setState({
        sorted: result,
      }, () => {
        this.prepareTableData();
      });
    });
  }

  prepareTableData() {
    const items = [];

    this.state.sorted.map((item) => {
      const itemModified = {
        id: item.id,
        name: item.name,
        purchases: item.purchases,
        purchasesSum: item.purchasesSum,
        balance: `${item.balance} ${this.state.data.currency}`,
        platform: +item.chatid === 0
          ? getLocales('Сайт')
          : 'Telegram',
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
          subtype: 'users',
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
            this.sort({ target: { name: 'sortPlatform', value: 'all' } });
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
        title: getLocales('Имя'),
        dataIndex: 'name',
        key: 'operations',
        render: (e, item) => (
          <NavLink
            to={`/dashboard/shops/${this.props.match.params.shopId}/datas/users/${item.id}`}
          >
            {item.name}
          </NavLink>
        ),
      },
      {
        title: getLocales('Платформа'), dataIndex: 'platform', key: 'platform', sort: true,
      },
      {
        title: getLocales('Баланс'), dataIndex: 'balance', key: 'balance', sort: true,
      },
      {
        title: getLocales('Кол-во покупок'), dataIndex: 'purchases', key: 'purchases', sort: true,
      },
      {
        title: getLocales('Сумма покупок'),
        dataIndex: 'purchasesSum',
        sort: true,
        key: 'operations',
        render: (e, item) => (
          <span>
            {item.purchasesSum}
            {' '}
            {this.state.data.currency}
          </span>
        ),
      },
      {
        title: getLocales('Действие'),
        dataIndex: 'name',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        key: 'operations',
        render: (e, item) => (
          <NavLink
            to={`/dashboard/shops/${this.props.match.params.shopId}/datas/users/${item.id}`}
          >
            <button
              type="button"
              className="btn btn-secondary font-m"
            >
              {getLocales('Перейти в профиль')}
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
                {getLocales('Покупатели')}
              </h3>

              {this.state.data.users <= 0
                ? (
                  <div className="text-center font-m">
                    {getLocales('Покупатели отсутствуют')}
                  </div>
                )
                : (
                  <>
                    <div className="avatar-block">
                      <h4 className="font-m">
                        {getLocales('Сортировка')}
                      </h4>

                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label className="form-control-label font-m">
                              {getLocales('Платформа')}
                            </label>
                            <select
                              disabled={this.state.loading}
                              value={this.state.sortPlatform}
                              onChange={this.sort}
                              name="sortPlatform"
                              className="form-control"
                            >
                              <option value="all">{getLocales('Все')}</option>
                              <option value="site">{getLocales('Сайт')}</option>
                              <option value="telegram">
                                Telegram
                                {' '}
                                {getLocales('Бот')}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Table
                      search
                      columns={tableColumns}
                      items={this.state.items}
                      updateItems={this.updateItems}
                      rowsPerPage="10"
                    />
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DataUsers;
