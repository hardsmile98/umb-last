/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-danger */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ModalConfirm } from 'components';
import { request, getLocales } from 'utils';

let bonuses = [];

class Bonuses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      purchases: '',
      percent: '',
      sum: '',
      method: 'discount',
      data: {
        bonuses: [],
        currency: '',
      },
      modal: false,
      id: 0,
      tip: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.getData = this.getData.bind(this);
    this.sendData = this.sendData.bind(this);
    this.changeBonus = this.changeBonus.bind(this);
    this.updateData = this.updateData.bind(this);
    this.toggle = this.toggle.bind(this);
    this.delete = this.delete.bind(this);
  }

  toggle(id) {
    if (String(id) !== '0') {
      this.setState({
        id,
        modal: true,
      });
    } else {
      this.setState({
        modal: false,
      });
    }
  }

  delete() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'bonuses',
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

          this.getData();
          this.toggle(0);
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

  componentDidMount() {
    this.getData();
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox'
      ? 'checked'
      : 'value'];

    const { name } = e.target;

    this.setState({
      [name]: value,
    });
  }

  updateData(id) {
    this.state.data.bonuses.map((item) => {
      if (String(item.id) === String(id)) {
        const data = {
          api: 'user',
          body: {
            data: {
              section: 'shop',
              type: 'settings',
              subtype: 'bonuses',
              shop: this.props.match.params.shopId,
              action: 'update',
              level: item.level,
              percent: item.percent,
              sum: item.sum,
              method: item.method,
              id: item.id,
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
    });
  }

  sendData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'bonuses',
          shop: this.props.match.params.shopId,
          action: 'create',
          level: this.state.purchases,
          percent: this.state.percent,
          sum: this.state.sum,
          method: this.state.method,
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

  changeBonus(id, name, content) {
    bonuses[id][name] = content;

    this.setState({
      bonuses,
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
          subtype: 'bonuses',
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
          bonuses = response.data.data.bonuses;

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
        toast.error('Сервер недоступен');
      }
    });
  }

  render() {
    return (
      <>
        <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="font-m">
                  {getLocales('Бонусная программа')}
                </h3>

                <div
                  aria-hidden
                  className="avatar-block notice-chat cursor-pointer"
                  onClick={() => this.setState({ tip: !this.state.tip })}
                >
                  <p>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    {' '}
                    {getLocales('Подробнее')}
                  </p>
                  <div className={`text-left ${this.state.tip ? 'show' : 'hidden'}`}>
                    <p dangerouslySetInnerHTML={{ __html: getLocales('Бонусная программа - это эффективный инструмент поощрения и стимулирования Ваших клиентов.<br />Существует два раздела:<br />Бонусы - для поощрения в виде скидок;<br />Кэшбэк - для стимулирования, закрепляя клиента за Вашим магазином.<br /><br />Пример:<br />Вы создали бонус, который при сумме покупок 12.000 рублей дает скидку 5% и 10 рублей, таким образом, у всех покупателей, у которых сумма покупок, больше или равна 12.000 рублей, будет скидка 5% и 10 рублей.<br />Кэшбэк после покупки зачисляет на баланс определенную сумму, либо процент от покупки, таким образом, покупатель будет закреплен за Вашим магазином, чтобы потратить накопившиеся бонусы.') }} />
                  </div>
                </div>

                <br />

                <div className="avatar-block">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Сумма покупок')}
                        </label>
                        <div className="input-group">
                          <input
                            placeholder={getLocales('Введите сумму покупок')}
                            disabled={this.state.loading}
                            value={this.state.purchases}
                            onChange={this.handleChange}
                            name="purchases"
                            className="form-control"
                          />
                          <span className="input-group-text">
                            {this.state.data.currency}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3">
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Тип бонуса')}
                        </label>
                        <select
                          disabled={this.state.loading}
                          value={this.state.method}
                          onChange={this.handleChange}
                          name="method"
                          className="form-control"
                        >
                          <option value="discount">{getLocales('Скидка')}</option>
                          <option value="cashback">{getLocales('Кэшбэк')}</option>
                        </select>
                      </div>
                    </div>

                    {this.state.method === 'discount'
                      ? (
                        <>
                          <div className="col-lg-3">
                            <div className="form-group">
                              <label className="form-control-label font-m">
                                {getLocales('Скидка в')}
                                {' '}
                                %
                              </label>
                              <div className="input-group">
                                <input
                                  placeholder={getLocales('Введите процент скидки')}
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

                          <div className="col-lg-3">
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
                        </>
                      )
                      : (
                        <>
                          <div className="col-lg-3">
                            <div className="form-group">
                              <label className="form-control-label font-m">
                                {getLocales('Кэшбэк в')}
                                {' '}
                                %
                              </label>
                              <div className="input-group">
                                <input
                                  placeholder={getLocales('Введите процент кэшбэка от суммы покупок')}
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

                          <div className="col-lg-3">
                            <div className="form-group">
                              <label className="form-control-label font-m">
                                {getLocales('Кэшбэк в')}
                                {' '}
                                {this.state.data.currency}
                              </label>
                              <div className="input-group">
                                <input
                                  placeholder={getLocales('Введите сумму кэшбэка')}
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
                        </>
                      )}

                    <div className="col-lg-12">
                      <button
                        type="button"
                        onClick={this.sendData}
                        className="btn btn-primary font-m right"
                      >
                        {getLocales('Добавить бонус')}
                      </button>
                    </div>
                  </div>
                </div>

                {this.state.data.bonuses.map((item, i) => (
                  <div className="avatar-block">
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="form-group">
                          <label className="form-control-label font-m">
                            {getLocales('Сумма покупок')}
                          </label>
                          <div className="input-group">
                            <input
                              placeholder={getLocales('Введите сумму покупок')}
                              disabled={this.state.loading}
                              value={item.level}
                              onChange={(e) => this.changeBonus(i, 'level', e.target.value)}
                              name="purchases"
                              className="form-control"
                            />
                            <span className="input-group-text">
                              {this.state.data.currency}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div className="form-group">
                          <label className="form-control-label font-m">
                            {getLocales('Тип бонуса')}
                          </label>
                          <select
                            disabled={this.state.loading}
                            value={item.method}
                            onChange={(e) => this.changeBonus(i, 'method', e.target.value)}
                            name="method"
                            className="form-control"
                          >
                            <option value="discount">{getLocales('Скидка')}</option>
                            <option value="cashback">{getLocales('Кэшбэк')}</option>
                          </select>
                        </div>
                      </div>
                      {item.method === 'discount'
                        ? (
                          <>
                            <div className="col-lg-3">
                              <div className="form-group">
                                <label className="form-control-label font-m">
                                  {getLocales('Скидка в')}
                                  {' '}
                                  %
                                </label>
                                <div className="input-group">
                                  <input
                                    placeholder={getLocales('Введите процент скидки')}
                                    disabled={this.state.loading}
                                    value={item.percent}
                                    onChange={(e) => { this.changeBonus(i, 'percent', e.target.value); }}
                                    name="percent"
                                    className="form-control"
                                  />
                                  <span className="input-group-text">%</span>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-3">
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
                                    value={item.sum}
                                    onChange={(e) => { this.changeBonus(i, 'sum', e.target.value); }}
                                    name="sum"
                                    className="form-control"
                                  />
                                  <span className="input-group-text">{this.state.data.currency}</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                        : (
                          <>
                            <div className="col-lg-3">
                              <div className="form-group">
                                <label className="form-control-label font-m">
                                  {getLocales('Кэшбэк в')}
                                  {' '}
                                  %
                                </label>
                                <div className="input-group">
                                  <input
                                    placeholder={getLocales('Введите процент кэшбэка от суммы покупок')}
                                    disabled={this.state.loading}
                                    value={item.percent}
                                    onChange={(e) => { this.changeBonus(i, 'percent', e.target.value); }}
                                    name="percent"
                                    className="form-control"
                                  />
                                  <span className="input-group-text">%</span>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-3">
                              <div className="form-group">
                                <label className="form-control-label font-m">
                                  {getLocales('Кэшбэк в')}
                                  {' '}
                                  {this.state.data.currency}
                                </label>
                                <div className="input-group">
                                  <input
                                    placeholder={getLocales('Введите сумму кэшбэка')}
                                    disabled={this.state.loading}
                                    value={item.sum}
                                    onChange={(e) => { this.changeBonus(i, 'sum', e.target.value); }}
                                    name="sum"
                                    className="form-control"
                                  />
                                  <span className="input-group-text">{this.state.data.currency}</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                      <div className="col-lg-12">
                        <button
                          type="button"
                          onClick={() => this.toggle(item.id)}
                          className="btn btn-danger font-m left"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                          {' '}
                          {getLocales('Удалить')}
                        </button>

                        <button
                          type="button"
                          onClick={() => this.updateData(item.id)}
                          className="btn btn-primary font-m right"
                        >
                          {getLocales('Сохранить')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ModalConfirm
          action={getLocales('Вы действительно хотите удалить данный бонус?')}
          consequences=""
          modal={this.state.modal}
          toggle={() => this.toggle(0)}
          loading={this.state.loading}
          sendData={this.delete}
        />
      </>
    );
  }
}

export default Bonuses;
