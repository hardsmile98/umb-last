import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { Component } from 'react';
import {
  NavLink, Route,
} from 'react-router-dom';
import { toast } from 'react-toastify';

import { request } from 'utils';
import Dialogue from './Dialogue';

let interval = '';

class AdminChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        chats: [],
      },
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
        action: 'admin',
        data: {
          section: 'chats',
          type: 'get',
        },
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
    const { state, props } = this;

    return (
      <div className="row">
        <div className="col-lg-3">
          <div className={`block animate__animated animate__fadeIn chats-block-list ${state.loading ? 'blur' : ''}`}>
            <div className="block-body">
              <h3 className="font-m">
                Чаты
              </h3>

              {state.data.chats.length === 0
                ? (
                  <div className="text-center font-m">
                    Чаты отсутствуют
                  </div>
                )
                : state.data.chats.map((chat) => (
                  <NavLink
                    to={`/dashboard/manage/chats/${chat.id}`}
                    activeClassName="activeChat"
                  >
                    <div className={`avatar-block chat-block ${chat.typeof === 'user' ? 'unreaded' : ''}`}>
                      {chat.ownerLogin}
                      {' '}
                      {!!chat.premium && <FontAwesomeIcon icon={faStar} />}

                      <div className="text-left">
                        <span className="font-m">
                          <b>
                            {chat.typeof === 'user' ? (
                              <>
                                <span className="text-danger">•</span>
                                {' '}
                                {`${chat.message.user}:`}
                              </>
                            ) : 'Поддержка:'}
                          </b>
                          {' '}
                          {chat.message.value}
                        </span>
                      </div>

                      <div className="text-right font-m pad-time-chat">
                        <span>
                          {moment.unix(chat.last / 1000).format('LLL')}
                        </span>
                      </div>
                    </div>
                  </NavLink>
                ))}
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <Route path={`${props.match.path}/:chatId`} component={Dialogue} />
          <Route
            exact
            path={`${props.match.path}/`}
            render={() => (
              <div className="block animate__animated animate__fadeIn dialogue-not-set ">
                <div className="block-body">
                  <div className="avatar-block text-center">
                    <h1 className="font-m">
                      Выберите чат, в который хотите написать
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

export default AdminChats;
