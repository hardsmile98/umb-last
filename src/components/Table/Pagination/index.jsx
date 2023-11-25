/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react';
import { getLocales } from 'utils';

const ellipsis = '...';

function Pagination({
  page,
  setPage,
  rowsPerPage,
  countItems,
}) {
  const countPages = Math.ceil(countItems / rowsPerPage);

  const onClickPaginationItem = (i) => {
    if (i > countPages || i <= 0) return;

    setPage(i);
  };

  const generatePaginationItems = (pageParam, countPagesParam, onSides = 3) => {
    const paginationItems = [];

    for (let i = 1; i <= countPagesParam; i += 1) {
      const offset = (i === 1 || countPagesParam) ? onSides + 1 : onSides;

      if (i === 1 || (pageParam - offset <= i && pageParam + offset >= i)
            || i === pageParam || i === countPagesParam) {
        paginationItems.push(i);
      } else if (i === pageParam - (offset + 1) || i === pageParam + (offset + 1)) {
        paginationItems.push(ellipsis);
      }
    }

    return paginationItems;
  };

  const paginationItems = useMemo(
    () => generatePaginationItems(page, countPages, 1),
    [countPages, page],
  );

  if (!countPages) {
    return null;
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-default item"
        disabled={page === 1}
        onClick={() => onClickPaginationItem(page - 1)}
      >
        {getLocales('Назад')}
      </button>

      {paginationItems.map((i, idx) => (
        <button
          type="button"
          key={`page-${i + idx}`}
          id={i}
          disabled={i === ellipsis}
          className={`btn btn-default item ${i === page ? 'active' : ''}`}
          onClick={() => i !== ellipsis && onClickPaginationItem(i)}
        >
          {i}
        </button>
      ))}

      <button
        type="button"
        className="btn btn-default item"
        disabled={page === countPages}
        onClick={() => onClickPaginationItem(page + 1)}
      >
        {getLocales('Вперед')}
      </button>
    </div>
  );
}

export default Pagination;
