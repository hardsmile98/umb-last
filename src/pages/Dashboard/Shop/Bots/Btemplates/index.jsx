/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLocales, request } from 'utils';
import { toast } from 'react-toastify';
import renderHTML from 'react-render-html';
import { ModalConfirm, EmojiInput } from 'components';

function Btemplates() {
  const { shopId } = useParams();

  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [category, setCategory] = useState('main');

  const [data, setData] = useState({
    shoptTemplates: [],
    tTemplates: [],
  });
  const [systemName, setSystemName] = useState('showMenu');
  const [template, setTemplate] = useState({
    content: '',
    templateName: '',
    variables: '',
    canRecovery: false,
  });

  const handleChange = (e) => setTemplate((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));

  const getData = useCallback(() => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'bots',
          subtype: 'tButtons',
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
      if (response.status === 200) {
        if (response.data.success) {
          setData(response.data.data);
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  }, [shopId]);

  useEffect(() => {
    getData();
  }, [getData]);

  const getCurrentTemplate = useCallback(() => {
    const shopTemplate = data.shoptTemplates.find((el) => el.name === systemName);
    const defaultTemplate = data.tTemplates.find((el) => el.name === systemName);

    if (!defaultTemplate) {
      return;
    }

    setTemplate({
      canRecovery: !!shopTemplate,
      content: shopTemplate ? shopTemplate.content : defaultTemplate.content,
      variables: defaultTemplate.variables,
      templateName: defaultTemplate.label,
    });
  }, [data, systemName]);

  useEffect(() => {
    getCurrentTemplate();
  }, [getCurrentTemplate]);

  const sendData = () => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'bots',
          subtype: 'tButtons',
          shop: shopId,
          action: 'update',
          name: systemName,
          value: template.content,
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

  const recovery = () => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'bots',
          subtype: 'tButtons',
          shop: shopId,
          action: 'recovery',
          name: systemName,
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
          setModalOpen(false);
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

  return (
    <>
      <div className={`block animate__animated animate__fadeIn no-margin ${isLoading ? 'blur' : ''}`}>
        <div className="block-body">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="font-m">
                {getLocales('Шаблоны кнопок')}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className={`xtabs template xtabs_bottom animate__animated animate__fadeIn ${isLoading ? 'blur' : ''}`}>
        <div className="xtabs__body">
          <a
            aria-hidden
            className={`xtabs__item font-m ${category === 'main' ? 'active' : ''}`}
            onClick={() => setCategory('main')}
          >
            <span>{getLocales('Общие')}</span>
          </a>
          <a
            aria-hidden
            className={`xtabs__item font-m ${category === 'shop' ? 'active' : ''}`}
            onClick={() => setCategory('shop')}
          >
            <span>{getLocales('Магазин')}</span>
          </a>
          <a
            aria-hidden
            className={`xtabs__item font-m ${category === 'support' ? 'active' : ''}`}
            onClick={() => setCategory('support')}
          >
            <span>{getLocales('Поддержка')}</span>
          </a>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 bigzindex">
          <div className={`block animate__animated animate__fadeIn margin-block-top ${isLoading ? 'blur' : ''}`}>
            <div className="block-body">
              <h3 className="font-m">
                {getLocales('Шаблон')}
                :
                {' '}
                {template.templateName}
                {' '}
                {template.canRecovery && (
                  <span className="right">
                    <a
                      aria-hidden
                      onClick={() => setModalOpen(true)}
                    >
                      {getLocales('Восстановить шаблон')}
                    </a>
                  </span>
                )}
              </h3>

              <div className="row">
                <div className="col-lg-12">
                  <EmojiInput
                    type="input"
                    value={template.content}
                    placeholder="Введите содержание страницы"
                    name="content"
                    handleChange={handleChange}
                  />
                  <br />
                </div>

                <div className="col-lg-8">
                  <div className="avatar-block notice-chat no-margin">
                    <h3 className="font-m">
                      {getLocales('Переменные')}
                      :
                    </h3>

                    {renderHTML(template.variables)}
                  </div>
                </div>

                <div className="col-lg-4">
                  <button
                    type="button"
                    disabled={!template.content || isLoading}
                    className="btn btn-primary w-100 font-m"
                    onClick={sendData}
                  >
                    {isLoading
                      ? getLocales('Загрузка...')
                      : getLocales('Сохранить')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className={`block animate__animated animate__fadeIn margin-block-top ${isLoading ? 'blur' : ''}`}>
            <div className="block-body">
              {data.tTemplates
                .filter((item) => item.category === category)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSystemName(item.name)}
                    className="btn btn-secondary auth-btn list font-m"
                  >
                    {item.label}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <ModalConfirm
        action={getLocales('Вы действительно хотите восстановить данный шаблон?')}
        modal={isModalOpen}
        toggle={() => setModalOpen(false)}
        loading={isLoading}
        sendData={recovery}
      />
    </>
  );
}

export default Btemplates;
