/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/sort-comp */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
import uniqueString from 'unique-string';
import { Table, ModalConfirm } from 'components';
import { request, getLocales } from 'utils';
import PromocodeModal from './PromocodeModal';

class Promocodes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      value: '',
      percent: 0,
      sum: 0,
      fromDate: moment.unix(new Date(Date.now())
        .setHours(0, 0, 0, 0) / 1000).format('YYYY-MM-DD'),
      toDate: '',
      limitActive: 0,
      note: '',
      onlyone: true,
      data: {
        promocodes: [],
        currency: '',
        users: [],
      },
      items: [],
      modal: false,
      active: [],
      promocode: {},
      modalconf: false,
      deleteid: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.getData = this.getData.bind(this);
    this.prepareTableData = this.prepareTableData.bind(this);
    this.updateItems = this.updateItems.bind(this);
    this.sendData = this.sendData.bind(this);
    this.toggle = this.toggle.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteReal = this.deleteReal.bind(this);
  }

  delete(id) {
    this.setState({
      modalconf: !this.state.modalconf,
      deleteid: id,
    });
  }

  deleteReal() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'promocodes',
          shop: this.props.match.params.shopId,
          action: 'delete',
          id: this.state.deleteid,
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
          this.delete(0);
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

  toggle(promo) {
    if (promo !== 0) {
      this.state.data.promocodes.map((item) => {
        if (item.id === promo) {
          const active = [];
          if (item.usedBy !== null) {
            item.usedBy = item.usedBy.split(',');
            if (item.usedBy.length > 0) {
              item.usedBy.map((i) => {
                this.state.data.users.map((user) => {
                  if (user.id === i) {
                    active.push(user);
                  }
                });
              });
            }
          }

          this.setState({
            promocode: item,
            modal: true,
            active,
          });
        }
      });
    } else {
      this.setState({
        modal: false,
      });
    }
  }

  componentDidMount() {
    this.getData();
  }

  prepareTableData() {
    const items = [];

    this.state.data.promocodes.map((item) => {
      const itemModified = {
        id: item.id,
        value: item.value,
        fromDate: moment.unix(item.fromDate / 1000).format('LLL'),
        toDate: moment.unix(item.toDate / 1000).format('LLL'),
        activations: item.activations,
        status: item.status,
        limitActive: item.limitActive,
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

  sendData() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'promocodes',
          shop: this.props.match.params.shopId,
          action: 'create',
          value: this.state.value,
          percent: this.state.percent === '' ? 0 : this.state.percent,
          sum: this.state.sum === '' ? 0 : this.state.sum,
          fromDate: +new Date(this.state.fromDate),
          toDate: +new Date(this.state.toDate),
          limitActive: this.state.limitActive,
          onlyone: this.state.onlyone,
          note: this.state.note,
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

  changeStatus(id) {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'promocodes',
          shop: this.props.match.params.shopId,
          id,
          action: 'changeStatus',
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
          type: 'settings',
          subtype: 'promocodes',
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

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox' ? 'checked' : 'value'];
    const { name } = e.target;

    this.setState({
      [name]: value,
    });
  }

  render() {
    const tableColumns = [
      {
        title: getLocales('Промокод'),
        dataIndex: 'value',
        key: 'operations',
        render: (e, item) => (
          <>
            <a
              aria-hidden
              className="text-danger"
              onClick={() => this.toggle(item.id)}
            >
              {item.value}
            </a>
            {' '}
            <span
              aria-hidden
              className="text-danger pointer"
              onClick={() => {
                navigator.clipboard.writeText(item.value);
                toast.success(getLocales('Успешно добавлено в буфер обмена'));
              }}
            >
              <FontAwesomeIcon icon={faCopy} />
            </span>
          </>
        ),
      },
      {
        title: getLocales('Активаций'),
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        dataIndex: 'value',
        key: 'operations',
        render: (_e, item) => (
          <span>
            {`${item.activations}/${item.limitActive === 0
              ? '~'
              : item.limitActive}`}
          </span>
        ),
      },
      {
        title: getLocales('От'),
        dataIndex: 'fromDate',
        key: 'fromDate',
        sort: true,
      },
      {
        title: getLocales('До'), dataIndex: 'toDate', key: 'fromDate', sort: true,
      },
      {
        title: getLocales('Статус'),
        dataIndex: '',
        key: 'operations',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        render: (e, item) => (
          <div className="sparkline8">
            <button
              type="button"
              onClick={() => { this.changeStatus(item.id); }}
              className={`btn table-button font-m ${item.status === 1 ? ' btn-primary' : ' btn-danger'}`}
            >
              {' '}
              {item.status === 1
                ? getLocales('Активен')
                : getLocales('Отключен')}
            </button>
          </div>
        ),
      },
      {
        title: '',
        dataIndex: '',
        key: 'operations',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        render: (_e, item) => (
          <div className="sparkline8">
            <button
              type="button"
              onClick={() => { this.delete(item.id); }}
              className="btn table-button font-m btn-danger"
            >
              {' '}
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ];
    return (
      <>
        <div className="row">
          <div className="col-lg-4">
            <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h3 className="font-m">
                  {getLocales('Добавление промокода')}
                </h3>

                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Промокод')}
                  </label>
                  <div className="input-group">
                    <input
                      placeholder={getLocales('Введите промокод')}
                      disabled={this.state.loading}
                      value={this.state.value}
                      onChange={this.handleChange}
                      name="value"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <button
                        onClick={() => {
                          this.setState({
                            value: uniqueString().slice(0, 15),
                          });
                        }}
                        className="btn btn-secondary font-m"
                        type="button"
                      >
                        {getLocales('Сгенерировать')}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Скидка в')}
                        {' '}
                        %
                      </label>
                      <div className="input-group">
                        <input
                          placeholder="Введите процент скидки"
                          disabled={this.state.loading}
                          value={this.state.percent}
                          onChange={this.handleChange}
                          name="percent"
                          className="form-control"
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Скидка в')}
                        {' '}
                        {this.state.data.currency}
                      </label>
                      <div className="input-group">
                        <input
                          placeholder={getLocales('Введите сумму скидки')}
                          disabled={this.state.loading}
                          value={this.state.sum}
                          onChange={this.handleChange}
                          name="sum"
                          className="form-control"
                        />
                        <span className="input-group-text">
                          {this.state.data.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="font-m">
                  {getLocales('Время действия промокода')}
                </h3>

                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('От')}
                      </label>
                      <input
                        type="date"
                        placeholder={getLocales('Выберите дату действия от')}
                        disabled={this.state.loading}
                        value={this.state.fromDate}
                        onChange={this.handleChange}
                        name="fromDate"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('До')}
                      </label>
                      <input
                        type="date"
                        placeholder={getLocales('Выберите дату действия до')}
                        disabled={this.state.loading}
                        value={this.state.toDate}
                        onChange={this.handleChange}
                        name="toDate"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Максимальное кол-во активаций')}
                  </label>
                  <input
                    placeholder={getLocales('Введите максимальное кол-во активаций')}
                    disabled={this.state.loading}
                    value={this.state.limitActive}
                    onChange={this.handleChange}
                    name="limitActive"
                    className="form-control"
                  />
                  <small>
                    {getLocales('Оставьте 0, если хотите сделать бесконечное кол-во активаций')}
                  </small>
                </div>

                <div className="avatar-block no-margin">
                  <div className="i-checks">
                    <input
                      name="onlyone"
                      checked={this.state.onlyone}
                      onClick={this.handleChange}
                      id="oneone"
                      type="checkbox"
                      className="checkbox-template"
                    />
                    <label
                      htmlFor="onlyone"
                      className="checkbox-label font-m promocode"
                    >
                      {getLocales('Единичная активация (1 пользователь = 1 активация)')}

                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Заметка')}
                  </label>
                  <input
                    placeholder={getLocales('Введите заметку о промокоде')}
                    disabled={this.state.loading}
                    value={this.state.note}
                    onChange={this.handleChange}
                    name="note"
                    className="form-control"
                  />
                </div>

                <button
                  type="button"
                  onClick={this.sendData}
                  disabled={this.state.loading}
                  className="btn btn-primary font-m auth-btn margin-15"
                >
                  {this.state.loading
                    ? getLocales('Загрузка...')
                    : getLocales('Создать промокод')}

                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h3 className="font-m">
                  {getLocales('Промокоды')}
                </h3>

                {this.state.data.promocodes.length > 0
                  ? (
                    <Table
                      search={false}
                      columns={tableColumns}
                      items={this.state.items}
                      updateItems={this.updateItems}
                      rowsPerPage="10"
                    />
                  )
                  : (
                    <div className="text-center font-m">
                      {getLocales('Промокоды отсутствуют')}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        <ModalConfirm
          action={getLocales('Вы действительно хотите удалить данный промокод?')}
          modal={this.state.modalconf}
          toggle={() => { this.delete(0); }}
          loading={this.state.loading}
          sendData={this.deleteReal}
        />

        <PromocodeModal
          shopId={this.props.match.params.shopId}
          active={this.state.active}
          currency={this.state.data.currency}
          {...this.props}
          promocode={this.state.promocode}
          modal={this.state.modal}
          toggle={() => { this.toggle(0); }}
          getData={this.getData}
        />
      </>
    );
  }
}

export default Promocodes;
