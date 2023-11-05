/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/sort-comp */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { request, getLocales } from 'utils';
import { Table, ModalConfirm } from 'components';

class SitePages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: {
        pages: [],
      },
      items: [],
      id: 0,
      confirmModal: false,
    };

    this.getData = this.getData.bind(this);
    this.prepareTableData = this.prepareTableData.bind(this);
    this.updateItems = this.updateItems.bind(this);
    this.confirmToggle = this.confirmToggle.bind(this);
    this.delete = this.delete.bind(this);
  }

  confirmToggle(id) {
    this.setState({
      confirmModal: !this.state.confirmModal,
      id,
    });
  }

  componentDidMount() {
    this.getData();
  }

  prepareTableData() {
    const items = [];

    this.state.data.pages.map((item) => {
      const itemModified = {
        id: item.id,
        name: item.name,
        path: item.path ? (`/${item.path}`) : item.content,
        type: item.type
          .replace(/text/g, getLocales('Информационная страница'))
          .replace(/link/g, getLocales('Страница-ссылка')),
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

  delete() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'site',
          subtype: 'pages',
          shop: this.props.match.params.shopId,
          action: 'delete',
          id: this.state.id,
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
          this.confirmToggle(0);
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
          type: 'site',
          subtype: 'pages',
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
        title: 'ID', dataIndex: 'id', key: 'id', sort: true,
      },
      {
        title: getLocales('Тип'), dataIndex: 'type', key: 'type', sort: true,
      },
      {
        title: getLocales('Название'), dataIndex: 'name', key: 'name', sort: true,
      },
      {
        title: getLocales('Путь'), dataIndex: 'path', key: 'path', sort: true,
      },
      {
        title: getLocales('Действия'),
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        dataIndex: 'value',
        key: 'operations',
        render: (e, item) => (
          <div className="sparkline8">
            <NavLink
              to={`/dashboard/shops/${this.props.match.params.shopId}/site/pages/${item.id}`}
            >
              <button type="button" className="btn btn-secondary btn-table">
                <FontAwesomeIcon icon={faSearchPlus} />
              </button>
            </NavLink>

            <button
              type="button"
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
        <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="font-m">
                  {getLocales('Страницы')}
                  {' '}
                  <span className="right">
                    <NavLink to={`/dashboard/shops/${this.props.match.params.shopId}/site/pages/new`}>
                      {' '}
                      +
                      {getLocales('Создать страницу')}
                    </NavLink>
                  </span>
                </h3>

                {this.state.data.pages.length > 0
                  ? (
                    <Table
                      columns={tableColumns}
                      items={this.state.items}
                      updateItems={this.updateItems}
                      rowsPerPage="10"
                    />
                  )
                  : (
                    <div className="text-center font-m">
                      {getLocales('Страницы отсутствуют')}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        <ModalConfirm
          action={getLocales('Вы действительно хотите удалить данную страницу?')}
          consequences=""
          modal={this.state.confirmModal}
          toggle={this.confirmToggle}
          loading={this.state.loading}
          sendData={this.delete}
        />
      </>
    );
  }
}

export default SitePages;
