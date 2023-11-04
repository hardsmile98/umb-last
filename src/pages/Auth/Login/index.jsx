import React, { Component } from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { request, getLocales } from 'utils';
import logo from 'assets/images/logo.png';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      code: 0,
      loading: false,
      needCode: false,
      action: 'one',
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
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

  sendData() {
    const { state, props } = this;

    this.setState({
      loading: true,
    });

    this.checkData((result) => {
      if (result) {
        const data = {
          api: 'authorization',
          body: {
            data: {
              login: state.login,
              password: state.password,
              code: state.code,
            },
            action: state.action,
          },
          headers: state.needCode
            ? { authorization: localStorage.getItem('token') }
            : '',
        };

        request(data, (response) => {
          if (response.status === 200) {
            if (response.data.success) {
              toast.success(response.data.message);
              localStorage.setItem('token', response.data.data.token);

              if (response.data.data.needCode) {
                this.setState({
                  needCode: true,
                  loading: false,
                  action: 'two',
                });
              } else {
                this.setState({
                  loading: false,
                });

                localStorage.setItem('theme', response.data.data.theme);

                if (localStorage.getItem('lang') !== response.data.data.lang) {
                  localStorage.setItem('lang', response.data.data.lang);
                  this.forceUpdate();
                }

                props.history.push('/dashboard');
              }
            } else {
              this.setState({
                loading: false,
              });

              toast.error(response.data.message);
            }
          } else {
            this.setState({
              loading: false,
            });

            toast.error('Сервер недоступен');
          }
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  }

  checkData(callback) {
    const { state } = this;

    if (state.login.length > 3) {
      if (state.password.length > 5) {
        if (state.code || !state.needCode) {
          callback(true);
        } else {
          toast.error(getLocales('Заполните поле кода подтверждения'));
        }
      } else {
        toast.error(getLocales('Неверный пароль'));
        callback(false);
      }
    } else {
      toast.error(getLocales('Заполните поле логина'));
      callback(false);
    }
  }

  render() {
    const { state } = this;

    return (
      <>
        <div className="text-center">
          <img className="logotype-auth" src={logo} alt="umbrella" />

          <br />

          <h3 className="font-g">
            {getLocales('АВТОРИЗАЦИЯ')}
          </h3>

          <p className="font-m">
            {getLocales('Введите данные Вашей учетной записи')}
          </p>
        </div>

        <div className="block auth-block animate__animated animate__fadeIn">
          <div className="block-body">
            <div className="form-group">
              <label
                htmlFor="login"
                className="form-control-label font-m"
              >
                {getLocales('Логин')}
              </label>

              <input
                autoComplete="off"
                id="login"
                disabled={state.loading || state.needCode}
                type="text"
                name="login"
                onChange={this.handleChange}
                placeholder={getLocales('Введите логин')}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="password"
                className="form-control-label font-m"
              >
                {getLocales('Пароль')}
              </label>
              <input
                id="password"
                disabled={state.loading || state.needCode}
                autoComplete="off"
                name="password"
                onChange={this.handleChange}
                placeholder={getLocales('Введите пароль')}
                type="password"
                className="form-control"
              />
            </div>

            {state.needCode && (
              <div className="form-group">
                <label
                  htmlFor="code"
                  className="form-control-label font-m"
                >
                  {getLocales('Код подтверждения')}
                </label>
                <input
                  id="code"
                  autoComplete="off"
                  disabled={state.loading}
                  type="number"
                  name="code"
                  onChange={this.handleChange}
                  placeholder={getLocales('Введите код подтверждения')}
                  className="form-control"
                />
              </div>
            )}

            <div className="row">
              <div className="col-lg-6">
                <button
                  type="button"
                  value="Войти"
                  className="btn btn-primary font-g auth-btn"
                  onClick={this.sendData}
                  disabled={state.loading}
                >
                  {state.loading
                    ? (
                      <>
                        {getLocales('Загрузка...')}
                      </>
                    )
                    : (
                      <span className="font-g">
                        <FontAwesomeIcon icon={faUser} />
                        {' '}
                        {getLocales('ВОЙТИ')}
                      </span>
                    )}
                </button>
              </div>

              <div className="col-lg-6">
                <NavLink to="/security/registration">
                  <button
                    type="button"
                    value="Регистрация"
                    className="btn btn-secondary right font-g auth-btn"
                  >
                    {getLocales('Регистрация')}
                  </button>
                </NavLink>
              </div>

              <br />

              <div className="col-lg-12 text-center recovery">
                <NavLink className="font-m" to="/security/recovery">
                  {getLocales('Забыли пароль?')}
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Login;
