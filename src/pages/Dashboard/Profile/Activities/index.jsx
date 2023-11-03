import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';

import { Table } from 'components';
import { request, getLocales } from 'utils';

const tableColumns = [
  {
    title: 'ID', dataIndex: 'id', key: 'id', sort: true,
  },
  {
    title: getLocales('Описание'), dataIndex: 'description', key: 'description', sort: false,
  },
  {
    title: getLocales('Дата'), dataIndex: 'date', key: 'date', sort: true,
  },
];

class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        user: {},
        activities: [],
      },
      items: [],
      loading: true,
    };
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'activities',
          type: 'get',
        },
        action: 'profile',
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

  prepareTableData() {
    const { state } = this;

    const newItems = state.data.activities.map((item) => ({
      id: item.id,
      description: item.description
        .replace(/Регистрация аккаута/g, getLocales('Регистрация аккаута'))
        .replace(/Успешный вход в аккаунт/g, getLocales('Успешный вход в аккаунт'))
        .replace(/Выход из аккаунта/g, getLocales('Выход из аккаунта')
          .replace(/Сессия/g, 'Session')),
      date: moment.unix(item.date / 1000).format('LLL'),
    }));

    this.setState({
      items: newItems,
    });
  }

  updateItems(items) {
    this.setState({
      items,
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
                {getLocales('Активность аккаунта')}
              </h3>

              <br />

              <Table
                columns={tableColumns}
                items={state.items}
                updateItems={this.updateItems}
                rowsPerPage="10"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Activities;
