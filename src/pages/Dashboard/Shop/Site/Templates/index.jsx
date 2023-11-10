import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { ModalConfirm } from 'components';
import { getLocales, request } from 'utils';

function Templates() {
  const [isOpenModal, setOpenModal] = useState(false);
  const [templateSelected, setTemplateSelected] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({
    templates: [],
    template: 'default',
    templatesBuyed: [],
  });

  const { shopId } = useParams();

  const toggle = () => setOpenModal((prev) => !prev);

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

  const setTemplate = (name) => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'site',
          subtype: 'templates',
          shop: shopId,
          action: 'set',
          name,
        },
        action: 'shops',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(body, (response) => {
      if (isOpenModal) {
        setOpenModal(false);
      }

      if (response.status === 200) {
        if (response.data.success) {
          setData((prev) => ({
            ...prev,
            template: name,
          }));
          toast.success(response.data.message);
          setLoading(false);
        } else {
          toast.error(response.data.message);
          setLoading(false);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  };

  const changeTemplate = (name, needConfirm) => {
    if (needConfirm) {
      const templateFinded = data.templates.find((t) => t.name === name);
      const isBuyed = data.templatesBuyed.find((b) => b.name === name);

      const isNeedBuy = templateFinded?.price !== 0 && !isBuyed;

      if (isNeedBuy) {
        setTemplateSelected(name);
        setOpenModal(true);
        return;
      }
    }

    setTemplate(name);
  };

  return (
    <>
      <div className={`block animate__animated animate__fadeIn ${isLoading ? 'blur' : ''}`}>
        <div className="block-body">
          <h3 className="font-m">
            {getLocales('Шаблоны')}
          </h3>

          <div className="row">
            {data.templates.map((item) => (
              <div className="col-lg-4">
                <div className="text-center template-block">
                  <h3 className="font-m text-center">
                    {getLocales(item.label)}
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
                    <div className="col-lg-8">
                      <button
                        type="button"
                        onClick={() => changeTemplate(item.name, true)}
                        className="btn btn-primary auth-btn font-m"
                        disabled={data.template === item.name}
                      >
                        {data.template === item.name
                          ? getLocales('Установлен')
                          : getLocales('Установить')}
                      </button>
                    </div>

                    <div className="col-lg-4">
                      <b>
                        {' '}
                        <button
                          type="button"
                          className="btn btn-secondary auth-btn font-m"
                        >
                          {+item.price === 0
                            ? 'FREE'
                            : (`${item.price}$`)}
                          {' '}
                          {!!item.premium && <FontAwesomeIcon icon={faStar} />}
                        </button>
                      </b>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ModalConfirm
        action={getLocales('Вы действительно хотите приобрести данный шаблон?')}
        consequences={getLocales('Средства спишутся единоразово и не подлежат возврату')}
        modal={isOpenModal}
        toggle={toggle}
        loading={isLoading}
        sendData={() => changeTemplate(templateSelected, false)}
      />
    </>
  );
}

export default Templates;
