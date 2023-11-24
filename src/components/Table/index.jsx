/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { getLocales } from 'utils';
import Pagination from './Pagination';

function Table({
  items,
  search,
  columns,
  rowsPerPage,
}) {
  const [tableItems, setTableItems] = useState(items);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState({});
  const [countItems, setCountItems] = useState(items.length);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  // Подготовливаем данные
  const prepareItems = useCallback(() => {
    const regex = new RegExp(query, 'gi');

    // Ищем вхождение элемнтов по поиску
    const itemsFormatted = query.length > 0
      ? items.reduce((acc, cur) => {
        Object.values(cur).some((value) => {
          if (regex.test(value)) {
            acc.push(cur);
            return true;
          }
          return false;
        });

        return acc;
      }, [])
      : items;

    const sortKey = Object.keys(sort);

    // Сортируем если есть сортировка
    const sortedItems = sortKey.length > 0
      ? itemsFormatted.sort((a, b) => {
        const columnName = sortKey[0];
        const koef = sort[columnName];

        // Если -1, то сортируем по убыванию,
        // Если 1, то по возрастанию
        if (koef) {
          return a[columnName] < b[columnName]
            ? -koef
            : a[columnName] > b[columnName]
              ? koef
              : 0;
        }

        // Стандратная сортировка по id
        return (a.id < b.id)
          ? -1
          : (a.id > b.id)
            ? 1
            : 0;
      })
      : itemsFormatted;

    setCountItems(sortedItems.length);

    const startPosition = (page - 1) * (+rowsPerPage);
    const endPosition = startPosition + (+rowsPerPage);

    setTableItems(sortedItems.slice(startPosition, endPosition));
  }, [items, query, sort, page, rowsPerPage]);

  useEffect(() => {
    prepareItems();
  }, [prepareItems]);

  // Сортировка
  const sortColumn = (columnName) => {
    setSort((prev) => {
      if (prev[columnName] === 1) {
        return {
          [columnName]: -1,
        };
      }

      if (prev[columnName] === 0) {
        return {
          [columnName]: 1,
        };
      }

      if (prev[columnName] === -1) {
        return {
          [columnName]: 0,
        };
      }

      return {
        [columnName]: 1,
      };
    });
  };

  return (
    <div className="table-wrapper">
      {search && (
        <div className="search-wrapper">
          <label className="font-m">
            {getLocales('Поиск')}
            {' ('}
            {getLocales('Всего')}
            {': '}
            {items.length}
            {' '}
            {getLocales('шт.')}
            )
          </label>

          <input
            type="text"
            className="form-control"
            value={query}
            onChange={handleSearch}
            placeholder={getLocales('Поиск')}
          />
        </div>
      )}

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            {columns.map((item, index) => (
              <th
                key={index}
                className={item.headerClassName}
              >
                {item.sort
                  ? (
                    <span
                      aria-hidden
                      className="cursor-pointer sort-table"
                      onClick={() => sortColumn(item.dataIndex)}
                    >
                      <FontAwesomeIcon icon={sort[item.dataIndex] === 1
                        ? faSortDown
                        : sort[item.dataIndex] === -1
                          ? faSortUp
                          : faSort}
                      />
                      {' '}
                      {item.title}
                    </span>
                  )
                  : item.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableItems.map((item, idx) => (
            <tr key={idx}>
              {columns.map((field, index) => ((!field.dataIndex || field.key === 'operations')
                ? (
                  <td
                    key={index}
                    className={field.itemClassName}
                  >
                    {field.render(field.id, item)}
                  </td>
                )
                : (
                  <td
                    key={index}
                    className={field.itemClassName}
                  >
                    {item[field.dataIndex]}
                  </td>
                )))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination pull-right">
        <Pagination
          page={page}
          setPage={setPage}
          countItems={countItems}
          rowsPerPage={rowsPerPage}
        />
      </div>
    </div>
  );
}

export default Table;
