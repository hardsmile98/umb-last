import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { request, getLocales } from 'utils';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        user: {
          login: 'test',
          comission: 3,
          shopLimit: 1,
          regdate: Date.now(),
          twoAuth: 'telegram',
          notifications: {},
          theme: 'default',
        },
        notifications: [],
      },
      loading: true,
    };

    this.getData = this.getData.bind(this);
    this.notifyUpdate = this.notifyUpdate.bind(this);
    this.changeStyle = this.changeStyle.bind(this);
    this.changeLang = this.changeLang.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'settings',
          type: 'get',
        },
        action: 'profile',
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
            theme: response.data.data.user.theme,
            lang: response.data.data.user.lang,
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

  changeStyle(e) {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'settings',
          type: 'changeStyle',
          style: e.target.value,
        },
        action: 'profile',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          localStorage.setItem('theme', e.target.value);

          this.getData();

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

  changeLang(e) {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'settings',
          type: 'changeLang',
          lang: e.target.value,
        },
        action: 'profile',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          localStorage.setItem('lang', e.target.value);
          this.forceUpdate();
          this.getData();
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

  notifyUpdate(e) {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'settings',
          type: 'set',
          name: e.target.name,
        },
        action: 'profile',
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

  render() {
    const { state } = this;

    return (
      <>
        <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="font-m">
                  {getLocales('Информация об аккаунте')}
                </h3>
                <br />
              </div>

              <div className="col-lg-6">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Имя пользователя')}
                  </label>
                  <input
                    value={state.data.user.login}
                    disabled
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Дата регистрации')}
                  </label>
                  <input
                    value={moment.unix(state.data.user.regdate / 1000).format('LLL')}
                    disabled
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Комиссия системы')}
                  </label>
                  <input
                    value={`${state.data.user.comission}%`}
                    disabled
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Лимит магазинов')}
                  </label>
                  <input
                    value={`${state.data.user.shopLimit} ${getLocales('шт.')}`}
                    disabled
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="font-m">
                  {getLocales('Настройки')}
                </h3>
              </div>

              <div className="col-lg-6">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Тема панели')}
                  </label>
                  <select
                    disabled={state.loading}
                    value={state.theme}
                    onChange={this.changeStyle}
                    name="theme"
                    className="form-control"
                  >
                    <option value="default">
                      {getLocales('Светлая')}
                    </option>
                    <option value="dark">
                      {getLocales('Тёмная')}
                    </option>
                  </select>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Язык интерфейса')}
                  </label>
                  <select
                    disabled={state.loading}
                    value={state.lang}
                    onChange={this.changeLang}
                    name="lang"
                    className="form-control"
                  >
                    <option value="RU">Русский</option>
                    <option value="UA">Український</option>
                    <option value="EN">English</option>
                    <option value="ES">Español</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {state.data.user.twoAuth === 'none' && (
          <div className="block animate__animated animate__fadeIn">
            <div className="text-center font-m">
              {getLocales('Для настройки уведомлений Вам необходимо подключить двухфакторную аутентификацию в разделе')}
              {' '}
              <Link to="/dashboard/profile/security">
                {getLocales('безопасность')}
              </Link>
            </div>
          </div>
        )}

        <div className={`block animate__animated animate__fadeIn ${(state.loading || state.data.user.twoAuth === 'none') ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="font-m">
                  {getLocales('Уведомления от Telegram бота')}
                </h3>
              </div>

              {state.data.notifications.map((item) => (
                <div className="col-lg-6">
                  <div className="avatar-block">
                    <h2 className="font-m">
                      {getLocales(item.label)}
                    </h2>

                    {item.items.map((notification) => (
                      <div className="i-checks">
                        <input
                          name={notification.name}
                          checked={!!state.data.user.notifications[notification.name]}
                          onClick={this.notifyUpdate}
                          id={notification.name}
                          type="checkbox"
                          className="checkbox-template"
                        />
                        <label
                          htmlFor={notification.name}
                          className="checkbox-label font-m"
                        >
                          {getLocales(notification.label)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Settings;
