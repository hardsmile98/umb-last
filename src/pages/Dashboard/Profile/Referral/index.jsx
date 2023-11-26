import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { getLocales, request } from 'utils';

class Referral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        ref: '',
        referrals: 0,
        shops: [],
        withdrawals: [],
      },
    };
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'referall',
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
    const { state } = this;

    return (
      <>
        <div className="row">
          <div className="col-lg-4">
            <div className="income font-m income-orange animate__animated animate__fadeIn">
              <h5>
                <span>{getLocales('Регистрации')}</span>
              </h5>
              <h2>
                <span>{state.data.referrals}</span>
              </h2>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="income font-m animate__animated animate__fadeIn">
              <h5>
                <span>{getLocales('Продажи')}</span>
              </h5>
              <h2>
                <span>0</span>
              </h2>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="income font-m animate__animated animate__fadeIn">
              <h5>
                <span>{getLocales('Доход')}</span>
              </h5>
              <h2>
                <span>0 BTC</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <div className="form-group">
                  <label htmlFor="partnerUrl" className="font-m">
                    <span>
                      {getLocales('Партнерская ссылка')}
                    </span>
                  </label>
                  <div className="input-group">
                    <input
                      id="partnerUrl"
                      className="form-control"
                      name="partnerUrl"
                      placeholder="p"
                      value={`${window.location.origin}/security/registration/${state.data.ref}`}
                      readOnly=""
                    />

                    <div className="input-group-append">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/security/registration/${state.data.ref}`);
                          toast.success('Скопировано');
                        }}
                        className="btn btn-secondary"
                        id="copyReferral"
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="partnerUrl" className="font-m">
                  <span>
                    {getLocales('Пригласительный код')}
                  </span>
                </label>
                <div className="input-group">
                  <input
                    id="partnerUrl"
                    className="form-control"
                    name="partnerUrl"
                    placeholder="p"
                    value={state.data.ref}
                    readOnly=""
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(state.data.ref);
                        toast.success(getLocales('Скопировано'));
                      }}
                      className="btn btn-secondary"
                      id="copyReferral"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </button>
                  </div>
                </div>
                <small>
                  {getLocales('Используется при регистрации новых пользователей.')}
                </small>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <div className="block-body font-m">
                <div className="text-center">
                  {getLocales('Зарабатывайте 15% от прибыли сервиса, приглашая новых клиентов к нам с помощью партнерской ссылки или пригласительного кода.')}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h4 className="font-m">
                  {getLocales('Магазины')}
                </h4>

                {state.data.shops.length > 0
                  ? (
                    <>
                      {state.data.shops.map((item) => (
                        <div className="avatar-block notice-chat">
                          <div className="row">
                            <div className="col-lg-6">
                              {!!item.domains.length > 0 && (
                              <>
                                {item.domains
                                  .map((domain) => (
                                    <a href={`http://${domain.value}`}>
                                      {domain.value}
                                    </a>
                                  ))}
                              </>
                              )}
                            </div>

                            <div className="col-lg-6">
                              {!!item.bots.length > 0 && (
                              <>
                                {item.bots.map((bot) => (
                                  <a href={`https://t.me/${bot.username}`}>
                                    @
                                    {bot.username}
                                  </a>
                                ))}
                              </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )
                  : (
                    <div className="text-center font-m">
                      {getLocales('Магазины отсутствуют')}
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h4 className="font-m">
                  {getLocales('Начисления')}
                </h4>

                <div className="text-center font-m">
                  {getLocales('Начисления отсутствуют')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Referral;
