import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { getLocales, request } from 'utils';

const initialState = {
  value: '',
  fromDate: '',
  toDate: '',
  percent: '',
  sum: '',
  limitActive: 0,
  onlyone: 1,
  note: '',
};

function PromocodeModal({
  modal,
  toggle,
  getData,
  currency,
  shopId,
  active,
  promocode,
}) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(initialState);

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

  useEffect(() => {
    setData({
      ...promocode,
      fromDate: moment.unix(promocode.fromDate / 1000).format('YYYY-MM-DD'),
      toDate: moment.unix(promocode.toDate / 1000).format('YYYY-MM-DD'),
    });
  }, [promocode]);

  const sendData = () => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'promocodes',
          shop: shopId,
          id: data.id,
          percent: data.percent,
          sum: data.sum,
          fromDate: +new Date(data.fromDate),
          toDate: +new Date(data.toDate),
          limitActive: data.limitActive,
          onlyone: data.onlyone,
          note: data.note,
          action: 'update',
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
          setLoading(false);
          sendData(initialState);
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

  return (
    <Modal
      size="md"
      isOpen={modal}
      toggle={toggle}
    >
      <div className="modal-header text-center">
        <h4 className="modal-title font-m">
          {getLocales('Промокод')}
          {' #'}
          {data.id}
        </h4>
      </div>

      <ModalBody>
        <div className="form-group">
          <label className="form-control-label font-m">
            {getLocales('Промокод')}
          </label>
          <input
            placeholder={getLocales('Введите промокод')}
            disabled={isLoading}
            value={data.value}
            onChange={handleChange}
            name="value"
            className="form-control"
          />
        </div>

        <div className="row">
          <div className="col-lg-6">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Скидка в')}
                {' '}
                %
              </label>
              <div className="input-group">
                <input
                  placeholder={getLocales('Введите процент скидки')}
                  disabled={isLoading}
                  value={data.percent}
                  onChange={handleChange}
                  name="percent"
                  className="form-control"
                />
                <span className="input-group-text">%</span>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Скидка в')}
                {' '}
                {currency}
              </label>
              <div className="input-group">
                <input
                  placeholder={getLocales('Введите сумму скидки')}
                  disabled={isLoading}
                  value={data.sum}
                  onChange={handleChange}
                  name="sum"
                  className="form-control"
                />
                <span className="input-group-text">
                  {currency}
                </span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="font-m">
          {getLocales('Время действия промокода')}
        </h3>

        <div className="row">
          <div className="col-lg-6">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('От')}
              </label>
              <input
                type="date"
                placeholder={getLocales('Выберите дату действия от')}
                disabled={isLoading}
                value={data.fromDate}
                onChange={handleChange}
                name="fromDate"
                className="form-control"
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('До')}
              </label>
              <input
                type="date"
                placeholder={getLocales('Выберите дату действия до')}
                disabled={isLoading}
                value={data.toDate}
                onChange={handleChange}
                name="toDate"
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-control-label font-m">
            {getLocales('Максимальное кол-во активаций')}
          </label>
          <input
            placeholder={getLocales('Введите максимальное кол-во активаций')}
            disabled={isLoading}
            value={data.limitActive}
            onChange={handleChange}
            name="limitActive"
            className="form-control"
          />
          <small>
            {getLocales('Оставьте 0, если хотите сделать бесконечное кол-во активаций')}
          </small>
        </div>

        <div className="avatar-block no-margin">
          <div className="i-checks">
            <input
              name="onlyone"
              checked={data.onlyone}
              onChange={handleChange}
              disabled={isLoading}
              id="oneone"
              type="checkbox"
              className="checkbox-template"
            />
            <label
              htmlFor="onlyone"
              className="checkbox-label font-m promocode-checkbox-label"
            >
              {getLocales('Единичная активация (1 пользователь = 1 активация)')}
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-control-label font-m">
            {getLocales('Заметка')}
          </label>
          <input
            placeholder={getLocales('Введите заметку о промокоде')}
            disabled={isLoading}
            value={data.note}
            onChange={handleChange}
            name="note"
            className="form-control"
          />
        </div>

        <h4 className="modal-title font-m">
          {getLocales('История активаций')}
        </h4>

        {active.length > 0
          ? active.map((item) => (
            <div className="form-group" key={item.id}>
              <div className="input-group">
                <input
                  disabled
                  className="form-control"
                  value={item.name}
                />

                <NavLink to={`/dashboard/shops/${shopId}/datas/users/${item.id}`}>
                  <span className="input-group-text">
                    {getLocales('Перейти в профиль')}
                  </span>
                </NavLink>
              </div>
            </div>
          ))
          : (
            <div className="text-center font-m">
              {getLocales('История отсутствует')}
            </div>
          )}
      </ModalBody>

      <ModalFooter>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4">
              <div className="mr-auto">
                <button
                  type="button"
                  value="Закрыть"
                  className="btn btn-secondary font-m auth-btn"
                  onClick={toggle}
                >
                  {getLocales('Закрыть')}

                </button>
              </div>
            </div>

            <div className="col-lg-8">
              <button
                type="button"
                disabled={isLoading}
                onClick={sendData}
                className="btn btn-primary font-m auth-btn"
              >
                {isLoading
                  ? getLocales('Загрузка...')
                  : getLocales('Сохранить')}
              </button>
            </div>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default PromocodeModal;
