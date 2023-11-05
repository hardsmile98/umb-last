/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Table } from 'components';
import { request, getLocales } from 'utils';

class Domains extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: {
        domains: [],
      },
      items: [],
      type: 'sub',
    };
    this.getData = this.getData.bind(this);
    this.prepareTableData = this.prepareTableData.bind(this);
    this.updateItems = this.updateItems.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.add = this.add.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox' ? 'checked' : 'value'];
    const { name } = e.target;

    this.setState({
      [name]: value,
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
          subtype: 'domains',
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

  add() {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'site',
          subtype: 'domains',
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
    const items = [];

    this.state.data.domains.map((item) => {
      const itemModified = {
        value: item.value,
        type: item.type
          .replace(/onion/g, 'ONION').replace(/sub/g, getLocales('Поддомен'))
          .replace(/own/g, getLocales('Собственный')),
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

  render() {
    const tableColumns = [
      {
        title: getLocales('Тип'),
        dataIndex: 'type',
        key: 'type',
        sort: true,
      },
      {
        title: getLocales('Домен'),
        dataIndex: 'value',
        key: 'operations',
        render: (e, item) => (
          <a
            target="_blank"
            href={`http://${item.value}`}
            rel="noreferrer"
          >
            {item.value}
          </a>
        ),
      },
    ];
    return (
      <div className="row">
        <div className="col-lg-4">
          <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <h3 className="font-m">
                {getLocales('Добавление домена')}
              </h3>

              <div className="form-group margin-15">
                <label className="form-control-label font-m">
                  {getLocales('Тип домена')}
                </label>
                <select
                  disabled={this.state.loading}
                  value={this.state.type}
                  onChange={this.handleChange}
                  name="type"
                  className="form-control"
                >
                  <option value="sub">{getLocales('Субдомен')}</option>
                  <option value="onion">{getLocales('Onion домен')}</option>
                  <option value="own">{getLocales('Собственный домен')}</option>
                </select>
              </div>

              {this.state.type === 'own'
                ? (
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Домен')}
                    </label>
                    <input
                      placeholder={getLocales('Введите домен')}
                      disabled={this.state.loading}
                      value={this.state.domain}
                      onChange={this.handleChange}
                      name="domain"
                      className="form-control"
                    />
                    <small>
                      {getLocales('Введите домен, который желаете подключить')}
                    </small>
                  </div>
                )
                : this.state.type === 'sub'
                  ? (
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Субдомен')}
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          autoComplete="off"
                          className="form-control"
                          placeholder={getLocales('Введите субдомен')}
                          name="domain"
                        />
                        <span className="input-group-text font-m">
                          .umb.market
                        </span>
                      </div>
                    </div>
                  )
                  : ''}

              <button
                type="button"
                disabled={this.state.loading}
                onClick={this.add}
                className="btn btn-primary font-m auth-btn"
              >
                {this.state.loading
                  ? getLocales('Загрузка...')
                  : getLocales('Добавить домен')}
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <h3 className="font-m">
                {getLocales('Домены')}
              </h3>

              <Table
                columns={tableColumns}
                items={this.state.items}
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

export default Domains;
