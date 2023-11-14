/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { getLocales, request } from 'utils';
import { Table } from 'components';

const getType = (reason) => {
  switch (reason) {
    case 'topup':
      return getLocales('Пополнение');
    case 'overpay':
      return getLocales('Переплата');
    case 'smallPay':
      return getLocales('Недоплата');
    default:
      return null;
  }
};

function Topups() {
  const { shopId } = useParams();

  const [isLoading, setLoading] = useState(false);
  const [payments, setPaymenst] = useState([]);
  const [data, setData] = useState({
    topups: [],
    currency: 'EE',
    users: [],
  });
  const [filter, setFilter] = useState({
    reasonSort: '',
    paymentSort: '',
    dateFrom: '',
    dateTo: '',
  });
  const [items, setItems] = useState([]);

  const updateItems = (newItems) => setItems(newItems);

  const onChangeFilter = (e) => setFilter((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));

  const getPayments = (paymentsData) => {
    if (paymentsData.length) {
      const formatted = paymentsData.reduce((acc, cur) => {
        const { type } = cur;

        if (!acc.includes(type)) {
          acc.push(type);
        }

        return acc;
      }, []);

      setPaymenst(formatted);
    }
  };

  const prepareItems = useCallback(() => {
    let copy = [...data.topups];

    if (filter.paymentSort !== '') {
      copy = copy.filter((purchase) => purchase.type === filter.paymentSort);
    }

    if (filter.reasonSort !== '') {
      copy = copy.filter((purchase) => purchase.reason === filter.reasonSort);
    }

    if (filter.dateFrom !== '') {
      copy = copy.filter((purchase) => +purchase.closed >= +new Date(filter.dateFrom));
    }

    if (filter.dateTo !== '') {
      copy = copy.filter((purchase) => +purchase.closed <= +new Date(filter.dateTo));
    }

    const formattedItems = copy.map((item) => ({
      id: item.id,
      reason: getType(item.reason),
      sum: `${item.sum} ${data.currency}`,
      type: item.type,
      date: moment.unix(item.closed / 1000).format('LLL'),
    }));

    setItems(formattedItems);
  }, [filter, data]);

  useEffect(() => {
    prepareItems();
  }, [prepareItems]);

  const getData = useCallback(() => {
    // setLoading(true);

    // const body = {
    //   api: 'user',
    //   body: {
    //     data: {
    //       section: 'shop',
    //       type: 'datas',
    //       subtype: 'topups',
    //       shop: shopId,
    //       action: 'get',
    //     },
    //     action: 'shops',
    //   },
    //   headers: {
    //     authorization: localStorage.getItem('token'),
    //   },
    // };

    // request(body, (response) => {
    //   if (response.status !== 200) {
    //     toast.error('Сервер недоступен');
    //     return;
    //   }

    //   if (!response.data.success) {
    //     toast.success(response.data.message);
    //     setLoading(false);
    //     return;
    //   }

    //   console.log(response);
    //   setLoading(false);
    // });

    const response = {
      data: {
        success: true,
        message: 'Данные успешно получены',
        data: {
          topups: [
            {
              id: 1325,
              reason: 'topup',
              user: 73,
              sum: 850,
              created: '1697319518048',
              closed: '1697319903749',
              status: 1,
              data: '{"category":"3","subcategory":0,"product":"2","subproduct":0,"user":73,"typeofklad":0,"sum":850,"method":"LTC","presale":true}',
              type: 'LTC',
              deposit: 593690,
              toUser: 0.0001,
              purchase: 0,
            },
            {
              id: 1325,
              reason: 'overpay',
              user: 73,
              sum: 850,
              created: '1697319518048',
              closed: '1697319903749',
              status: 1,
              data: '{"category":"3","subcategory":0,"product":"2","subproduct":0,"user":73,"typeofklad":0,"sum":850,"method":"LTC","presale":true}',
              type: 'BTC',
              deposit: 593690,
              toUser: 0.0001,
              purchase: 0,
            },
          ],
          currency: 'RUB',
          users: [
            {
              id: 35,
              name: 'Scarlet Blood',
              password: null,
              chatid: '1257013274',
              balance: 0,
              percent: 0,
              sum: 0,
              step: 'start',
              block: 0,
              refid: '9339aff3ab028bd58d72d932606c90ba',
              ref: null,
              username: 'harisonmed',
              regdate: '1675258536535',
              action: '{"city":"1","product":"1","subproduct":"4","paymethod":"CARDRUB","fullSum":"1000.00","presale":0}',
              purchasesSum: 0,
              purchases: 0,
              bot: 15,
              persDisc: 0,
              notice: null,
            }],
        },
      },
    };

    getPayments(response.data.data.topups);
    setData(response.data.data);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const tableColumns = [
    {
      title: 'ID', dataIndex: 'id', key: 'id', sort: true,
    },
    {
      title: getLocales('Тип'), dataIndex: 'reason', key: 'reason', sort: true,
    },
    {
      title: getLocales('Сумма'), dataIndex: 'sum', key: 'sum', sort: true,
    },
    {
      title: getLocales('Способ оплаты'), dataIndex: 'type', key: 'type', sort: true,
    },
    {
      title: getLocales('Дата'), dataIndex: 'date', key: 'date', sort: true,
    },
    {
      title: getLocales('Действие'),
      dataIndex: 'name',
      itemClassName: 'text-center',
      headerClassName: 'text-center',
      key: 'operations',
      render: (_e, item) => (
        <NavLink
          to={`/dashboard/shops/${shopId}/datas/topups/${item.id}`}
        >
          <button type="button" className="btn btn-secondary font-m">
            {getLocales('Подробнее')}
          </button>
        </NavLink>
      ),
    },
  ];

  return (
    <div className={`block animate__animated animate__fadeIn ${isLoading ? 'blur' : ''}`}>
      <div className="block-body">
        <div className="row">
          <div className="col-lg-12">
            <h3 className="font-m">
              {getLocales('Пополнения')}
            </h3>

            {data.topups.length === 0
              ? (
                <div className="text-center font-m">
                  {getLocales('Пополнения отсутствуют')}
                </div>
              )
              : (
                <>
                  <div className="avatar-block">
                    <h4 className="font-m">
                      {getLocales('Сортировка')}
                    </h4>

                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="form-control-label font-m">
                            {getLocales('Тип')}
                          </label>
                          <select
                            disabled={isLoading}
                            value={filter.reasonSort}
                            onChange={onChangeFilter}
                            name="reasonSort"
                            className="form-control"
                          >
                            <option value="">{getLocales('Все')}</option>
                            <option value="topup">{getLocales('Пополнение')}</option>
                            <option value="overpay">{getLocales('Переплата')}</option>
                            <option value="smallPay">{getLocales('Недоплата')}</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="form-control-label font-m">
                            {getLocales('Способ оплаты')}
                          </label>
                          <select
                            disabled={isLoading}
                            value={filter.paymentSort}
                            onChange={onChangeFilter}
                            name="paymentSort"
                            className="form-control"
                          >
                            <option value="">{getLocales('Все')}</option>
                            {payments.map((item) => (
                              <option value={item} key={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="form-control-label font-m">
                            {getLocales('Дата от')}
                          </label>
                          <input
                            type="date"
                            disabled={isLoading}
                            value={filter.dateFrom}
                            onChange={onChangeFilter}
                            name="dateFrom"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="form-control-label font-m">
                            {getLocales('Дата до')}
                          </label>
                          <input
                            type="date"
                            disabled={isLoading}
                            value={filter.dateTo}
                            onChange={onChangeFilter}
                            name="dateTo"
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {items.length > 0
                    ? (
                      <Table
                        search
                        columns={tableColumns}
                        items={items}
                        updateItems={updateItems}
                        rowsPerPage="10"
                      />
                    )
                    : (
                      <div className="font-m text-center">
                        {getLocales('Пополнения отсутствуют')}
                      </div>
                    )}
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topups;
