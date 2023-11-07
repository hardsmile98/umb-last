import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { getLocales, request } from 'utils';

function SetAsNoffoundModal({
  modal,
  toggle,
  ownerAdd,
  currency,
  shop,
  purchase,
  getData,
}) {
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState({
    record: 0,
    fine: 0,
    fineInd: 0,
  });

  const handleChange = (e) => {
    const value = e.target[e.target.type === 'checkbox'
      ? 'checked'
      : 'value'];
    const { name } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendData = () => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'datas',
          subtype: 'purchases',
          shop,
          action: 'setNotFound',
          id: purchase,
          ...data,
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

      toast.success(response.data.message);
      getData();
      toggle();
    });
  };

  return (
    <Modal
      size="md"
      isOpen={modal}
      toggle={toggle}
    >
      <div className="modal-header text-center">
        <h4 className="modal-title font-m">
          {getLocales('Опции для ненахода')}
        </h4>
      </div>

      <ModalBody>
        <div className="form-group">
          <label className="form-control-label font-m">
            {getLocales('Учитывать покупку в общем обороте')}
          </label>
          <select
            disabled={isLoading}
            value={data.record}
            onChange={handleChange}
            name="record"
            className="form-control"
          >
            <option value="0">{getLocales('Нет')}</option>
            <option value="1">{getLocales('Да')}</option>
          </select>
        </div>

        {!ownerAdd && (
          <div className="form-group">
            <label className="form-control-label font-m">
              {getLocales('Оштрафовать курьера')}
            </label>
            <select
              disabled={isLoading}
              value={data.fine}
              onChange={handleChange}
              name="fine"
              className="form-control"
            >
              <option value="0">{getLocales('Нет')}</option>
              <option value="1">{getLocales('Да')}</option>
              <option value="2">{getLocales('Да, но по отдельному тарифу')}</option>
            </select>
          </div>
        )}

        {String(data.fine) === '2' && (
          <div className="form-group">
            <label className="form-control-label font-m">
              {getLocales('Штраф для курьера')}
            </label>
            <div className="input-group">
              <input
                disabled={isLoading}
                value={data.fineInd}
                name="fineInd"
                onChange={handleChange}
                className="form-control"
              />
              <span className="input-group-text">
                {currency}
              </span>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4">
              <button
                type="button"
                value={getLocales('Закрыть')}
                className="btn btn-secondary font-m auth-btn"
                onClick={toggle}
              >
                {getLocales('Закрыть')}
              </button>
            </div>

            <div className="col-lg-8">
              <button
                type="button"
                value="Отметить"
                onClick={sendData}
                disabled={isLoading}
                className="btn btn-primary font-m auth-btn"
              >
                {isLoading
                  ? getLocales('Загрузка...')
                  : getLocales('Отметить')}
              </button>
            </div>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default SetAsNoffoundModal;
