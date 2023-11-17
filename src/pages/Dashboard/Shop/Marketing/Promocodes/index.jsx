/* eslint-disable react/no-deprecated */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import uniqueString from 'unique-string';
import { Table, ModalConfirm } from 'components';
import { request, getLocales } from 'utils';
import { isArray } from '@amcharts/amcharts4/core';
import PromocodeModal from './PromocodeModal';

const initialForm = {
  percent: 0,
  sum: 0,
  startPromocode: '',
  arrayPromocodes: [],
  fromDate: moment.unix(new Date(Date.now())
    .setHours(0, 0, 0, 0) / 1000).format('YYYY-MM-DD'),
  toDate: '',
  limitActive: 0,
  note: '',
  onlyone: true,
};

class Promocodes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      value: '',
      action: 'create',
      count: 0,
      ...initialForm,
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
    this.generatePromocode = this.generatePromocode.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(_prevProps, prevState) {
    if (this.state.action === 'createMass') {
      if (this.state.startPromocode !== prevState.startPromocode) {
        this.setState((prev) => ({
          ...prev,
          value: this.state.arrayPromocodes.map((el) => `${this.state.startPromocode}${el}`),
        }));
      }

      if (this.state.count !== prevState.count) {
        if (this.state.count >= 1) {
          const promocodes = new Array(+this.state.count).fill(0)
            .map(() => uniqueString().slice(0, 15));

          this.setState((prev) => ({
            ...prev,
            value: promocodes.map((el) => `${this.state.startPromocode}${el}`),
            arrayPromocodes: promocodes,
          }));
        } else {
          this.setState((prev) => ({
            ...prev,
            value: [],
            arrayPromocodes: [],
          }));
        }
      }
    }

    if (this.state.action !== prevState.action) {
      this.setState((prev) => ({
        ...prev,
        value: '',
        startPromocode: '',
        count: this.state.action === 'createMass'
          ? 1
          : 0,
      }));
    }
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox'
      ? 'checked'
      : 'value'];
    const { name, max } = e.target;

    let formatted = value;

    if (name === 'startPromocode') {
      formatted = value.replace(/[,/.]/g, '');
    }

    if (name === 'count') {
      const onlyNumber = value.replace(/[^0-9]/g, '');
      formatted = +onlyNumber > max ? max : onlyNumber;
    }

    this.setState({
      [name]: formatted,
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
          this.prepareTableData(response.data.data.promocodes);
          this.setState({
            data: response.data.data,
            loading: false,
          });
        } else {
          this.setState({
            loading: false,
          });
          toast.error(response.data.message);
        }
      } else {
        toast.error(getLocales('Сервер недоступен'));
      }
    });
  }

  delete(id) {
    this.setState((prev) => ({
      ...prev,
      modalconf: !prev.modalconf,
      deleteid: id,
    }));
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
        toast.error(getLocales('Сервер недоступен'));
      }
    });
  }

  toggle(promo) {
    if (promo !== 0) {
      const findedPrimocode = this.state.data.promocodes
        .find((promocode) => promocode.id === promo);

      const arrayUsed = findedPrimocode?.usedBy?.split(',') || [];

      const active = arrayUsed.map((id) => this.state.data.users.find((u) => +u.id === +id));

      this.setState({
        promocode: findedPrimocode,
        modal: true,
        active,
      });
    } else {
      this.setState({
        modal: false,
      });
    }
  }

  prepareTableData(promocodes) {
    const formatted = promocodes.map((item) => ({
      id: item.id,
      value: item.value,
      fromDate: moment.unix(item.fromDate / 1000).format('LLL'),
      toDate: moment.unix(item.toDate / 1000).format('LLL'),
      activations: item.activations,
      status: item.status,
      limitActive: item.limitActive,
    }));

    this.setState({
      items: formatted,
    });
  }

  updateItems(items) {
    this.setState({
      items,
    });
  }

  sendData() {
    if (!this.state.toDate) {
      toast.error(getLocales('Выберите дату действия промкода'));
      return;
    }

    const isValidValue = isArray(this.state.value)
      ? this.state.value.length > 0
      : this.state.value !== '';

    if (!isValidValue || this.state.limitActive === '') {
      toast.error(getLocales('Не все даные заполнены'));
      return;
    }

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
          action: this.state.action,
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
          this.setState({
            ...initialForm,
            value: this.state.action === 'create' ? '' : [''],
            count: this.state.action === 'create' ? 0 : 1,
          });
        } else {
          this.setState({
            loading: false,
          });
          toast.error(response.data.message);
        }
      } else {
        toast.error(getLocales('Сервер недоступен'));
      }
    });
  }

  generatePromocode() {
    this.setState({
      value: uniqueString().slice(0, 15),
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

  render() {
    const tableColumns = [
      {
        title: getLocales('Промокод'),
        dataIndex: 'value',
        key: 'operations',
        render: (_e, item) => (
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
            {`${item.activations}/${String(item.limitActive) === '0'
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
        render: (_e, item) => (
          <div className="sparkline8">
            <button
              type="button"
              onClick={() => { this.changeStatus(item.id); }}
              className={`btn table-button font-m ${String(item.status) === '1'
                ? ' btn-primary'
                : ' btn-danger'}`}
            >
              {' '}
              {String(item.status) === '1'
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
              onClick={() => this.delete(item.id)}
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
                    {getLocales('Способ добавления')}
                  </label>
                  <select
                    onChange={this.handleChange}
                    name="action"
                    disabled={this.state.loading}
                    className="form-control"
                  >
                    <option value="create">{getLocales('По одному')}</option>
                    <option value="createMass">{getLocales('Массово')}</option>
                  </select>
                </div>

                {this.state.action === 'create' ? (
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
                          onClick={this.generatePromocode}
                          className="btn btn-secondary font-m"
                          type="button"
                        >
                          {getLocales('Сгенерировать')}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="form-control-label font-m">
                            {getLocales('Количество промокодов')}
                          </label>
                          <input
                            disabled={this.state.loading}
                            value={this.state.count}
                            onChange={this.handleChange}
                            autoComplete="off"
                            max={250}
                            min={1}
                            placeholder={getLocales('Введите количество промокодов')}
                            name="count"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="form-group">
                          <label
                            className="form-control-label font-m"
                            title={getLocales('Текст, на который будет начинаться каждый из промокодов')}
                          >
                            {getLocales('Начало промокода')}
                            {' '}
                            <span
                              className="icon-secondary"
                              data-toggle="tooltip"
                            >
                              <FontAwesomeIcon icon={faInfoCircle} />
                            </span>
                          </label>
                          <input
                            disabled={this.state.loading}
                            value={this.state.startPromocode}
                            onChange={this.handleChange}
                            autoComplete="off"
                            placeholder={getLocales('Введите начало промокодов')}
                            name="startPromocode"
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Промокоды')}
                        {' '}
                        <span
                          aria-hidden
                          className="icon-secondary icon-button"
                          data-toggle="tooltip"
                          onClick={() => {
                            navigator.clipboard.writeText(isArray(this.state.value)
                              ? this.state.value.join('\n')
                              : this.state.value);
                            toast.success(getLocales('Скопировано'));
                          }}
                        >
                          <FontAwesomeIcon icon={faCopy} />
                        </span>
                      </label>
                      <textarea
                        disabled
                        value={isArray(this.state.value)
                          ? this.state.value.join('\n')
                          : this.state.value}
                        autoComplete="off"
                        className="form-control"
                      />
                    </div>
                  </div>
                )}

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
                          type="number"
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
                          type="number"
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
                  <div className="i-checks d-flex align-items-center">
                    <input
                      name="onlyone"
                      checked={this.state.onlyone}
                      onChange={this.handleChange}
                      id="oneone"
                      type="checkbox"
                      className="checkbox-template"
                    />
                    <label
                      htmlFor="onlyone"
                      className="checkbox-label font-m promocode-checkbox-label"
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
          toggle={() => this.delete(0)}
          loading={this.state.loading}
          sendData={this.deleteReal}
        />

        <PromocodeModal
          shopId={this.props.match.params.shopId}
          active={this.state.active}
          currency={this.state.data.currency}
          promocode={this.state.promocode}
          modal={this.state.modal}
          toggle={() => this.toggle(0)}
          getData={this.getData}
        />
      </>
    );
  }
}

export default Promocodes;
