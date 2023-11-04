/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-deprecated */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { ModalConfirm } from 'components';
import { request, getLocales } from 'utils';

let interval = '';

class FeedbackDialogue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        chat: {
          messages: [],
          user: {},
        },
      },
      message: '',
      chatId: '',
      modal: false,
    };

    this.getData = this.getData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.send = this.send.bind(this);
    this.block = this.block.bind(this);
    this.toggle = this.toggle.bind(this);
    this.delete = this.delete.bind(this);
    this.readed = this.readed.bind(this);
  }

  componentDidMount() {
    this.setState({
      chatId: this.props.match.params.chatId,
    }, () => {
      this.getData();
      interval = setInterval(this.getData, 1000);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.chatId !== nextProps.match.params.chatId) {
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
    const value = e.target[e.target.type === 'checkbox' ? 'checked' : 'value'];
    const { name } = e.target;

    this.setState({
      [name]: value,
    });
  }

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'feedback',
          subtype: 'chats',
          shop: this.props.match.params.shopId,
          action: 'getChat',
          id: this.props.match.params.chatId,
        },
        action: 'shops',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
      signal: 1000,
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          if (response.data.data.chat.id === this.state.chatId) {
            const last = this.state.data;
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

  toggle() {
    this.setState({
      modal: !this.state.modal,
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
          type: 'feedback',
          subtype: 'chats',
          shop: this.props.match.params.shopId,
          action: 'delete',
          id: this.state.chatId,
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
          this.props.history.push(`/dashboard/shops/${this.props.match.params.shopId}/feedback/chats`);
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

  readed() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'feedback',
          subtype: 'chats',
          shop: this.props.match.params.shopId,
          action: 'setReaded',
          id: this.state.chatId,
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

  send() {
    if (this.state.message.length > 0) {
      this.setState({
        loading: true,
      });
      const data = {
        api: 'user',
        body: {
          data: {
            section: 'shop',
            type: 'feedback',
            subtype: 'chats',
            shop: this.props.match.params.shopId,
            action: 'send',
            id: this.state.chatId,
            message: this.state.message,
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

  block() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'feedback',
          subtype: 'chats',
          shop: this.props.match.params.shopId,
          action: 'blockAction',
          id: this.props.match.params.chatId,
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

  scrollToBottom() {
    const messagesContainer = ReactDOM.findDOMNode(this.el);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-8">
          <div className={`block animate__animated animate__fadeIn chats-block-list ${this.state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <h3 className="font-m chat-delete-chat">
                {getLocales('Чат')}
                {' '}
                {this.state.data.chat.readed === 0 ? (
                  <span>
                    |
                    <a aria-hidden onClick={this.readed}>
                      {getLocales('Отметить прочитанным')}
                    </a>
                  </span>
                ) : ''}
                {' '}
                <span
                  aria-hidden
                  className="text-danger right pointer"
                  onClick={this.toggle}
                >
                  {getLocales('Удалить чат')}
                </span>
              </h3>

              <div className="shop-chat-bottom">
                <div
                  className="messages-block chat"
                  ref={(el) => {
                    this.el = el;
                  }}
                >
                  {this.state.data.chat.messages.length > 0
                    ? this.state.data.chat.messages.map((message) => (
                      <div className={`message-block font-m chat ${message.typeof === 'user' ? 'admin' : 'user'}`}>
                        <div className="bold message-name">
                          {message.typeof === 'user'
                            ? this.state.data.chat.user.name
                            : message.name}
                        </div>
                        <div className="message-content">
                          <p>
                            {message.message}
                          </p>
                        </div>
                        <div className="message-date text-right">
                          {moment.unix(message.date / 1000).format('LLL')}
                        </div>
                      </div>
                    ))
                    : (
                      <div className="text-center font-m">
                        {getLocales('Сообщения отсутствуют')}
                      </div>
                    )}
                </div>

                <div className="">
                  <div className="form-group message-area">
                    <label htmlFor="message" className="font-m">
                      {getLocales('Сообщение')}
                    </label>
                    <textarea
                      name="message"
                      value={this.state.message}
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
                      disabled={this.state.loading}
                      className="btn btn-primary right font-m auth-btn"
                    >
                      {this.state.loading
                        ? getLocales('Загрузка...')
                        : getLocales('Отправить сообщение')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className={`block animate__animated animate__fadeIn chats-block-list ${this.state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <h3 className="font-m">
                {getLocales('Пользователь')}
              </h3>

              <div className="row">
                <div className="col-lg-12">
                  <div className="text-center flex-center">
                    <div className="avatar dialogue-chat">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Имя')}
                    </label>
                    <div className="input-group">
                      <input disabled value={this.state.data.chat.user.name} className="form-control" />
                      <NavLink to={`/dashboard/shops/${this.props.match.params.shopId}/datas/users/${this.state.data.chat.user.id}`}>
                        <span className="input-group-text">
                          {getLocales('Перейти в профиль')}
                        </span>
                      </NavLink>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Юзернейм')}
                    </label>
                    <input
                      disabled
                      value={this.state.data.chat.user.username
                        ? this.state.data.chat.user.username
                        : getLocales('Отсутствует')}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Кол-во покупок')}
                    </label>
                    <input
                      disabled
                      value={this.state.data.chat.user.purchases}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Сумма покупок')}
                    </label>
                    <div className="input-group">
                      <input
                        disabled
                        value={this.state.data.chat.user.purchasesSum}
                        className="form-control"
                      />
                      <span className="input-group-text">
                        {this.state.data.currency}
                      </span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Заметка')}
                    </label>
                    <input
                      disabled
                      value={this.state.data.chat.user.notice}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  {this.state.data.chat.user.block === 0
                    ? (
                      <button
                        type="button"
                        onClick={this.block}
                        className="btn btn-danger auth-btn font-m"
                      >
                        {getLocales('Заблокировать')}
                      </button>
                    )
                    : (
                      <button
                        type="button"
                        onClick={this.block}
                        className="btn btn-secondary auth-btn font-m"
                      >
                        {getLocales('Разблокировать')}
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalConfirm action={getLocales('Вы действительно хотите удалить данный чат и все сообщения в нем?')} consequences="" modal={this.state.modal} toggle={this.toggle} loading={this.state.loading} sendData={this.delete} />
      </div>
    );
  }
}

export default FeedbackDialogue;
