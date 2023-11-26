/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearchPlus, faBackspace, faLink, faUnlink,
} from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { Table, ModalConfirm } from 'components';
import { request, getLocales } from 'utils';
import BotModal from './BotModal';

const { default: axios } = require('axios');

class TelegramBots extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        bots: [],
        price: 0,
      },
      token: '',
      username: '',
      notice: '',
      items: [],
      actionModal: null,
      infoModal: false,
      bot: {
        type: '',
      },
      type: 'token',
      nameauto: '',
      usernameauto: '',
      name: '',
    };
    this.onChange = this.onChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this);
    this.openConfirmModal = this.openConfirmModal.bind(this);
    this.closeConfirmModal = this.closeConfirmModal.bind(this);
    this.delete = this.delete.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
    this.getData = this.getData.bind(this);
    this.sendDataAuto = this.sendDataAuto.bind(this);
    this.openConfirmAutoBot = this.openConfirmAutoBot.bind(this);
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

  onChange(e) {
    this.setState({
      loading: true,
    });
    const token = e.target.value;

    axios.get(`https://api.telegram.org/bot${token}/getMe`)
      .then((response) => {
        if (response.data.ok) {
          this.setState({
            username: response.data.result.username,
            token,
            loading: false,
          });
        } else {
          toast.error('Токен неверен');
        }
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
        toast.error('Токен неверен');
      });
  }

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'bots',
          subtype: 'telegram',
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

  openConfirmModal({ id, action }) {
    this.setState({
      deleteId: id,
      actionModal: action,
    });
  }

  closeConfirmModal() {
    this.setState({
      actionModal: null,
    });
  }

  prepareTableData() {
    const items = [];

    this.state.data.bots.forEach((item) => {
      const itemModified = {
        id: item.id,
        username: item.username,
        notice: item.notice,
        status: item.status,
      };

      items.push(itemModified);
    });

    this.setState({
      items,
    });
  }

  toggleInfo(id) {
    this.state.data.bots.map((item) => {
      if (String(item.id) === String(id)) {
        this.setState({
          bot: item,
        });
      }
    });

    this.setState({
      infoModal: !this.state.infoModal,
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
          type: 'bots',
          subtype: 'telegram',
          shop: this.props.match.params.shopId,
          id: this.state.deleteId,
          action: 'delete',
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
          this.closeConfirmModal();
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

  toggleStatus(id) {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'bots',
          subtype: 'telegram',
          shop: this.props.match.params.shopId,
          id,
          action: 'toggleStatus',
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

  openConfirmAutoBot() {
    if (!this.state.nameauto) {
      toast.error('Заполните имя бота');
      return;
    }

    if (!this.state.usernameauto) {
      toast.error('Заполните юзернейм бота');
      return;
    }

    this.openConfirmModal({ action: 'sendAuto' });
  }

  sendDataAuto() {
    this.setState({
      loading: true,
    });

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'bots',
          subtype: 'telegram',
          shop: this.props.match.params.shopId,
          name: this.state.nameauto,
          username: `${this.state.usernameauto}_bot`,
          action: 'createauto',
        },
        action: 'shops',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(body, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          this.setState({
            username: '',
            token: '',
            notice: '',
            loading: false,
            actionModal: null,
            nameauto: '',
            usernameauto: '',
          });
          toast.success(response.data.message);
          this.getData();
        } else {
          this.setState({
            loading: false,
            actionModal: null,
          });
          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  }

  sendData() {
    this.setState({
      loading: true,
    });
    if (this.state.token) {
      const data = {
        api: 'user',
        body: {
          data: {
            section: 'shop',
            type: 'bots',
            subtype: 'telegram',
            shop: this.props.match.params.shopId,
            token: this.state.token,
            notice: this.state.notice,
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
              username: '',
              token: '',
              notice: '',
              loading: false,
            });
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
    } else {
      this.setState({
        loading: false,
      });
      toast.error('Заполните поле токена');
    }
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
        title: getLocales('Юзернейм / Примечание'),
        dataIndex: '',
        key: 'operations',
        render: (e, item) => (
          <a
            target="_blank"
            href={`https://t.me/${item.username}`}
            rel="noreferrer"
          >
            {item.notice
              ? item.notice
              : (`@${item.username}`)}
          </a>
        ),
      },
      {
        title: getLocales('Статус'),
        dataIndex: '',
        key: 'operations',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        render: (e, item) => (
          <button
            type="button"
            title={String(item.status) === '1'
              ? getLocales('Отключить бота')
              : getLocales('Включить бота')}
            onClick={() => this.toggleStatus(item.id)}
            className={`btn btn-table width-100 ${item.status === 0 ? 'btn-danger' : 'btn-primary'}`}
          >
            <FontAwesomeIcon icon={item.status === 0
              ? faUnlink
              : faLink}
            />
          </button>
        ),
      },
      {
        title: getLocales('Действия'),
        dataIndex: '',
        key: 'operations',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        render: (e, item) => (
          <div className="sparkline8">
            <button
              type="button"
              onClick={() => this.toggleInfo(item.id)}
              className="btn btn-secondary btn-table"
            >
              <FontAwesomeIcon icon={faSearchPlus} />
            </button>
            <button
              type="button"
              onClick={() => this.openConfirmModal({ id: item.id, action: 'delete' })}
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
        <div className="row">
          <div className="col-lg-4">
            <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <div className="row">
                  <div className="col-lg-12">
                    <h3 className="font-m">
                      {getLocales('Добавление бота')}
                    </h3>

                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Способ добавления')}
                      </label>
                      <select
                        name="type"
                        autoComplete="off"
                        disabled={this.state.loading}
                        onChange={this.handleChange}
                        value={this.state.type}
                        className="form-control"
                      >
                        <option value="token">{getLocales('Вручную')}</option>
                        <option value="auto">{getLocales('Автоматически (платно)')}</option>
                      </select>
                    </div>

                    {this.state.type === 'token'
                      ? (
                        <>
                          <div className="form-group">
                            <label className="form-control-label font-m">
                              {getLocales('Telegram токен')}
                            </label>
                            <input
                              name="token"
                              autoComplete="off"
                              onChange={this.onChange}
                              disabled={this.state.loading}
                              value={this.state.token}
                              placeholder={getLocales('Вставьте токен Телеграм бота')}
                              className="form-control"
                            />
                            <NavLink to="/dashboard/support/faq/answers">
                              <small className="highlight pointer">
                                {getLocales('Как его получить?')}
                              </small>
                            </NavLink>
                          </div>

                          <div className="form-group">
                            <label className="form-control-label font-m">
                              {getLocales('Имя')}
                            </label>
                            <input
                              name="name"
                              autoComplete="off"
                              disabled
                              value={this.state.name === ''
                                ? getLocales('Нет информации')
                                : this.state.name}
                              className="form-control"
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-control-label font-m">
                              {getLocales('Юзернейм')}
                            </label>
                            <input
                              name="username"
                              autoComplete="off"
                              disabled
                              value={this.state.username === ''
                                ? getLocales('Нет информации')
                                : `@${this.state.username}`}
                              className="form-control"
                            />
                          </div>
                        </>
                      )
                      : (
                        <>
                          <div className="form-group">
                            <label className="form-control-label font-m">
                              {getLocales('Имя')}
                            </label>
                            <input
                              name="nameauto"
                              autoComplete="off"
                              onChange={this.handleChange}
                              disabled={this.state.loading}
                              value={this.state.nameauto}
                              placeholder={getLocales('Введите имя бота')}
                              className="form-control"
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-control-label font-m">
                              {getLocales('Юзернейм')}
                            </label>
                            <div className="input-group">
                              <span className="input-group-text">@</span>
                              <input
                                name="usernameauto"
                                autoComplete="off"
                                onChange={this.handleChange}
                                disabled={this.state.loading}
                                placeholder={getLocales('Введите юзернейм')}
                                value={this.state.usernameauto}
                                className="form-control"
                              />
                              <span className="input-group-text">_bot</span>
                            </div>
                          </div>
                        </>
                      )}

                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Примечание')}
                      </label>
                      <input
                        name="notice"
                        autoComplete="off"
                        onChange={this.handleChange}
                        placeholder={getLocales('Введите примечание')}
                        value={this.state.notice}
                        className="form-control"
                      />
                      <small>
                        {getLocales('Максимальная длина заметки - 50 символов')}
                      </small>
                    </div>

                    <button
                      type="button"
                      onClick={this.state.type === 'token'
                        ? this.sendData
                        : this.openConfirmAutoBot}
                      disabled={this.state.loading}
                      className="btn btn-primary font-m auth-btn margin-15"
                    >
                      {this.state.loading
                        ? getLocales('Загрузка...')
                        : this.state.type === 'token'
                          ? getLocales('Добавить')
                          : (`${getLocales('Приобрести за ') + this.state.data.price}$`)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <div className="row">
                  <div className="col-lg-12">
                    <h3 className="font-m">
                      {getLocales('Telegram боты')}
                    </h3>

                    {this.state.items.length > 0
                      ? (
                        <Table
                          columns={tableColumns}
                          items={this.state.items}
                          updateItems={this.updateItems}
                          rowsPerPage="5"
                        />
                      )
                      : (
                        <div className="text-center">
                          {getLocales('Боты отсутствуют')}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ModalConfirm
          action={this.state.actionModal === 'delete'
            ? getLocales('Вы действительно хотите удалить данного бота?')
            : getLocales('Вы действительно хотите добавить бота?')}
          consequences={this.state.actionModal === 'sendAuto'
            && getLocales('Средства спишутся единоразово и не подлежат возврату')}
          modal={!!this.state.actionModal}
          toggle={this.closeConfirmModal}
          loading={this.state.loading}
          sendData={this.state.actionModal === 'delete'
            ? this.delete
            : this.sendDataAuto}
        />

        <BotModal
          loadData={this.getData}
          modal={this.state.infoModal}
          toggle={this.toggleInfo}
          bot={this.state.bot}
          shopId={this.props.match.params.shopId}
        />
      </>
    );
  }
}

export default TelegramBots;
