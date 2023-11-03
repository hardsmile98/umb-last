import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

import { request } from 'utils';
import { Table } from 'components';

class ShopsAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        shops: [],
      },
      items: [],
    };
    this.getData = this.getData.bind(this);
    this.prepareTableData = this.prepareTableData.bind(this);
    this.updateItems = this.updateItems.bind(this);
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
          type: 'getShops',
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
          response.data.data.shops = response.data.data.shops.reverse();

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

  prepareTableData() {
    const { state } = this;

    const newItems = state.data.shops.map((item) => ({
      id: item.id,
      uniqueId: item.uniqueId,
      domains: item.domains,
      bots: item.bots,
      purchases: `${item.purchasesSum} ${item.currency}`,
      owner: item.owner,
      ownerLogin: item.ownerLogin,
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
    const tableColumns = [
      {
        title: 'ID', dataIndex: 'id', key: 'id', sort: true,
      },
      {
        title: 'Захэшированный ID', dataIndex: 'uniqueId', key: 'uniqueId', sort: true,
      },
      {
        title: 'Домены', dataIndex: 'domains', key: 'domains', sort: true,
      },
      {
        title: 'Боты', dataIndex: 'bots', key: 'bots', sort: true,
      },
      {
        title: 'Оборот за все время', dataIndex: 'purchases', key: 'purchases', sort: true,
      },
      {
        title: 'Владелец',
        dataIndex: 'ownerLogin',
        key: 'operations',
        render: (_e, item) => (
          <div className="sparkline8">
            <NavLink to={`/dashboard/manage/datas/users/${item.owner}/`}>
              <button type="button" className="btn btn-secondary btn-table">
                {item.ownerLogin}
              </button>
            </NavLink>
          </div>
        ),
      },
      {
        title: 'Действие',
        dataIndex: 'name',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        key: 'operations',
        render: (_e, item) => (
          <div className="sparkline8">
            <NavLink
              to={`/dashboard/shops/${item.uniqueId}/`}
            >
              <button type="button" className="btn btn-secondary btn-table">
                <FontAwesomeIcon icon={faArrowCircleRight} />
              </button>
            </NavLink>
          </div>
        ),
      },
    ];

    const { state } = this;

    return (
      <div className={`block animate__animated animate__fadeIn margin-15 ${state.loading ? 'blur' : ''}`}>
        <div className="block-body">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="font-m">
                Магазины
              </h3>

              {state.data.shops.length > 0
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
                    Магазины отсутствуют
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShopsAdmin;
