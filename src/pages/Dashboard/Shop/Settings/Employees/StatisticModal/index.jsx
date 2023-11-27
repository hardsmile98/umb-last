/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import { getLocales } from 'utils';

function StatisticModal({
  id,
  modal,
  toggle,
  data,
}) {
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState({});

  const [filter, setFilter] = useState({
    dateFrom: moment.unix(new Date(Date.now() - 2592000000)
      .setHours(0, 0, 0, 0) / 1000).format('YYYY-MM-DD'),
    dateTo: moment.unix(new Date(Date.now() + 86400000)
      .setHours(0, 0, 0, 0) / 1000).format('YYYY-MM-DD'),
  });

  const getSellers = useCallback(() => {
    const dataSellers = data.purchases.filter((item) => item.notfound === 1);
    setSellers(dataSellers);
  }, [data.purchases]);

  useEffect(() => {
    getSellers();
  }, [getSellers]);

  const getProducts = useCallback(() => {
    const formatted = data.purchases.filter((item) => (+item.closed > +new Date(filter.dateFrom)
      && +item.closed < +new Date(filter.dateTo)));

    const newProducts = formatted.reduce((acc, cur) => ({
      ...acc,
      [cur.product]: {
        ...acc[cur.product],
        sales: acc[cur.product]?.sales ? acc[cur.product].sales + 1 : 1,
        notfound: acc[cur.product]?.notfound
          ? cur.notfound === 1
            ? acc[cur.product].notfound + 1
            : acc[cur.product].notfound
          : cur.notfound === 1 ? 1 : 0,
        subproducts: {
          ...acc[cur.product]?.subproducts,
          [cur.subproduct]: {
            sales: acc[cur.product]?.subproducts?.[cur.subproduct]?.sales
              ? acc[cur.product].subproducts[cur.subproduct].sales + 1
              : 1,
            notfound: acc[cur.product]?.subproducts?.[cur.subproduct]?.notfound
              ? cur.notfound === 1
                ? acc[cur.product].subproducts[cur.subproduct].notfound + 1
                : acc[cur.product].subproducts[cur.subproduct].notfound
              : cur.notfound === 1 ? 1 : 0,
          },
        },
      },
    }), {});

    setProducts(newProducts);
  }, [data, filter]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const getProd = (status, addresses = []) => addresses.reduce((acc, cur) => {
    if (status === 'check') {
      if (cur.status === 2 || cur.status === 3) {
        acc += 1;
        return acc;
      }
    }

    if (status === cur.status) {
      acc += 1;
      return acc;
    }

    return acc;
  }, 0);

  const getSale = (type, purchases = []) => {
    const formatted = purchases.filter((item) => (+item.closed > +new Date(filter.dateFrom)
        && +item.closed < +new Date(filter.dateTo)));

    if (type === 'sales') {
      return formatted.length;
    }

    if (type === 'notfounded') {
      return formatted.filter((item) => item.notfound === 1).length;
    }

    if (type === 'coeff') {
      const countNotFounded = formatted.filter((item) => item.notfound === 1).length;

      if (countNotFounded === 0 && formatted.length === 0) {
        return 0;
      }

      return Math.round((countNotFounded / formatted.length) * 100);
    }

    return 0;
  };

  const handleFilterChange = (e) => setFilter((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));

  return (
    <Modal size="lg" isOpen={modal} toggle={toggle}>
      <div className="modal-header text-center">
        <h4 className="modal-title font-m">
          {getLocales('Сотрудник')}
          {' #'}
          {id}
        </h4>
      </div>

      <ModalBody>
        <div className="row">
          <div className="col-lg-4">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Адресов в продаже')}

              </label>
              <input
                disabled
                value={`${getProd(1, data.sellers)} ${getLocales('шт.')}`}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-lg-4">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Адресов на проверке')}

              </label>
              <input
                disabled
                value={`${getProd('check', data.sellers)} ${getLocales('шт.')}`}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-lg-4">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Удаленных адресов')}

              </label>
              <input
                disabled
                value={`${getProd(-1, data.sellers)} ${getLocales('шт.')}`}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('От')}
              </label>
              <input
                type="date"
                onChange={handleFilterChange}
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
                onChange={handleFilterChange}
                value={filter.dateTo}
                name="dateTo"
                className="form-control"
              />
            </div>
          </div>

          <div className="col-lg-4">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Продано адресов')}
              </label>
              <input
                disabled
                value={`${getSale('sales', data.purchases)} ${getLocales('шт.')}`}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-lg-4">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Ненаходов')}
              </label>
              <input
                disabled
                value={`${getSale('notfounded', data.purchases)} ${getLocales('шт.')}`}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-lg-4">
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Процент ненаходов')}
              </label>
              <input
                disabled
                value={`${getSale('coeff', data.purchases)}%`}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-lg-12">
            <div className="avatar-block notice no-margin">
              <h3 className="font-m">
                {getLocales('Статистика по товарам')}
              </h3>

              {Object.keys(products).length > 0
                ? (
                  <>
                    <div className="avatar-block font-m">
                      <div className="row">
                        <div className="col-lg-4">
                          {getLocales('Товар')}
                        </div>

                        <div className="col-lg-2">
                          {getLocales('Продано')}
                        </div>

                        <div className="col-lg-2">
                          {getLocales('Ненаходов')}
                        </div>

                        <div className="col-lg-4 text-center">
                          {getLocales('Процент')}
                        </div>
                      </div>
                    </div>

                    {Object.keys(products).map((key) => (
                      <div className="avatar-block font-m">
                        <div className="row">
                          <div className="col-lg-4">
                            <b>{key}</b>
                          </div>

                          <div className="col-lg-2 text-center">
                            {products[key].sales}
                            {' '}
                            {getLocales('шт.')}
                          </div>

                          <div className="col-lg-2 text-center">
                            {products[key].notfound}
                            {' '}
                            {getLocales('шт.')}
                          </div>

                          <div className="col-lg-4 text-center">
                            {Math.round((products[key].notfound / products[key].sales) * 100)}
                            %
                          </div>

                          {Object.keys(products[key]?.subproducts || {}).map((key2) => (
                            <>
                              <div className="col-lg-4">
                                {key2}
                              </div>

                              <div className="col-lg-2 text-center">
                                {products[key].subproducts[key2].sales}
                                {' '}
                                {getLocales('шт.')}
                              </div>

                              <div className="col-lg-2 text-center">
                                {products[key].subproducts[key2].notfound}
                                {' '}
                                {getLocales('шт.')}
                              </div>

                              <div className="col-lg-4 text-center">
                                {Math.round((products[key].subproducts[key2].notfound
                                    / products[key].subproducts[key2].sales) * 100)}
                                %
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )
                : (
                  <div className="text-center font-m">
                    {getLocales('Не найдено')}
                  </div>
                )}
            </div>

            <div className="avatar-block notice">
              <h4 className="modal-title font-m">
                {getLocales('Ненаходы')}
              </h4>

              {sellers.length > 0
                ? sellers.map((item) => (
                  <div className="notice avatar-block font-m">
                    <h4 className="modal-title font-m">
                      {item.category}
                      {' '}
                      {!!item.subcategory && ` / ${item.subcategory}`}
                      {' / '}
                      {item.product}
                      {' '}
                      {!!item.subproduct && ` / ${item.subproduct}`}
                    </h4>

                    {item.seller}

                    <div className="text-right">
                      {moment.unix(item.closed / 1000).format('LLL')}
                    </div>
                  </div>
                ))
                : (
                  <div className="text-center font-m">
                    {getLocales('Не найдено')}
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
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default StatisticModal;
