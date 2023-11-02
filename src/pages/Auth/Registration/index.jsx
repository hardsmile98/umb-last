import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import HCaptcha from '@hcaptcha/react-hcaptcha';

import { captchaKey } from 'variables';
import { request, getLocales } from 'utils';
import logo from 'assets/images/logo.png';

class Regisration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      repeatPassword: '',
      secret: '',
      loading: false,
      token: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox' ? 'checked' : 'value'];
    const { name } = e.target;

    this.setState({
      [name]: value,
    });
  }

  sendData() {
    const { props, state } = this;

    this.setState({
      loading: true,
    });

    this.checkData((result) => {
      if (result) {
        const data = {
          api: 'registration',
          body: {
            data: {
              login: state.login,
              password: state.password,
              secret: state.secret,
              token: state.token,
              lang: localStorage.getItem('lang'),
            },
            action: 'one',
          },
          headers: {
            authorization: 'none',
          },
        };

        request(data, (response) => {
          if (response.status === 200) {
            if (response.data.success) {
              toast.success(response.data.message);

              data.api = 'authorization';

              request(data, (res) => {
                if (res.status === 200) {
                  if (res.data.success) {
                    this.setState({
                      loading: false,
                    });

                    localStorage.setItem('token', res.data.data.token);

                    props.history.push('/dashboard');
                  } else {
                    toast.error(res.data.message);
                  }
                }
              });
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

    if (state.loading.length < 4) {
      toast.error(getLocales('Минимальная длина логина - 4 символа'));
      callback(false);
      return;
    }

    if (state.password.length < 6) {
      toast.error(getLocales('Минимальная длина пароля - 6 символов'));
      callback(false);
      return;
    }

    if (state.password !== state.repeatPassword) {
      toast.error(getLocales('Пароли не совпадают'));
      callback(false);
      return;
    }

    if (state.secret.length < 3) {
      toast.error(getLocales('Минимальная длина секретной фразы - 3 символа'));
      callback(false);
      return;
    }

    callback(true);
  }

  render() {
    const { state } = this;

    return (
      <>
        <div className="text-center">
          <img className="logotype-auth" src={logo} alt="umbrella" />

          <br />

          <h3 className="font-g">
            {getLocales('РЕГИСТРАЦИЯ')}
          </h3>

          <p className="font-m">
            {getLocales('Введите данные Вашей будущей учетной записи')}
          </p>
        </div>

        <div className="block auth-block animate__animated animate__fadeIn">
          <div className="block-body">
            <div className="form-group">
              <label
                className="form-control-label font-m"
                htmlFor="login"
              >
                {getLocales('Логин')}
              </label>
              <input
                id="login"
                disabled={state.loading}
                onChange={this.handleChange}
                autoComplete="off"
                name="login"
                type="text"
                placeholder={getLocales('Введите логин')}
                className="form-control"
              />
              <small>
                {getLocales('Минимальная длина логина - 4 символов')}
              </small>
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
                disabled={state.loading}
                onChange={this.handleChange}
                autoComplete="off"
                name="password"
                placeholder={getLocales('Введите пароль')}
                type="password"
                className="form-control"
              />
              <small>
                {getLocales('Минимальная длина пароля - 6 символов')}
              </small>
            </div>

            <div className="form-group">
              <label
                htmlFor="repeatPassword"
                className="form-control-label font-m"
              >
                {getLocales('Повторение пароля')}
              </label>
              <input
                id="repeatPassword"
                disabled={state.loading}
                onChange={this.handleChange}
                autoComplete="off"
                name="repeatPassword"
                placeholder={getLocales('Введите пароль ещё раз')}
                type="password"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="secret"
                className="form-control-label font-m"
              >
                {getLocales('Секретная фраза')}
              </label>
              <input
                id="secret"
                disabled={state.loading}
                onChange={this.handleChange}
                autoComplete="off"
                name="secret"
                placeholder={getLocales('Введите секретную фразу')}
                type="password"
                className="form-control"
              />
              <small>
                {getLocales('Запомните данную фразу, она является ключевым фактором для восстановления доступа в случае утери остальных данных')}
              </small>
            </div>

            <div className="text-center">
              <HCaptcha
                sitekey={captchaKey}
                languageOverride="ru"
                onVerify={(token) => this.handleChange({
                  target: { name: 'token', value: token },
                })}
              />
            </div>

            <div className="row">
              <div className="col-lg-6">
                <button
                  type="button"
                  className="btn btn-primary font-g auth-btn"
                  disabled={state.loading}
                  onClick={this.sendData}
                >
                  {getLocales(state.loading
                    ? 'Загрузка...'
                    : 'Зарегистрироваться')}
                </button>
              </div>

              <div className="col-lg-6">
                <NavLink to="/security/authorization">
                  <button
                    type="button"
                    className="btn btn-secondary right font-g auth-btn"
                  >
                    {getLocales('Авторизация')}
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Regisration;
