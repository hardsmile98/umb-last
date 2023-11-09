import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getLocales, request } from 'utils';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

function AddressesModal({
  modal,
  toggle,
  currency,
}) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const { shopId } = useParams();

  const getData = useCallback(() => {
    setLoading(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'statistic',
          subtype: 'inStock',
          shop: shopId,
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

      const responseData = response.data.data;

      const formatted = (responseData.sellers || []).reduce((acc, cur) => {
        const category = responseData.categories.find((c) => c.id === cur.category);
        const subcategory = responseData.subcategories.find((s) => s.id === cur.subcategory);
        const product = responseData.products.find((p) => p.id === cur.product);
        const subproduct = responseData.subproducts.find((s) => s.id === cur.subproduct);

        const price = subproduct
          ? +subproduct.price
          : +product.price;

        if (!subcategory) {
          return {
            ...acc,
            [category.id]: {
              ...acc[category.id],
              value: acc[category.id]?.value
                ? acc[category.id].value + 1
                : 1,
              price: acc[category.id]?.price
                ? acc[category.id].price + price
                : +price,
              name: category.name,
              [product.id]: {
                ...acc[category.id]?.[product.id],
                value: acc[category.id]?.[product.id]?.value
                  ? acc[category.id][product.id].value + 1
                  : 1,
                price: acc[category.id]?.[product.id]?.price
                  ? acc[category.id][product.id].price + price
                  : price,
                name: product.name,
                [subproduct ? subproduct?.id : 0]: subproduct
                  ? {
                    value: acc[category.id]?.[product.id]?.[subproduct.id]?.value
                      ? acc[category.id][product.id][[subproduct.id]].value + 1
                      : 1,
                    price: acc[category.id]?.[product.id]?.[subproduct.id]?.price
                      ? acc[category.id][product.id][[subproduct.id]].price + price
                      : price,
                    name: subproduct.name,
                  } : null,
              },
            },
          };
        }

        return {
          ...acc,
          [category.id]: {
            ...acc[category.id],
            value: acc[category.id]?.value
              ? acc[category.id].value + 1
              : 1,
            price: acc[category.id]?.price
              ? acc[category.id].price + price
              : price,
            name: category.name,
            [subcategory.id]: {
              ...acc[category.id]?.[subcategory.id],
              value: acc[category.id]?.[subcategory.id]?.value
                ? acc[category.id][subcategory.id].value + 1
                : 1,
              price: acc[category.id]?.[subcategory.id]?.price
                ? acc[category.id][subcategory.id].price + price
                : price,
              name: subcategory.name,
              [product.id]: {
                ...acc[category.id]?.[subcategory.id]?.[product.id],
                value: acc[category.id]?.[subcategory.id]?.[product.id]?.value
                  ? acc[category.id][subcategory.id][product.id].value + 1
                  : 1,
                price: acc[category.id]?.[subcategory.id]?.[product.id]?.price
                  ? acc[category.id][subcategory.id][product.id].price + price
                  : price,
                name: product.name,
                [subproduct ? subproduct?.id : 0]: subproduct
                  ? {
                    value: acc[category.id]?.[subcategory.id]?.[product.id]?.[subproduct.id]?.value
                      ? acc[category.id][subcategory.id][product.id][[subproduct.id]].value + 1
                      : 1,
                    price: acc[category.id]?.[subcategory.id]?.[product.id]?.[subproduct.id]?.price
                      ? acc[category.id][subcategory.id][product.id][[subproduct.id]].price + price
                      : price,
                    name: subproduct.name,
                  } : null,
              },
            },
          },
        };
      }, {});

      setLoading(false);
      setData(formatted);
    });
  }, [shopId]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Modal
      size="md"
      isOpen={modal}
      toggle={toggle}
    >
      <div className="modal-header text-center">
        <h4 className="modal-title font-m">
          {getLocales('Количество адресов в наличии')}
        </h4>
      </div>

      <ModalBody>
        <div className={`animate__animated animate__fadeIn ${isLoading ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <ul
                  className="avatar-block font-l"
                  style={{ marginTop: 0 }}
                >
                  {Object.values(data).map(({
                    name: categoryName,
                    value: categoryValue,
                    price: categoryPrice,
                    ...subCategory
                  }) => (
                    <li key={categoryName} className="avatar-block">
                      <b>{categoryName}</b>
                      {' — '}
                      <span className="badge badge-light">
                        {`${categoryValue} ${getLocales('шт.')}`}
                      </span>
                      {' '}
                      <span className="badge badge-light">
                        {`${categoryPrice} ${currency}`}
                      </span>

                      <ul>
                        {Object.values(subCategory).map(({
                          name: subCategoryName,
                          value: subCategoryValue,
                          price: subCategoryPrice,
                          ...products
                        }) => (
                          <li key={subCategoryName}>
                            <b>{subCategoryName}</b>
                            {' — '}
                            <span className="badge badge-light">
                              {`${subCategoryValue} ${getLocales('шт.')}`}
                            </span>
                            {' '}
                            <span className="badge badge-light">
                              {`${subCategoryPrice} ${currency}`}
                            </span>

                            <ul>
                              {Object.values(products || {})
                                .filter(Boolean)
                                .map(({
                                  name: productName,
                                  value: productValue,
                                  price: productPrice,
                                  ...subProducts
                                }) => (
                                  <li key={productName}>
                                    <b>{productName}</b>
                                    {' — '}
                                    <span className="badge badge-light">
                                      {`${productValue} ${getLocales('шт.')}`}
                                    </span>
                                    {' '}
                                    <span className="badge badge-light">
                                      {`${productPrice} ${currency}`}
                                    </span>

                                    <ul>
                                      {Object.values(subProducts || {})
                                        .filter(Boolean)
                                        .map(({
                                          name: subProductName,
                                          value: subProductValue,
                                          price: subProductPrice,
                                        }) => (
                                          <li key={subProductName}>
                                            <b>{subProductName}</b>
                                            {' — '}
                                            <span className="badge badge-light">
                                              {`${subProductValue} ${getLocales('шт.')}`}
                                            </span>
                                            {' '}
                                            <span className="badge badge-light">
                                              {`${subProductPrice} ${currency}`}
                                            </span>
                                          </li>
                                        ))}
                                    </ul>
                                  </li>
                                ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
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

export default AddressesModal;
