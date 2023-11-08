import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { getLocales } from 'utils';

function ProfitModal({
  modal,
  toggle,
  currency,
  purchases,
  products,
  subproducts,
}) {
  const [filter, setFilter] = useState({
    dateFrom: moment.unix(new Date(Date.now() - 2592000000)
      .setHours(0, 0, 0, 0) / 1000).format('YYYY-MM-DD'),
    dateTo: moment.unix(new Date(Date.now() + 86400000)
      .setHours(0, 0, 0, 0) / 1000).format('YYYY-MM-DD'),
  });
  const [profit, setProfit] = useState({});

  const getProfit = useCallback(() => {
    const formattedData = {};

    purchases.forEach((purchase) => {
      if (+purchase.closed >= +new Date(filter.dateFrom)
        && +purchase.closed < +new Date(filter.dateTo)) {
        if (!purchase.subproduct) {
          products.forEach((item) => {
            if (item.name === purchase.product) {
              const category = formattedData[purchase.category];

              formattedData[purchase.category] = category
                ? {
                  ...category,
                  turnover: category.turnover + (+purchase.sum),
                  courier: category.courier + (+item.bonus),
                  prefer: category.prefer + (+purchase.sum - +item.bonus - 0),
                }
                : {
                  turnover: +purchase.sum,
                  courier: +item.bonus,
                  seb: 0,
                  prefer: (+purchase.sum - +item.bonus - 0),
                };
            }
          });
        } else {
          subproducts.forEach((item) => {
            if (item.name === purchase.subproduct) {
              const category = formattedData[purchase.category];

              formattedData[purchase.category] = category
                ? {
                  ...category,
                  turnover: category.turnover + (+purchase.sum),
                  courier: category.courier + (+item.bonus),
                  seb: category.seb + (+item.sum),
                  prefer: category.prefer + (+purchase.sum - +item.bonus - +item.sum),
                }
                : {
                  turnover: +purchase.sum,
                  courier: +item.bonus,
                  seb: +item.sum,
                  prefer: (+purchase.sum - +item.bonus - +item.sum),
                };
            }
          });
        }
      }
    });

    setProfit(formattedData);
  }, [filter, products, subproducts, purchases]);

  useEffect(() => {
    getProfit();
  }, [getProfit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal
      size="xl"
      isOpen={modal}
      toggle={toggle}
    >
      <div className="modal-header text-center">
        <h4 className="modal-title font-m">
          {getLocales('Рассчет прибыли')}
        </h4>
      </div>

      <ModalBody>
        <div className="row">
          <div className="col-lg-6">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('От')}
              </label>
              <input
                type="date"
                onChange={handleChange}
                value={filter.dateFrom}
                name="dateFrom"
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
                onChange={handleChange}
                value={filter.dateTo}
                name="dateTo"
                className="form-control"
              />
            </div>
          </div>

          <div className="col-lg-12">
            <div className="avatar-block notice no-margin">
              <h3 className="font-m">
                {getLocales('Статистика по городам')}
              </h3>

              {Object.keys(profit).length > 0
                ? (
                  <div>
                    <div className="avatar-block font-m">
                      <div className="row">
                        <div className="col-lg-2">
                          <b>Город</b>
                        </div>
                        <div className="col-lg-2 text-center">
                          <b>Оборот</b>
                        </div>
                        <div className="col-lg-2 text-center">
                          <b>З/п курьерам</b>
                        </div>
                        <div className="col-lg-3 text-center">
                          <b>Себестоимость товара</b>
                        </div>
                        <div className="col-lg-2 text-center">
                          <b>Чистая прибыль</b>
                        </div>
                      </div>
                    </div>

                    {Object.keys(profit).map((key) => (
                      <div className="avatar-block font-m" key={key}>
                        <div className="row">
                          <div className="col-lg-2">
                            {key}
                          </div>
                          <div className="col-lg-2 text-center">
                            {Math.round(profit[key].turnover)}
                            {' '}
                            {currency}
                          </div>
                          <div className="col-lg-2 text-center">
                            {Math.round(profit[key].courier)}
                            {' '}
                            {currency}
                          </div>
                          <div className="col-lg-3 text-center">
                            {Math.round(profit[key].seb)}
                            {' '}
                            {currency}
                          </div>
                          <div className="col-lg-2 text-center">
                            {Math.round(profit[key].prefer)}
                            {' '}
                            {currency}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
                : (
                  <div className="text-center font-m">
                    Не найдено
                  </div>
                )}
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                value={getLocales('Закрыть')}
                className="btn btn-secondary font-m auth-btn"
                onClick={toggle}
              >
                {getLocales('Закрыть')}
              </button>
            </div>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default ProfitModal;
