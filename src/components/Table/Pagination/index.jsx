/* eslint-disable no-unused-vars */
import React from 'react';

function Pagination({
  page,
  setPage,
  rowsPerPage,
  countItems,
}) {
  const countPages = Math.ceil(countItems / rowsPerPage);

  if (!countPages) {
    return null;
  }

  return (
    <div>pagination</div>
  );
}

export default Pagination;
