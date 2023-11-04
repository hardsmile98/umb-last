/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import renderHTML from 'react-render-html';
import { request } from 'utils';

let interval;

class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        ticket: {
          direction: 'support',
          category: 'generalIssues',
          messages: [],
          status: 0,
        },
        directions: {
          support: {
            name: 'Поддержка пользователей',
          },
        },
        categories: {
          generalIssues: {
            title: 'Вопросы по функционалу',
          },
        },
        user: {
          type: 'user',
        },
      },
      message: '',
      loading: true,
    };
    this.getData = this.getData.bind(this);
    this.sendData = this.sendData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeDirection = this.changeDirection.bind(this);
    this.closeTicket = this.closeTicket.bind(this);
  }

  componentDidMount() {
    this.getData(() => {
      this.scrollToBottom();
    });

    interval = setInterval(() => {
      this.getData(() => { });
    }, 1000);
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

  getData(callback) {
    const { state, props } = this;

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'tickets',
          type: 'ticket',
          id: props.match.params.id,
        },
        action: 'support',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          if (JSON.stringify(
            state.data.ticket.messages,
          ) !== JSON.stringify(
            response.data.data.ticket.messages,
          )) {
            this.setState({
              data: response.data.data,
              loading: false,
            }, () => {
              this.scrollToBottom();

              callback(true);
            });
          } else {
            this.setState({
              data: response.data.data,
              loading: false,
            }, () => {
              callback(true);
            });
          }
        } else {
          this.setState({
            loading: false,
          }, () => {
            callback(true);
          });

          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  }

  sendData() {
    const { state, props } = this;

    if (state.message) {
      this.setState({
        loading: true,
      });

      const data = {
        api: 'user',
        body: {
          data: {
            section: 'tickets',
            type: 'reply',
            id: props.match.params.id,
            message: state.message,
          },
          action: 'support',
        },
        headers: {
          authorization: localStorage.getItem('token'),
        },
      };

      request(data, (response) => {
        if (response.status === 200) {
          if (response.data.success) {
            this.setState({
              loading: false,
              message: '',
            });

            this.getData(() => {
              this.scrollToBottom();
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
    } else {
      toast.error('Вы не ввели сообщение');
    }
  }

  scrollToBottom() {
    const messagesContainer = ReactDOM.findDOMNode(this.el);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  changeDirection(e) {
    const { props } = this;

    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'tickets',
          type: 'changeDirection',
          id: props.match.params.id,
          direction: e.target.value,
        },
        action: 'support',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          this.setState({
            loading: false,
          });

          this.getData(() => {
            this.scrollToBottom();
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

  closeTicket() {
    const { props } = this;

    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'tickets',
          type: 'close',
          id: props.match.params.id,
        },
        action: 'support',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          this.setState({
            loading: false,
          });

          props.history.push('/dashboard/support/tickets');
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
    const { state } = this;

    return (
      <div className="row">
        <div className="col-lg-8">
          <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <h4 className="font-m">
                {state.data.ticket.theme}
              </h4>

              <div
                className="messages-block"
                ref={(el) => {
                  this.el = el;
                }}
              >
                {state.data.ticket.messages.map((message) => (
                  <div className="message-block font-m">
                    <div className="bold message-name">
                      {message.user}
                    </div>

                    <div className="message-content">
                      <p>
                        {renderHTML(message.value)}
                      </p>
                    </div>

                    <div className="message-date text-right">
                      {moment.unix(message.date / 1000).format('LLL')}

                    </div>
                  </div>
                ))}
              </div>

              <div className={state.data.ticket.status > -1 ? '' : 'blur'}>
                <div className="form-group message-area">
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
                    placeholder="Введите сообщение"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-3">
                  <NavLink to="/dashboard/support/tickets">
                    <button
                      type="button"
                      className="btn btn-secondary font-m auth-btn"
                    >
                      Назад
                    </button>
                  </NavLink>
                </div>

                <div className="col-lg-3" />

                <div className="col-lg-6">
                  <button
                    type="button"
                    onClick={this.sendData}
                    disabled={state.loading || state.data.ticket.status < 0}
                    className="btn btn-primary right font-m auth-btn"
                  >
                    {state.loading ? 'Загрузка...' : 'Отправить сообщение'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {state.data.user.type !== 'user'
            ? (
              <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
                <div className="block-body">
                  <h4 className="font-m">
                    Настройки обращения
                  </h4>

                  <br />

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      Категория
                    </label>
                    <input
                      disabled
                      value={state.data.categories[state.data.ticket.category].title}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      Направление
                    </label>
                    <select
                      disabled={state.loading || state.data.ticket.status === -1}
                      onChange={this.changeDirection}
                      value={state.data.ticket.direction}
                      className="form-control"
                    >
                      {Object.entries(state.data.directions)
                        .map((direction) => (
                          <option
                            value={direction[0]}
                          >
                            {direction[1].name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    disabled={state.data.ticket.status === -1}
                    onClick={this.closeTicket}
                    className="btn btn-danger fullwidth font-m auth-btn"
                  >
                    Закрыть обращение
                  </button>
                </div>
              </div>
            )
            : (
              <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
                <div className="block-body">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      Категория
                    </label>
                    <input
                      disabled
                      value={state.data.categories[state.data.ticket.category].title}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-control-label font-m">
                      Направление
                    </label>
                    <input
                      disabled
                      value={state.data.directions[state.data.ticket.direction].name}
                      className="form-control"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={state.data.ticket.status === -1}
                    onClick={this.closeTicket}
                    className="btn btn-danger fullwidth font-m auth-btn"
                  >
                    Закрыть обращение
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default Ticket;
