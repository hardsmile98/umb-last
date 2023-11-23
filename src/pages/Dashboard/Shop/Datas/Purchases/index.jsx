/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useParams } from 'react-router-dom';
import { Table } from 'components';
import { request, getLocales } from 'utils';

function Purchases() {
  const { shopId } = useParams();

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({
    purchases: [],
    currency: 'EE',
    users: [],
  });
  const [filter, setFilter] = useState({
    categorySort: '',
    productSort: '',
    typeSort: '',
    dateFrom: '',
    dateTo: '',
  });
  const [sortData, setSortData] = useState({
    categories: [],
    products: [],
    types: [],
  });
  const [items, setItems] = useState([]);

  const onChangeFilter = (e) => setFilter((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));

  const getSortData = (purchases) => {
    if (purchases.length) {
      const formatted = purchases.reduce((acc, cur) => {
        const { category, product, type } = cur;

        if (!acc.categories.includes(category)) {
          acc.categories.push(category);
        }
        if (!acc.products.includes(product)) {
          acc.products.push(product);
        }
        if (!acc.types.includes(type)) {
          acc.types.push(type);
        }

        return acc;
      }, {
        categories: [],
        products: [],
        types: [],
      });

      setSortData(formatted);
    }
  };

  const prepareItems = useCallback(() => {
    let copy = [...data.purchases];

    if (filter.categorySort !== '') {
      copy = copy.filter((purchase) => purchase.category === filter.categorySort);
    }

    if (filter.productSort !== '') {
      copy = copy.filter((purchase) => purchase.product === filter.productSort);
    }

    if (filter.typeSort !== '') {
      copy = copy.filter((purchase) => purchase.type === filter.typeSort);
    }

    if (filter.dateFrom !== '') {
      copy = copy.filter((purchase) => +purchase.closed >= +new Date(filter.dateFrom));
    }

    if (filter.dateTo !== '') {
      copy = copy.filter((purchase) => +purchase.closed <= +new Date(filter.dateTo));
    }

    const formattedItems = copy.map((item) => {
      const user = data.users.find((u) => +u.id === +item.user);

      return {
        id: item.id,
        category: item.category,
        subcategory: item.subcategory ? item.subcategory : '-',
        product: item.product,
        subproduct: item.subproduct ? item.subproduct : '-',
        sum: item.sum,
        date: moment.unix(item.closed / 1000).format('LLL'),
        status: item.status,
        login: user.name || 'Anonym',
        user: item.user,
        type: item.type,
        notfound: item.notfound,
      };
    });

    setItems(formattedItems);
  }, [filter, data]);

  useEffect(() => {
    prepareItems();
  }, [prepareItems]);

  const getData = useCallback(() => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'datas',
          subtype: 'purchases',
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
        toast.success(response.data.message);
        setLoading(false);
        return;
      }

      getSortData(response.data.data.purchases);
      setData(response.data.data);
      setLoading(false);
    });
  }, [shopId]);

  useEffect(() => {
    getData();
  }, [getData]);

  const tableColumns = [
    {
      title: 'ID', dataIndex: 'id', key: 'id', sort: true,
    },
    {
      title: getLocales('Город'), dataIndex: 'category', key: 'category', sort: true,
    },
    {
      title: getLocales('Район'), dataIndex: 'subcategory', key: 'subcategory', sort: true,
    },
    {
      title: getLocales('Товар'), dataIndex: 'product', key: 'product', sort: true,
    },
    {
      title: getLocales('Фасовка'), dataIndex: 'subproduct', key: 'subproduct', sort: true,
    },
    {
      title: getLocales('Сумма'),
      dataIndex: 'sum',
      sort: true,
      key: 'operations',
      render: (_e, item) => (
        <span>
          {item.sum}
          {' '}
          {data.currency}
        </span>
      ),
    },
    {
      title: getLocales('Покупатель'),
      dataIndex: 'user',
      itemClassName: 'text-center',
      headerClassName: 'text-center',
      key: 'operations',
      render: (e, item) => (String(item.user) === '0'
        ? 'Anonym'
        : (
          <NavLink to={`/dashboard/shops/${shopId}/datas/users/${item.user}`}>
            {item.login}
          </NavLink>

        )),
    },
    {
      title: getLocales('Способ оплаты'), dataIndex: 'type', key: 'type', sort: true,
    },
    {
      title: getLocales('Дата'), dataIndex: 'date', key: 'date', sort: true,
    },
    {
      title: getLocales('Теги'),
      dataIndex: 'tags',
      itemClassName: 'text-center',
      headerClassName: 'text-center',
      key: 'operations',
      render: (_e, item) => (String(item.notfound) === '1' && (
        <span
          title={getLocales('Ненаход')}
          className="text-danger"
        >
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </span>
      )),
    },
    {
      title: getLocales('Действие'),
      dataIndex: 'name',
      itemClassName: 'text-center',
      headerClassName: 'text-center',
      key: 'operations',
      render: (_e, item) => (
        <NavLink
          to={`/dashboard/shops/${shopId}/datas/purchases/${item.id}`}
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
              {getLocales('Покупки')}
            </h3>

            {data.purchases.length === 0
              ? (
                <div className="text-center font-m">
                  {getLocales('Покупки отсутствуют')}
                </div>
              )
              : (
                <>
                  <div className="avatar-block">
                    <h4 className="font-m">
                      {getLocales('Сортировка')}
                    </h4>

                    <div className="row">
                      <div className="col-lg-4">
                        <div className="form-group">
                          <label className="form-control-label font-m">
                            {getLocales('Город')}
                          </label>
                          <select
                            disabled={isLoading}
                            value={filter.categorySort}
                            onChange={onChangeFilter}
                            name="categorySort"
                            className="form-control"
                          >
                            <option value="">{getLocales('Все')}</option>
                            {sortData.categories.map((item) => (
                              <option value={item} key={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="form-group">
                          <label className="form-control-label font-m">
                            {getLocales('Товар')}
                          </label>
                          <select
                            disabled={isLoading}
                            value={filter.productSort}
                            onChange={onChangeFilter}
                            name="productSort"
                            className="form-control"
                          >
                            <option value="">{getLocales('Все')}</option>
                            {sortData.products.map((item) => (
                              <option
                                value={item}
                                key={item}
                              >
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="form-group">
                          <label className="form-control-label font-m">
                            {getLocales('Способ оплаты')}
                          </label>
                          <select
                            disabled={isLoading}
                            value={filter.typeSort}
                            onChange={onChangeFilter}
                            name="typeSort"
                            className="form-control"
                          >
                            <option value="">{getLocales('Все')}</option>
                            {sortData.types.map((item) => (
                              <option
                                value={item}
                                key={item}
                              >
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
                        updateItems={(newItems) => setItems(newItems)}
                        rowsPerPage="10"
                      />
                    )
                    : (
                      <div className="font-m text-center">
                        {getLocales('Покупки отсутствуют')}
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

export default Purchases;
