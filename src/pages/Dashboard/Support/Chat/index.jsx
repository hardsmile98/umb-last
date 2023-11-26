/* eslint-disable react/no-danger */
/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import moment from 'moment';
import renderHTML from 'react-render-html';

import { request, getLocales } from 'utils';

let interval;

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        messages: [],
      },
      message: '',
      loading: true,
    };
    this.getData = this.getData.bind(this);
    this.sendData = this.sendData.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getData(() => {
      this.scrollToBottom();
    });

    interval = setInterval(() => {
      this.getData(() => { });
    }, 5000);
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

  getData(callback) {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'chat',
          type: 'get',
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
            data: response.data.data,
            loading: false,
          }, () => {
            callback(true);
          });
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
    const { state } = this;

    if (state.message) {
      this.setState({
        loading: true,
      });

      const data = {
        api: 'user',
        body: {
          data: {
            section: 'chat',
            type: 'send',
            text: state.message,
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

  render() {
    const { state } = this;

    return (
      <div className="row">
        <div className="col-lg-8">
          <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <h4 className="font-m">
                {getLocales('Чат с командой поддержки')}
              </h4>

              <div
                className="messages-block chat"
                ref={(el) => {
                  this.el = el;
                }}
              >
                {state.data.messages.length > 0
                  ? state.data.messages.map((message) => (
                    <div className={`message-block font-m chat ${message.admin ? 'admin' : 'user'}`}>
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

                      {message.user.indexOf('стажёр') > -1 && (
                      <div className="avatar-block font-m">
                        <FontAwesomeIcon icon={faBolt} />
                        {' '}
                        <b>
                          Ни при каких условиях не передавайте данному сотруднику данные
                          Вашей учетной записи, АПИ токены и другую компроментирующую информацию.
                        </b>
                      </div>
                      )}
                    </div>
                  ))
                  : (
                    <div className="message-block font-m admin chat">
                      <div className="bold message-name">
                        System
                      </div>

                      <div className="message-content">
                        <p dangerouslySetInnerHTML={{
                          __html: getLocales('Доброго времени суток. Перед обращением в поддержку рекомендуем ознакомиться с инструкциями в базе знаний.<br/><br/>Наша команда поддержки работает 24/7, но ночью время ответа может составлять дольше обычного. Чем можем Вам помочь?'),
                        }}
                        />
                      </div>

                      <div className="message-date text-right">
                        {getLocales('сейчас')}
                      </div>
                    </div>
                  )}
              </div>

              <div>
                <div className="form-group message-area">
                  <label
                    htmlFor="message"
                    className="font-m"
                  >
                    {getLocales('Сообщение')}
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
                    onClick={this.sendData}
                    disabled={state.loading}
                    className="btn btn-primary right font-m auth-btn"
                  >
                    {state.loading
                      ? getLocales('Загрузка...')
                      : getLocales('Отправить сообщение')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <h4 className="font-m">
                {getLocales('Памятка')}
              </h4>

              <div className="avatar-block notice-chat">
                {getLocales('Ни при каких условиях')}
                {' '}
                <span className="text-danger">{getLocales('не сообщайте')}</span>
                {' '}
                {getLocales('никому, в том числе нашей команде технической поддержки конфиденциальные данные Вашего аккаунта.')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
