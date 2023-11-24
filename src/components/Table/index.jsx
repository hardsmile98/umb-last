/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useState } from 'react';
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

  // Поиск по строке
  const handleSearch = (e) => {
    const regex = new RegExp(query, 'gi');

    const itemsFormatted = query.length
      ? items.reduce((acc, cur) => {
        Object.values(cur).forEach((value) => {
          if (regex.test(value)) {
            acc.push(cur);
          }
        });

        return acc;
      }, [])
      : items;

    setTableItems(itemsFormatted);
    setQuery(e.target.value);
    setPage(1);
  };

  // Подготовливаем данные
  const prepareItems = useCallback(() => {
    const startPosition = (page - 1) * (+rowsPerPage);
    const endPosition = startPosition + (+rowsPerPage);

    setTableItems(tableItems.slice(startPosition, endPosition));
  }, [tableItems, page, rowsPerPage]);

  useEffect(() => {
    prepareItems();
  }, [prepareItems]);

  // Сортировка колонок
  const sortColumn = (columnName) => {
    const newSort = columns.reduce((acc, cur) => {
      if (!cur.sort) return acc;

      if (cur.dataIndex !== columnName) {
        return {
          ...acc,
          [cur.dataIndex]: 0,
        };
      }

      let newSortValue = null;

      if (sort[columnName] === 0) {
        newSortValue = 1;
      }

      if (sort[columnName] === 1) {
        newSortValue = -1;
      }

      if (sort[columnName] === -1) {
        newSortValue = 0;
      }

      if (!sort[columnName]) {
        newSortValue = 1;
      }

      return {
        ...acc,
        [cur.dataIndex]: newSortValue,
      };
    }, {});

    setSort(newSort);
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
                      className="cursor-pointer"
                      onClick={() => sortColumn(item.dataIndex)}
                    >
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
        <Pagination />
      </div>
    </div>
  );
}

export default Table;
