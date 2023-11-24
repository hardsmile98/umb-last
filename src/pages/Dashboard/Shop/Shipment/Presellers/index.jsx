/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace } from '@fortawesome/free-solid-svg-icons';
import { Table, ModalConfirm } from 'components';
import { getLocales, request } from 'utils';
import { useParams } from 'react-router-dom';

const initialForm = {
  category: '',
  subcategory: '',
  product: '',
  subproduct: '',
  typeofklad: 0,
};

function Presellers() {
  const { shopId } = useParams();

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectId] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({
    categories: [],
    products: [],
    presellers: [],
    typeOfKlads: [],
  });

  const [items, setItems] = useState([]);

  const [createPresell, setCreatePresell] = useState(initialForm);

  const [filter, setFilter] = useState({
    categorySort: '',
    productSort: '',
  });

  const prepareItems = useCallback(() => {
    let copy = [...data.presellers];

    if (filter.categorySort !== '') {
      copy = copy.filter((preseller) => preseller.category === +filter.categorySort);
    }

    if (filter.productSort !== '') {
      copy = copy.filter((preseller) => preseller.product === +filter.productSort);
    }
    const formattedItems = copy.map((item) => {
      const category = data.categories.find((c) => c.id === item.category);
      const subcategory = item.subcategory > 0 && (category.subcategories || [])
        .find((subc) => subc.id === item.subcategory);

      const categoryName = subcategory ? `${category.name} / ${subcategory.name}` : category.name;

      const product = data.products.find((p) => p.id === item.product);
      const subproduct = item.subproduct > 0 && (product.subproducts || [])
        .find((subp) => subp.id === item.subproduct);

      const productName = subproduct ? `${product.name} / ${subproduct.name}` : product.name;

      const type = data.typeOfKlads.find((t) => t.id === item.typeofklad);

      return {
        id: item.id,
        category: categoryName,
        product: productName,
        status: item.status,
        type: type.name,
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
          type: 'shipment',
          subtype: 'presellers',
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

  const onFilterChange = (e) => setFilter((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));

  const onCreateChange = (e) => setCreatePresell((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));

  const onCreatePreseller = () => {
    if (!createPresell.category || !createPresell.product) {
      toast.error('Заполнены не все поля');
      return;
    }

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'shipment',
          subtype: 'presellers',
          category: createPresell.category,
          subcategory: createPresell.subcategory,
          product: createPresell.product,
          subproduct: createPresell.subproduct,
          typeofklad: createPresell.typeofklad,
          shop: shopId,
          action: 'create',
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
          setCreatePresell(initialForm);
          getData();
          toast.success(response.data.message);
        } else {
          setLoading(false);
          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  };

  const sellerDelete = () => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'shipment',
          subtype: 'presellers',
          shop: shopId,
          id: selectedId,
          action: 'delete',
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
          setModalOpen(false);
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

  const changeStatus = (id) => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'shipment',
          subtype: 'presellers',
          shop: shopId,
          action: 'updateStatus',
          id,
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
          getData();
          toast.success(response.data.message);
        } else {
          setLoading(false);
          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  };

  const isSubcategoriesVisible = !!data.categories
    .find((category) => category.id === +createPresell.category)?.subcategories;
  const isSubproductsVisible = !!data.products
    .find((product) => product.id === +createPresell.product)?.subproducts;

  const tableColumns = [
    {
      title: 'ID', dataIndex: 'id', key: 'id', sort: true,
    },
    {
      title: getLocales('Город / Район'), dataIndex: 'category', key: 'category', sort: true,
    },
    {
      title: getLocales('Товар / Фасовка'), dataIndex: 'product', key: 'product', sort: true,
    },
    {
      title: getLocales('Тип клада'), dataIndex: 'type', key: 'type', sort: true,
    },
    {
      title: getLocales('Статус'),
      dataIndex: '',
      key: 'operations',
      itemClassName: 'text-center',
      headerClassName: 'text-center',
      render: (_e, item) => (
        <div className="sparkline8">
          <button
            type="button"
            onClick={() => changeStatus(item.id)}
            className={`btn  font-m auth-btn ${item.status === 1
              ? ' btn-primary' : item.status === 2
                ? ' btn-danger'
                : ' btn-secondary'}`}
          >
            {' '}
            {item.status === 1
              ? getLocales('Доступно')
              : getLocales('Отключено')}
          </button>
        </div>
      ),
    },
    {
      title: getLocales('Действия'),
      dataIndex: '',
      key: 'operations',
      itemClassName: 'text-center',
      headerClassName: 'text-center',
      render: (_e, item) => (
        <div className="sparkline8">
          <button
            type="button"
            disabled={item.status === 2}
            onClick={() => {
              setSelectId(item.id);
              setModalOpen(true);
            }}
            className="btn btn-danger btn-table"
          >
            <FontAwesomeIcon icon={faBackspace} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-lg-4">
          <div className={`block animate__animated animate__fadeIn ${isLoading ? 'blur' : ''}`}>
            <div className="block-body">
              <h4 className="font-m">
                {getLocales('Добавление возможности предзаказа')}
              </h4>

              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Город')}
                </label>

                <select
                  disabled={isLoading}
                  value={createPresell.category}
                  onChange={onCreateChange}
                  name="category"
                  className="form-control"
                >
                  <option
                    disabled
                    value=""
                  >
                    {getLocales('Не выбран')}
                  </option>
                  {data.categories.map((item) => (
                    <option
                      value={item.id}
                      key={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {isSubcategoriesVisible && (
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Район')}
                  </label>
                  <select
                    disabled={isLoading}
                    value={createPresell.subcategory}
                    onChange={onCreateChange}
                    name="subcategory"
                    className="form-control"
                  >
                    <option disabled value="">
                      {getLocales('Не выбран')}
                    </option>
                    {data.categories
                      .filter((category) => category.id === +createPresell.category)
                      .map((item) => (item.subcategories || []).map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      )))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Товар')}
                </label>
                <select
                  disabled={isLoading}
                  value={createPresell.product}
                  onChange={onCreateChange}
                  name="product"
                  className="form-control"
                >
                  <option disabled value="">
                    {getLocales('Не выбран')}
                  </option>
                  {data.products.map((item) => (
                    <option
                      value={item.id}
                      key={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {isSubproductsVisible && (
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Фасовка')}
                  </label>
                  <select
                    disabled={isLoading}
                    value={createPresell.subproduct}
                    onChange={onCreateChange}
                    name="subproduct"
                    className="form-control"
                  >
                    <option disabled value="">
                      {getLocales('Не выбран')}
                    </option>
                    {data.products
                      .filter((product) => product.id === +createPresell.product)
                      .map((item) => (item.subproducts || []).map((subproduct) => (
                        <option key={subproduct.id} value={subproduct.id}>
                          {subproduct.name}
                        </option>
                      )))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Тип клада')}
                </label>
                <select
                  disabled={isLoading}
                  value={createPresell.typeofklad}
                  onChange={onCreateChange}
                  name="typeofklad"
                  className="form-control"
                >
                  {data.typeOfKlads.map((item) => (
                    <option
                      value={item.id}
                      key={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={onCreatePreseller}
                disabled={isLoading}
                className="btn btn-primary font-m auth-btn margin-15"
              >
                {isLoading
                  ? getLocales('Загрузка...')
                  : getLocales('Добавить возможность предзаказа')}
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className={`block animate__animated animate__fadeIn ${isLoading ? 'blur' : ''}`}>
            <div className="block-body">
              <h4 className="font-m">
                {getLocales('Доступные для предзаказа направления')}
              </h4>

              <div className="avatar-block">
                <h4 className="font-m">
                  {getLocales('Сортировка')}
                </h4>

                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Город')}
                      </label>
                      <select
                        disabled={isLoading}
                        value={filter.categorySort}
                        onChange={onFilterChange}
                        name="categorySort"
                        className="form-control"
                      >
                        <option value="">
                          {getLocales('Все')}
                        </option>
                        {data.categories.map((item) => (
                          <option
                            value={item.id}
                            key={item.id}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Товар')}
                      </label>
                      <select
                        disabled={isLoading}
                        value={filter.productSort}
                        onChange={onFilterChange}
                        name="productSort"
                        className="form-control"
                      >
                        <option value="">
                          {getLocales('Все')}
                        </option>
                        {data.products.map((item) => (
                          <option
                            value={item.id}
                            key={item.id}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="margin-15">
                {items.length === 0
                  ? (
                    <div className="text-center font-m">
                      {getLocales('Направления для предзаказа отсутствуют')}
                    </div>
                  )
                  : (
                    <Table
                      columns={tableColumns}
                      items={items}
                      updateItems={(newItems) => setItems(newItems)}
                      rowsPerPage="10"
                    />
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalConfirm
        action={getLocales('Вы действительно хотите удалить данное направление предзаказа товара?')}
        consequences=""
        modal={isModalOpen}
        toggle={() => setModalOpen(false)}
        loading={isLoading}
        sendData={sellerDelete}
      />
    </>
  );
}

export default Presellers;
