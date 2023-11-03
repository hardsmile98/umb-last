import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { request } from 'utils';
import { Table } from 'components';
import UserModal from './Modal';

class UsersAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        users: [],
      },
      items: [],
      modal: false,
      user: {
        shops: [],
      },
    };

    this.getData = this.getData.bind(this);
    this.prepareTableData = this.prepareTableData.bind(this);
    this.updateItems = this.updateItems.bind(this);
    this.change = this.change.bind(this);
    this.blockAction = this.blockAction.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'datas',
          type: 'getUsers',
        },
        action: 'admin',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          response.data.data.users = response.data.data.users.reverse();
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

  change(id) {
    const { state } = this;

    if (id !== 0) {
      state.data.users.forEach((user) => {
        if (user.id === id) {
          this.setState({
            modal: true,
            user,
          });
        }
      });
    } else {
      this.setState({
        modal: false,
      });
    }
  }

  prepareTableData() {
    const { state } = this;

    const newItems = state.data.users.map((item) => ({
      id: item.id,
      login: item.login,
      balance: `${item.balance.toFixed(8)} BTC`,
      shops: `${item.shops.length} шт`,
      comission: `${item.comission}%`,
      regdate: moment.unix(item.regdate / 1000).format('LLL'),
      block: item.block,
      notice: item.notice,
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

  blockAction(id) {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'datas',
          type: 'blockAction',
          user: id,
        },
        action: 'admin',
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

  sendMessage(id) {
    const { props } = this;

    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'datas',
          type: 'sendMessage',
          id,
        },
        action: 'admin',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          props.history.push(`/dashboard/manage/chats/${response.data.data.id}`);
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
        title: 'Логин', dataIndex: 'login', key: 'login', sort: true,
      },
      {
        title: 'Баланс', dataIndex: 'balance', key: 'balance', sort: true,
      },
      {
        title: 'Имеет шопов', dataIndex: 'shops', key: 'shops', sort: true,
      },
      {
        title: 'Комиссия', dataIndex: 'comission', key: 'comission', sort: true,
      },
      {
        title: 'Заметка', dataIndex: 'notice', key: 'notice', sort: true,
      },
      {
        title: 'Зарегистрирован', dataIndex: 'regdate', key: 'regdate', sort: true,
      },
      {
        title: 'Действие',
        dataIndex: 'name',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        key: 'operations',
        render: (_e, item) => (
          <div className="sparkline8">
            <NavLink to={`/dashboard/manage/datas/users/${item.id}`}>
              <button
                type="button"
                className="btn btn-secondary btn-table"
              >
                <FontAwesomeIcon icon={faDoorOpen} />
              </button>
            </NavLink>

            <button
              type="button"
              onClick={() => this.sendMessage(item.id)}
              className="btn btn-secondary btn-table"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>

            <button
              type="button"
              onClick={() => this.blockAction(item.id)}
              className={`btn btn-table ${item.block === 0 ? 'btn-danger' : 'btn-primary'}`}
            >
              {item.block === 0
                ? 'Блок'
                : 'Разблок'}
            </button>
          </div>
        ),
      },
    ];

    const { state } = this;

    return (
      <>
        <div className={`block animate__animated animate__fadeIn margin-15 ${state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="font-m">
                  Пользователи
                </h3>

                {state.data.users.length > 0
                  ? (
                    <Table
                      columns={tableColumns}
                      items={state.items}
                      updateItems={this.updateItems}
                      rowsPerPage="10"
                    />
                  )
                  : (
                    <div className="text-center font-m">
                      Пользователи отсутствуют
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        <UserModal
          modal={state.modal}
          toggle={() => this.change(0)}
          user={state.user}
          getData={this.getData}
        />
      </>
    );
  }
}

export default UsersAdmin;
