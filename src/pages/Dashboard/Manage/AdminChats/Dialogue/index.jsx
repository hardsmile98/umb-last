/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-deprecated */
/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSearchPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

import { getLocales, request } from 'utils';
import ModalOrder from './ModalOrder';

let interval = '';

class Dialogue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: {
        chat: {
          messages: [],
          user: {
            balance: 0,
          },
          shops: [],
        },
      },
      message: '',
      chatId: '',
      order: '',
      orderInfo: {
        purchase: {},
        deposit: {},
      },
      modal: false,
      password: '',
    };
    this.getData = this.getData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.send = this.send.bind(this);
    this.block = this.block.bind(this);
    this.setOk = this.setOk.bind(this);
    this.changeContent = this.changeContent.bind(this);
    this.orderSearch = this.orderSearch.bind(this);
    this.toggle = this.toggle.bind(this);
    this.orderSearch = this.orderSearch.bind(this);
    this.setPayedOrder = this.setPayedOrder.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  componentDidMount() {
    const { props } = this;

    this.setState({
      chatId: props.match.params.chatId,
    }, () => {
      this.getData();

      interval = setInterval(this.getData, 1000);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;

    if (props.match.params.chatId !== nextProps.match.params.chatId) {
      clearInterval(interval);

      this.setState({
        loading: true,
        chatId: nextProps.match.params.chatId,
      }, () => {
        this.getData();
      });
    }
  }

  componentWillUnmount() {
    clearInterval(interval);
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

  getData() {
    const { state } = this;

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'chats',
          type: 'getChat',
          id: state.chatId,
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
          if (String(response.data.data.chat.id) === String(state.chatId)) {
            const last = state.data;

            this.setState({
              data: response.data.data,
              loading: false,
            }, () => {
              if (JSON.stringify(last) !== JSON.stringify(response.data.data)) {
                this.scrollToBottom();
              }
            });
          }
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

  setPayedOrder(id) {
    const { state } = this;

    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'chats',
          type: 'setPayedOrder',
          id,
          password: state.password,
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
          this.toggle();
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

  setOk() {
    const { state } = this;

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'chats',
          type: 'setOk',
          id: state.chatId,
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
          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  }

  send() {
    const { state } = this;

    if (state.message.length > 0) {
      this.setState({
        loading: true,
      });

      const data = {
        api: 'user',
        body: {
          data: {
            section: 'chats',
            type: 'send',
            id: state.chatId,
            text: state.message,
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
            this.setState({
              message: '',
            });

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
      toast.error('Сообщение слишком короткое');
    }
  }

  orderSearch(id) {
    const { state } = this;

    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'chats',
          type: 'order',
          id: state.order,
          uniqueId: id,
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
          this.setState({
            orderInfo: response.data.data,
          }, () => {
            this.toggle();
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

  block() {
    const { state } = this;

    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'chats',
          type: 'blockAction',
          id: state.chatId,
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

  changeContent(v) {
    this.setState({
      message: v,
    });
  }

  toggle() {
    const { state } = this;

    this.setState({
      modal: !state.modal,
    });
  }

  deleteMessage(id) {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'chats',
          type: 'deleteMessage',
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

  scrollToBottom() {
    const messagesContainer = ReactDOM.findDOMNode(this.el);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  render() {
    const { state } = this;

    return (
      <>
        <div className="row">
          <div className="col-lg-8">
            <div className={`block animate__animated animate__fadeIn chats-block-list ${state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h3 className="font-m">
                  {'Чат '}
                  <span
                    aria-hidden
                    className="right font-m pointer"
                    onClick={this.setOk}
                  >
                    Пометить решенным
                  </span>
                </h3>

                <div className="shop-chat-bottom">
                  <div
                    className="messages-block chat"
                    ref={(el) => {
                      this.el = el;
                    }}
                  >
                    {state.data.chat.messages.length > 0
                      ? state.data.chat.messages.map((message) => (
                        <div className={`message-block font-m chat ${String(message.admin) === '0' ? 'admin' : 'user'}`}>
                          <div className="bold message-name">
                            {message.user}
                          </div>

                          <div className="message-content">
                            <p>
                              {message.value}
                            </p>
                          </div>

                          <div className="message-date text-right">
                            <a
                              aria-hidden
                              className="left"
                              onClick={() => this.deleteMessage(message.id)}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </a>
                            {moment.unix(message.date / 1000).format('LLL')}
                          </div>
                        </div>
                      ))
                      : (
                        <div className="text-center font-m">
                          Сообщения отсутствуют
                        </div>
                      )}
                  </div>
                  <div className="">
                    <div className="form-group">
                      <label
                        htmlFor="message"
                        className="font-m"
                      >
                        Сообщение
                      </label>
                      <textarea
                        name="message"
                        value={state.message}
                        onChange={this.handleChange}
                        className="form-control"
                        placeholder={getLocales('Введите сообщение')}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-3" />

                    <div className="col-lg-3" />

                    <div className="col-lg-6">
                      <button
                        type="button"
                        onClick={this.send}
                        disabled={state.loading}
                        className="btn btn-primary right font-m auth-btn"
                      >
                        {state.loading
                          ? 'Загрузка...'
                          : 'Отправить сообщение'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className={`block animate__animated animate__fadeIn chats-block-list ${state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h3 className="font-m">
                  Пользователь
                </h3>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        Логин
                      </label>
                      <div className="input-group">
                        <input
                          disabled
                          value={state.data.chat.user.login}
                          className="form-control"
                        />
                        <NavLink
                          to={`/dashboard/manage/datas/users/${state.data.chat.user.id}`}
                        >
                          <span className="input-group-text">
                            Перейти в профиль
                          </span>
                        </NavLink>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        Баланс
                      </label>
                      <div className="input-group">
                        <input
                          disabled
                          value={state.data.chat.user.balance.toFixed(8)}
                          className="form-control"
                        />
                        <span className="input-group-text">
                          BTC
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        Комиссия
                      </label>
                      <div className="input-group">
                        <input
                          disabled
                          value={state.data.chat.user.comission}
                          className="form-control"
                        />
                        <span className="input-group-text">
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        Зарегистрирован
                      </label>
                      <input
                        disabled
                        value={moment.unix(state.data.chat.user.regdate / 1000).format('LLL')}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        Заметка
                      </label>
                      <input
                        disabled
                        value={state.data.chat.user.notice}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    {String(state.data.chat.user.block) === '0'
                      ? (
                        <button
                          type="button"
                          onClick={this.block}
                          className="btn btn-danger auth-btn font-m"
                        >
                          Закрыть доступ к поддержке
                        </button>
                      )
                      : (
                        <button
                          type="button"
                          onClick={this.block}
                          className="btn btn-secondary auth-btn font-m"
                        >
                          Открыть доступ к поддержке
                        </button>
                      )}

                    <h3 className="font-m margin-15">
                      Магазины
                    </h3>

                    {state.data.chat.shops.length <= 0
                      ? (
                        <div className="font-m text-center">
                          Магазинов нет
                        </div>
                      )
                      : state.data.chat.shops.map((item) => (
                        <>
                          <div className="input-group">
                            <input
                              disabled
                              value={item.domain}
                              className="form-control"
                            />
                            <NavLink to={`/dashboard/shops/${item.uniqueId}`}>
                              <span className="input-group-text">
                                <FontAwesomeIcon icon={faSearchPlus} />
                              </span>
                            </NavLink>
                          </div>

                          <div className="form-group">
                            <label className="form-control-label font-m">
                              Поиск заказа
                            </label>
                            <div className="input-group">
                              <input
                                name="order"
                                onChange={this.handleChange}
                                value={state.order}
                                className="form-control"
                              />
                              <span
                                aria-hidden
                                onClick={() => this.orderSearch(item.uniqueId)}
                                className="input-group-text pointer"
                              >
                                <FontAwesomeIcon icon={faSearch} />
                              </span>
                            </div>
                          </div>
                        </>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ModalOrder
          setPayedOrder={this.setPayedOrder}
          password={state.password}
          handleChange={this.handleChange}
          modal={state.modal}
          toggle={this.toggle}
          order={state.orderInfo}
        />
      </>
    );
  }
}

export default Dialogue;
