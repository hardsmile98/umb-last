/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { NavLink, Route } from 'react-router-dom';
import { request, getLocales } from 'utils';
import FeedbackDialogue from './Dialogue';

let interval = '';

class FeedbackChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        chats: [],
        fullLength: 0,
      },
      listType: 'min',
    };
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
    interval = setInterval(this.getData, 10000);
  }

  componentWillUnmount() {
    clearInterval(interval);
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
          action: 'get',
          listType: this.state.listType,
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
      <div className="row">
        <div className="col-lg-3">
          <div className={`block animate__animated animate__fadeIn chats-block-list ${this.state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <h3 className="font-m">
                {getLocales('Чаты')}
              </h3>

              {this.state.data.chats.length <= 0
                ? (
                  <div className="text-center font-m">
                    {getLocales('Чаты отсутствуют')}
                  </div>
                )
                : this.state.data.chats.map((chat) => (
                  <NavLink
                    to={`/dashboard/shops/${this.props.match.params.shopId}/feedback/chats/${chat.id}`}
                    activeClassName="activeChat"
                  >
                    <div className={`avatar-block chat-block ${chat.readed === 0 ? 'unreaded' : ''}`}>
                      {chat.message
                        ? (
                          <div className="text-left">
                            <span className="font-m">
                              <b>
                                {chat.message.typeof === 'user'
                                  ? (`${chat.username}:`)
                                  : <>{getLocales('Оператор:')}</>}

                              </b>
                              {' '}
                              {chat.message.message}
                            </span>
                          </div>
                        )
                        : ''}
                      <div className="text-right font-m pad-time-chat">
                        <span>{moment.unix(chat.last / 1000).format('LLL')}</span>
                      </div>
                    </div>
                  </NavLink>
                ))}

              {this.state.data.fullLength > this.state.data.chats.length ? (
                <button
                  type="button"
                  onClick={() => {
                    this.setState({
                      listType: 'all',
                      loading: true,
                    }, () => {
                      this.getData();
                    });
                  }}
                  className="btn btn-secondary font-m auth-btn"
                >
                  {getLocales('Загрузить все чаты')}
                </button>
              ) : ''}
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <Route path={`${this.props.match.path}/:chatId`} component={FeedbackDialogue} />
          <Route
            exact
            path={`${this.props.match.path}/`}
            render={() => (
              <div className="block animate__animated animate__fadeIn dialogue-not-set ">
                <div className="block-body">
                  <div className="avatar-block text-center">
                    <h1 className="font-m">
                      {getLocales('Выберите чат, в который хотите написать')}
                    </h1>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    );
  }
}

export default FeedbackChats;
