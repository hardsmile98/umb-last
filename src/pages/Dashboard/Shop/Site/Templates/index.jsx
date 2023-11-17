import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { ModalConfirm } from 'components';
import { getLocales, request } from 'utils';

const actions = {
  set: 'set',
  rent: 'rent',
};

function Templates() {
  const [modal, setModal] = useState(null);
  const [templateSelected, setTemplateSelected] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({
    templates: [],
    template: 'default',
    templatesBuyed: [],
  });

  const { shopId } = useParams();

  const getData = useCallback(() => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'site',
          subtype: 'templates',
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

      setData(response.data.data);
      setLoading(false);
    });
  }, [shopId]);

  useEffect(() => {
    getData();
  }, [getData]);

  const setTemplate = (name, action) => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'site',
          subtype: 'templates',
          shop: shopId,
          action,
          name,
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
          toast.error(response.data.message);
          setLoading(false);
        }
      } else {
        toast.error('Сервер недоступен');
      }

      if (modal) {
        setModal(null);
      }
    });
  };

  const changeTemplate = (name, action) => {
    setTemplateSelected(name);
    setModal(action);
  };

  return (
    <>
      <div className={`block animate__animated animate__fadeIn ${isLoading ? 'blur' : ''}`}>
        <div className="block-body">
          <h3 className="font-m">
            {getLocales('Шаблоны')}
          </h3>

          <div className="row">
            {data.templates.map((item) => {
              const templateFinded = data.templates.find((t) => t.name === item.name);
              const isBuyed = data.templatesBuyed.find((b) => b.name === item.name);

              const isNeedBuy = templateFinded?.price !== 0 && !isBuyed;

              return (
                <div className="col-lg-4" key={item.name}>
                  <div className="text-center template-block">
                    <h3 className="font-m text-center">
                      {!!item.premium && <FontAwesomeIcon icon={faStar} />}
                      {' '}
                      {item.label}
                    </h3>
                    <a
                      href={`http://${item.name}.umbrella.day`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={item.img}
                        width="100%"
                        alt={item.name}
                      />
                    </a>

                    <div className="row margin-15">
                      {isNeedBuy ? (
                        <>
                          <div className="col-lg-6">
                            <button
                              type="button"
                              onClick={() => changeTemplate(item.name, actions.set)}
                              className="btn btn-primary auth-btn font-m template-button"
                              disabled={data.template === item.name}
                            >
                              {data.template === item.name
                                ? getLocales('Установлен')
                                : (
                                  <>
                                    <div>
                                      {getLocales('Купить')}
                                    </div>

                                    <div className="small">
                                      {`${item.price}$`}
                                    </div>
                                  </>
                                )}
                            </button>
                          </div>

                          <div className="col-lg-6">
                            <button
                              type="button"
                              onClick={() => changeTemplate(item.name, actions.rent)}
                              className="btn btn-primary auth-btn font-m template-button"
                              disabled={data.template === item.name}
                            >
                              {data.template === item.name
                                ? getLocales('Установлен')
                                : (
                                  <>
                                    <div>
                                      {getLocales('Арендовать')}
                                    </div>

                                    <div className="small">
                                      {`${item.priceRent}$/${getLocales('месяц')}`}
                                    </div>
                                  </>
                                )}
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="col-lg-12">
                          <button
                            type="button"
                            onClick={() => setTemplate(item.name, actions.set)}
                            className="btn btn-primary auth-btn font-m template-button"
                            disabled={data.template === item.name}
                          >
                            {data.template === item.name
                              ? getLocales('Установлен')
                              : getLocales('Установить')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ModalConfirm
        action={getLocales(modal === actions.set
          ? 'Вы действительно хотите приобрести данный шаблон?'
          : 'Вы действительно хотите арендовать данный шаблон?')}
        consequences={getLocales('Средства спишутся единоразово и не подлежат возврату')}
        modal={!!modal}
        toggle={() => setModal(null)}
        loading={isLoading}
        sendData={() => setTemplate(templateSelected, modal)}
      />
    </>
  );
}

export default Templates;
