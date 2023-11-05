/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { getLocales } from 'utils';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      items: [],
      currentPage: 1,
      sort: {},
    };

    this.resetSortAnotherColumns = this.resetSortAnotherColumns.bind(this);
    this.sortColumn = this.sortColumn.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(event) {
    const query = event.target.value;
    const regex = new RegExp(query, 'gi');
    const { items } = this.props;
    const newItems = [];

    if (query.length > 0) {
      items.map((item) => {
        for (const k in item) {
          if (regex.test(item[k])) {
            newItems.push(item);
            break;
          }
        }
      });
    }

    this.setState({
      query,
      items: newItems,
      currentPage: 1,
    });
  }

  resetSortAnotherColumns(columnName) {
    const sort = {};

    this.props.columns.map((item) => {
      if (item.sort && item.dataIndex !== columnName) {
        sort[item.dataIndex] = 0;
      }

      return item;
    });

    this.setState({
      sort,
    });
  }

  sortColumn(columnName) {
    this.resetSortAnotherColumns(columnName);
    const { sort } = this.state;

    if (sort[columnName] === 1) {
      sort[columnName] = -1;
    } else if (sort[columnName] === -1) {
      sort[columnName] = 0;
    } else {
      sort[columnName] = 1;
    }

    this.setState({
      sort,
    });

    const koef = this.state.sort[columnName];
    let sortedItems = [];

    if (koef) {
      sortedItems = this.props.items
        .sort((a, b) => ((a[columnName] < b[columnName])
          ? -koef
          : (a[columnName] > b[columnName])
            ? koef
            : 0));
    } else {
      sortedItems = this.props.items
        .sort((a, b) => ((a.id < b.id) ? -1 : (a.id > b.id)
          ? 1
          : 0));
    }
  }

  clickPaginationItem(i) {
    if (i >= 1 && i <= Math.ceil(this.props.items.length / this.props.rowsPerPage)) {
      this.setState({
        currentPage: i,
      });
    }
  }

  prepareItems() {
    let items = [];

    if (this.state.query.length > 0) {
      items = this.state.items;
    } else {
      items = this.props.items;
    }

    const firstEl = (this.state.currentPage - 1) * this.props.rowsPerPage;
    const lastEl = firstEl + +this.props.rowsPerPage;

    return items.slice(firstEl, lastEl);
  }

  renderPagination() {
    const renderPageNumbers = [];

    renderPageNumbers.push(<div
      className="btn btn-default item"
      onClick={() => this.clickPaginationItem(+this.state.currentPage - 1)}
    >
      {getLocales('Назад')}
    </div>);

    for (let i = 1; i <= Math.ceil(this.props.items.length / this.props.rowsPerPage); i += 1) {
      if (i === 1 || i === Math.ceil(this.props.items.length / this.props.rowsPerPage)
        || (this.state.currentPage >= i && i >= this.state.currentPage - 2)
        || (this.state.currentPage <= i && i <= this.state.currentPage + 2)) {
        if (this.state.currentPage - 3 > 1 && i === this.state.currentPage - 2) {
          renderPageNumbers.push(<div
            className="btn btn-default item"
            disabled
          >
            ...
          </div>);
        }

        renderPageNumbers.push(<div
          key={`page-${i}`}
          id={i}
          className={`btn btn-default item ${i === this.state.currentPage ? 'active' : ''}`}
          onClick={() => this.clickPaginationItem(i)}
        >
          {i}
        </div>);

        if (this.state.currentPage + 3 < Math.ceil(this.props.items.length / this.props.rowsPerPage) && i === this.state.currentPage + 2) {
          renderPageNumbers.push(<div
            className="btn btn-default item"
            disabled
          >
            ...
          </div>);
        }
      }
    }

    renderPageNumbers.push(<div
      className="btn btn-default item"
      onClick={() => this.clickPaginationItem(+this.state.currentPage + 1)}
    >
      {getLocales('Вперед')}
    </div>);

    return renderPageNumbers;
  }

  render() {
    const items = this.prepareItems();

    return (
      <div className="table-wrapper">
        <style>
          {'.pagination .item {text-align: center;border-radius: 0 !important;padding: 5px;border: 1px solid #44464f;borderRadius: 3px;marginLeft: 5px;min-width: 35px;height: 35px;textAlign: center;cursor: pointer} .pagination .active {background-color: #44464f;} '}
        </style>

        {this.props.search === false
          ? ''
          : (
            <div className="search-wrapper">
              <label className="font-m">
                {getLocales('Поиск')}
                {' '}
                (
                {getLocales('Всего')}
                :
                {' '}
                {this.props.items.length}
                {' '}
                {getLocales('шт.')}
                )
              </label>
              <input
                type="text"
                className="form-control"
                value={this.state.query}
                onChange={this.handleSearch}
                placeholder={getLocales('Поиск')}
              />
            </div>
          )}

        <table className="table table-striped table-hover">
          <thead>
            <tr>
              {this.props.columns.map((item, index) => (
                <th key={index} className={item.headerClassName}>
                  {(item.sort === true)
                    ? (
                      <>
                        <span
                          className="cursor-pointer"
                          onClick={() => this.sortColumn(item.dataIndex)}
                        >
                          {item.title}
                        </span>
                        &nbsp;
                      </>
                    )
                    : item.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} data-id={item.id}>
                {this.props.columns
                  .map((field, index) => ((field.dataIndex === '' || field.key === 'operations')
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
          {this.renderPagination()}
        </div>
      </div>
    );
  }
}

export default Table;
