/* eslint-disable react/no-danger */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { ModalConfirm } from 'components';
import { request, getLocales } from 'utils';

function ShopSettings() {
  const [isLoading, setLoading] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const [data, setData] = useState({});

  const { shopId } = useParams();

  const toggle = () => setOpenModal((prev) => !prev);

  const getData = useCallback(() => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'settings',
          shop: shopId,
          action: 'get',
        },
        action: 'shops',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(body, (response) => {
      if (response.status !== 200) {
        toast.error('Сервер недоступен');
        return;
      }

      if (!response.data.success) {
        setLoading(false);
        toast.error(response.data.message);
        return;
      }

      const responseData = response.data.data;

      const formattedData = {
        ...responseData,
        settings: Object.keys(responseData.available).reduce((acc, cur) => ({
          ...acc,
          [cur]: responseData.settings[cur] || responseData.available[cur].default,
        }), {}),
      };

      setLoading(false);
      setData(formattedData);
    });
  }, [shopId]);

  const sendData = (name, value) => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'settings',
          shop: shopId,
          action: 'change',
          name,
          value: value || data.settings[name],
        },
        action: 'shops',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(body, (response) => {
      if (response.status !== 200) {
        toast.error('Сервер недоступен');
        return;
      }

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }

      setLoading(false);
    });
  };

  const buy = () => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'settings',
          shop: shopId,
          action: 'disableAdvert',
        },
        action: 'shops',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(body, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          toast.success(response.data.message);
          toggle();
          getData();
        } else {
          setLoading(false);
          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  };

  const debtOff = () => {
    setLoading(false);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'settings',
          shop: shopId,
          action: 'debitOff',
        },
        action: 'shops',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(body, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          toast.success(response.data.message);
          getData();
        } else {
          setLoading(false);
          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [name]: value,
      },
    }));
  };

  const onChangeSelect = (e) => {
    const { name, value } = e.target;

    onChange(e);
    sendData(name, value);
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <div className="row">
        <div className="col-lg-8">
          <div className={`block animate__animated animate__fadeIn ${isLoading ? 'blur' : ''}`}>
            <div className="block-body">
              <h3 className="font-m">
                {getLocales('Настройки')}
              </h3>

              <div className="row">
                {Object.keys(data.available || {}).map((keyName) => (
                  <div className="col-lg-6" key={keyName}>
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales(data.available[keyName].title)}
                      </label>

                      {data.available[keyName].type === 'select'
                        ? (
                          <>
                            <select
                              onChange={onChangeSelect}
                              value={data.settings[keyName]}
                              name={data.available[keyName].name}
                              className="form-control"
                            >
                              {data.available[keyName].values.split(',')
                                .map((value, key) => (
                                  <option value={value}>
                                    {getLocales(data.available[keyName].valuesNames.split(',')[key])}
                                  </option>
                                ))}
                            </select>
                            {data.available[keyName].tip && (
                              <small dangerouslySetInnerHTML={{
                                __html:
                                    getLocales(data.available[keyName].tip),
                              }}
                              />
                            )}
                          </>
                        )
                        : (
                          <>
                            <div className="input-group">
                              <input
                                onChange={onChange}
                                name={data.available[keyName].name}
                                className="form-control"
                                value={data.settings[keyName]}
                              />

                              <div className="input-group-append">
                                <button
                                  onClick={() => sendData(keyName)}
                                  className="input-group-text"
                                  type="button"
                                  disabled={!data.settings[keyName]}
                                >
                                  {isLoading
                                    ? getLocales('Загрузка...')
                                    : getLocales('Сохранить')}
                                </button>
                              </div>
                            </div>
                            {data.available[keyName].tip && (
                              <small dangerouslySetInnerHTML={{
                                __html:
                                    getLocales(data.available[keyName].tip),
                              }}
                              />
                            )}
                          </>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className={`block animate__animated animate__fadeIn ${isLoading ? 'blur' : ''}`}>
            <div className="block-body">
              <h3 className="font-m">
                {getLocales('Отключение рекламы')}
              </h3>

              {!data.subscription
                ? (
                  <>
                    <div
                      className="avatar-block font-m notice-chat"
                      dangerouslySetInnerHTML={{
                        __html:
                            getLocales('Отключение рекламы в ботах и на сайте автопродаж.<br/>Стоимость указана за 1 месяц отключения.'),
                      }}
                    />

                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Стоимость')}
                      </label>
                      <div className="input-group">
                        <input
                          disabled
                          value={data.subscriptionPrice}
                          className="form-control"
                        />
                        <span className="input-group-text">$</span>
                      </div>
                    </div>

                    <div
                      aria-hidden
                      className="btn btn-primary auth-btn font-m"
                      onClick={toggle}
                    >
                      {getLocales('Подключить')}
                    </div>
                  </>
                )
                : (
                  <>
                    <div className="avatar-block font-m notice-chat">
                      {getLocales('Подписка активна')}
                    </div>

                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Активна до')}
                      </label>
                      <input
                        disabled
                        value={moment.unix(data.subscription / 1000).format('LLL')}
                        className="form-control"
                      />
                    </div>
                    {String(data.autoDebit) === '1'
                      ? (
                        <div
                          aria-hidden
                          className="btn btn-danger auth-btn font-m"
                          onClick={debtOff}
                        >
                          {getLocales('Отключить автопродление')}
                        </div>
                      )
                      : (
                        <div
                          aria-hidden
                          className="btn btn-primary auth-btn font-m"
                          onClick={debtOff}
                        >
                          {getLocales('Включить автопродление')}
                        </div>
                      )}
                  </>
                )}
            </div>
          </div>
        </div>
      </div>

      <ModalConfirm
        action={getLocales('Вы действительно хотите подключить подписку на отключение рекламы?')}
        consequences={getLocales('Средства будут списаны с Вашего баланса, данное действие необратимо, вернуть средства не будет возможным.')}
        modal={isOpenModal}
        toggle={toggle}
        loading={isLoading}
        sendData={buy}
      />
    </>
  );
}

export default ShopSettings;
