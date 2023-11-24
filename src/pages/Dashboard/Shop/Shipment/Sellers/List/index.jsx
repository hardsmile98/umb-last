/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearchPlus,
  faBackspace,
  faCashRegister,
} from '@fortawesome/free-solid-svg-icons';
import { request, getLocales } from 'utils';
import { Table, ModalConfirm } from 'components';
import SellerModal from './Modal';

function SellersList({ admin }) {
  const { shopId } = useParams();

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({
    categories: [],
    products: [],
    sellers: [],
    canView: false,
    employees: [],
    typeOfKlads: [],
  });
  const [filter, setFilter] = useState({
    categorySort: '',
    subcategorySort: '',
    productSort: '',
    subproductSort: '',
    typeofkladSort: '',
    employeeSort: '',
  });
  const [items, setItems] = useState([]);

  const [selectedId, setSelectId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editSeller, setEditSeller] = useState(null);
  const [action, setAction] = useState(null);

  const onChangeFilter = (e) => setFilter((prev) => ({
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
          type: 'shipment',
          subtype: 'sellers',
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

  const prepareItems = useCallback(() => {
    let copy = [...data.sellers];

    if (filter.categorySort !== '') {
      copy = copy.filter((seller) => seller.category === +filter.categorySort);
    }

    if (filter.subcategorySort !== '') {
      copy = copy.filter((seller) => seller.subcategory === +filter.subcategorySort);
    }

    if (filter.productSort !== '') {
      copy = copy.filter((seller) => seller.product === +filter.productSort);
    }

    if (filter.subproductSort !== '') {
      copy = copy.filter((seller) => seller.subproduct === +filter.subproductSort);
    }

    if (filter.typeofkladSort !== '') {
      copy = copy.filter((seller) => seller.typeofklad === +filter.typeofkladSort);
    }

    if (filter.employeeSort !== '') {
      copy = copy.filter((seller) => seller.user === +filter.employeeSort);
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

  const setProd = () => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'shipment',
          subtype: 'sellers',
          shop: shopId,
          id: selectedId,
          action: 'setProd',
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

  const sellerDelete = () => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'shipment',
          subtype: 'sellers',
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

  const onClicAction = (id, actionName) => {
    setSelectId(id);
    setAction(actionName);
    setModalOpen(true);
  };

  const onEditModalOpen = (id) => {
    const seller = data.sellers.find((s) => s.id === id);

    setEditSeller(seller);
    setEditModalOpen(true);
  };

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
      title: getLocales('Тип'), dataIndex: 'type', key: 'type', sort: true,
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
            className={`btn  font-m auth-btn ${item.status === 1
              ? ' btn-primary'
              : item.status === 2
                ? ' btn-danger'
                : ' btn-secondary'}`}
          >
            {' '}
            {item.status === 1
              ? getLocales('В продаже')
              : item.status === 2 ? getLocales('На проверке')
                : item.status === 3 ? getLocales('Требует доработки')
                  : getLocales('Зарезервирован')}
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
            onClick={() => onEditModalOpen(item.id)}
            className="btn btn-secondary btn-table"
          >
            <FontAwesomeIcon icon={faSearchPlus} />
          </button>

          {admin && (
            <button
              type="button"
              alt={getLocales('Пометить проданным')}
              onClick={() => onClicAction(item.id, 'setProd')}
              className="btn btn-secondary btn-table"
            >
              <FontAwesomeIcon icon={faCashRegister} />
            </button>
          )}

          <button
            type="button"
            disabled={item.status === 0}
            onClick={() => onClicAction(item.id, 'delete')}
            className="btn btn-danger btn-table"
          >
            <FontAwesomeIcon icon={faBackspace} />
          </button>
        </div>
      ),
    },
  ];

  const isSubcategoriesVisible = !!data.categories
    .find((category) => category.id === +filter.categorySort)?.subcategories;
  const isSubproductsVisible = !!data.products
    .find((product) => product.id === +filter.productSort)?.subproducts;

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className={`block animate__animated animate__fadeIn ${isLoading ? 'blur' : ''}`}>
            <div className="block-body">
              <h4 className="font-m">
                {getLocales('Адреса')}
              </h4>

              <div className="avatar-block">
                <h4 className="font-m">
                  {getLocales('Сортировка')}
                </h4>

                <div className="row">
                  <div className={`${isSubcategoriesVisible ? 'col-lg-3' : 'col-lg-6'}`}>
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
                        {data.categories.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {isSubcategoriesVisible && (
                    <div className="col-lg-3">
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Район')}
                        </label>
                        <select
                          disabled={isLoading}
                          value={filter.subcategorySort}
                          onChange={onChangeFilter}
                          name="subcategorySort"
                          className="form-control"
                        >
                          <option value="">{getLocales('Все')}</option>
                          {data.categories
                            .filter((category) => category.id === +filter.categorySort)
                            .map((item) => (item.subcategories || []).map((subcategory) => (
                              <option key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                              </option>
                            )))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className={`${isSubproductsVisible ? 'col-lg-3' : 'col-lg-6'}`}>
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
                        {data.products.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {isSubproductsVisible && (
                    <div className="col-lg-3">
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Фасовка')}
                        </label>
                        <select
                          disabled={isLoading}
                          value={filter.subproductSort}
                          onChange={onChangeFilter}
                          name="subproductSort"
                          className="form-control"
                        >
                          <option value="">{getLocales('Все')}</option>
                          {data.products
                            .filter((product) => product.id === +filter.productSort)
                            .map((item) => (item.subproducts || []).map((subproduct) => (
                              <option key={subproduct.id} value={subproduct.id}>
                                {subproduct.name}
                              </option>
                            )))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Тип клада')}
                      </label>
                      <select
                        disabled={isLoading}
                        value={filter.typeofkladSort}
                        onChange={onChangeFilter}
                        name="typeofkladSort"
                        className="form-control"
                      >
                        <option value="">{getLocales('Все')}</option>
                        {data.typeOfKlads.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Сотрудник')}
                      </label>
                      <select
                        disabled={isLoading}
                        value={filter.employeeSort}
                        onChange={onChangeFilter}
                        name="employeeSort"
                        className="form-control"
                      >
                        <option value="">{getLocales('Все')}</option>
                        {data.employees.map((item) => (
                          <option key={item.systemId} value={item.systemId}>
                            {item.login}
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
                      {getLocales('Адреса отсутствуют')}
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

      <SellerModal
        typeOfKlads={data.typeOfKlads}
        admin={admin}
        employees={data.employees}
        canView={data.canView}
        getData={getData}
        modal={isEditModalOpen}
        toggle={() => setEditModalOpen(false)}
        seller={editSeller}
        categories={data.categories}
        products={data.products}
      />

      <ModalConfirm
        action={action === 'delete'
          ? getLocales('Вы действительно хотите перенести данный адрес в раздел удаленных товаров?')
          : getLocales('Вы действительно хотите отметить данный адрес как проданный?')}
        consequences=""
        modal={isModalOpen}
        toggle={() => setModalOpen(false)}
        loading={isLoading}
        sendData={action === 'delete'
          ? sellerDelete
          : setProd}
      />
    </>
  );
}

export default SellersList;
