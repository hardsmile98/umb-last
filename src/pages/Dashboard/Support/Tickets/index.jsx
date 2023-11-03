/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';

import { Table } from 'components';
import { request, getLocales } from 'utils';

const tableColumns = [
  {
    title: 'ID', dataIndex: 'id', key: 'id', sort: true,
  },
  {
    title: getLocales('Тема'),
    dataIndex: 'theme',
    key: 'operations',
    render: (_e, item) => (
      <Link to={`/dashboard/support/ticket/${item.id}`}>
        {item.theme}
      </Link>
    ),
  },
  {
    title: getLocales('Последний ответ'), dataIndex: 'last', key: 'last', sort: true,
  },
  {
    title: getLocales('Создано'), dataIndex: 'created', key: 'created', sort: true,
  },
  {
    title: getLocales('Cтатус'),
    dataIndex: '',
    key: 'operations',
    itemClassName: 'text-center',
    headerClassName: 'text-center',
    render: (_e, item) => (
      <div className="sparkline8">
        <NavLink to={`/dashboard/support/ticket/${item.id}`}>
          <button
            type="button"
            className={`btn font-m auth-btn btn-sessions ${item.status === 1
              ? ' btn-secondary'
              : (item.status === -1
                ? ' btn-danger'
                : ' btn-primary')}`}
          >
            {' '}
            {item.status === 1
              ? getLocales('Отвечен')
              : (item.status === -1
                ? getLocales('Закрыт')
                : getLocales('Ожидает ответа'))}
          </button>
        </NavLink>
      </div>
    ),
  },
];

class Tickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        tickets: [],
      },
      loading: true,
      items: [],
    };
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'tickets',
          type: 'get',
        },
        action: 'support',
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

  updateItems(items) {
    this.setState({
      items,
    });
  }

  prepareTableData() {
    const { state } = this;

    const itemModified = state.data.tickets.map((item) => ({
      id: item.id,
      theme: item.theme,
      last: moment.unix(item.last / 1000).format('LLL'),
      created: moment.unix(item.created / 1000).format('LLL'),
      status: item.status,
    }));

    this.setState({
      items: itemModified,
    });
  }

  render() {
    const { state } = this;

    return (
      <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
        <div className="block-body">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="font-m">
                {getLocales('Обращения')}
              </h3>

              {state.items.length > 0
                ? (
                  <Table
                    search={false}
                    columns={tableColumns}
                    items={state.items}
                    updateItems={this.updateItems}
                    rowsPerPage="10"
                  />
                )
                : (
                  <div className="text-center">
                    <span className="font-m">
                      {getLocales('Обращения отсутствуют')}
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tickets;
