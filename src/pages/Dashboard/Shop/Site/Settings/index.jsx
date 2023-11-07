/* eslint-disable react/no-danger */
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getLocales, request } from 'utils';

function Settings() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const { shopId } = useParams();

  const getData = useCallback(() => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'site',
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

  const sendData = (name) => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'site',
          subtype: 'settings',
          shop: shopId,
          action: 'change',
          name,
          value: data.settings[name],
        },
        action: 'shops',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(body, (response) => {
      if (response.status !== 200) {
        setLoading(false);
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

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className={`block animate__animated animate__fadeIn ${isLoading ? 'blur' : ''}`}>
      <div className="block-body">
        <div className="row">
          <div className="col-lg-12">
            <h3 className="font-m">
              {getLocales('Настройки')}
            </h3>

            <div className="avatar-block notice font-m margin-15">
              {getLocales('Для изображений')}
              {' '}
              <b>{getLocales('необходимо')}</b>
              {' '}
              {getLocales('указывать прямую ссылку, прямая ссылка')}
              {' '}
              <b>{getLocales('всегда')}</b>
              {' '}
              {getLocales('оканчивается на формат изображения (png, jpg, jpeg и т.д.).')}
            </div>

            <div className="row matgin-15">
              {Object.keys(data.available || {}).map((keyName) => (
                <div className="col-lg-6" key={keyName}>
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales(data.available[keyName].title)}
                    </label>

                    {data.available[keyName].type === 'select'
                      ? (
                        <>
                          <div className="input-group">
                            <select
                              onChange={onChange}
                              value={data.settings[keyName]}
                              name={data.available[keyName].name}
                              className="form-control"
                            >
                              {data.available[keyName].values.split(',')
                                .map((value, key) => (
                                  <option value={value} key={value}>
                                    {getLocales(data.available[keyName].valuesNames.split(',')[key])}
                                  </option>
                                ))}
                            </select>

                            <div className="input-group-append">
                              <button
                                onClick={() => sendData(keyName)}
                                className="btn btn-primary font-m auth-btn"
                                type="button"
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
                                getLocales(data.available[keyName].tip.replace(/"/g, "'")),
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
                                className="btn btn-primary font-m auth-btn"
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
                            <small
                              dangerouslySetInnerHTML={{
                                __html:
                                 getLocales(data.available[keyName].tip.replace(/"/g, "'")),
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
    </div>
  );
}

export default Settings;
