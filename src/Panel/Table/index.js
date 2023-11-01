import React from 'react'
import moment from 'moment'

import global from '../Global/index'

class Table extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            query: '',
            items: [],
            defaultItems: this.props.items,
            currentPage: 1,
            pages: [],
            sort: {}
        }

        this.resetSortAnotherColumns = this.resetSortAnotherColumns.bind(this)
        this.sortColumn = this.sortColumn.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }


    convertDate(date_str, format = 'DD.MM.YYYY [в] HH:mm:ss') {
        moment.locale('ru')
        moment.updateLocale('ru')
        const date = moment.utc(date_str)

        return date.format(format)
    }

    handleSearch(event) {
        const query = event.target.value
        const regex = new RegExp(query, 'gi')
        let items = this.props.items
        let newItems = []

        if (query.length > 0) {
            items.map((item) => {
                for (let k in item) {
                    if (regex.test(item[k])) {
                        newItems.push(item)
                        break
                    }
                }
            })
        }

        this.setState({
            query: query,
            items: newItems,
            currentPage: 1
        })


    }

    resetSortAnotherColumns(columnName) {
        let sort = {}

        this.props.columns.map((item) => {
            if (item.sort && item.dataIndex != columnName) {
                sort[item.dataIndex] = 0
            }
        })

        this.setState({
            sort: sort
        })
    }

    sortColumn(columnName) {
        this.resetSortAnotherColumns(columnName)
        let sort = this.state.sort

        if (sort[columnName] == 1) {
            sort[columnName] = -1
        } else if (sort[columnName] == -1) {
            sort[columnName] = 0
        } else {
            sort[columnName] = 1
        }

        this.setState({
            sort: sort
        })


        const koef = this.state.sort[columnName]
        let sortedItems = []

        if (koef) {
            sortedItems = this.props.items.sort(function (a, b) {

                return (a[columnName] < b[columnName]) ? -koef : (a[columnName] > b[columnName]) ? koef : 0
            })
        } else {
            sortedItems = this.props.items.sort(function (a, b) {

                return (a.id < b.id) ? -1 : (a.id > b.id) ? 1 : 0
            })
        }

    }

    clickPaginationItem(i) {
        if (i >= 1 && i <= Math.ceil(this.props.items.length / this.props.rowsPerPage)) {
            this.setState({
                currentPage: i
            })
        }
    }

    renderPagination() {
        const renderPageNumbers = []

        renderPageNumbers.push(<div
            className="btn btn-default item"
            onClick={() => this.clickPaginationItem(+this.state.currentPage - 1)}>{global.getLocales("Назад")}</div>)
        for (let i = 1; i <= Math.ceil(this.props.items.length / this.props.rowsPerPage); i++) {
            if (i == 1 || i == Math.ceil(this.props.items.length / this.props.rowsPerPage) || (this.state.currentPage >= i && i >= this.state.currentPage - 2) || (this.state.currentPage <= i && i <= this.state.currentPage + 2)) {

                if (this.state.currentPage - 3 > 1 && i == this.state.currentPage - 2) {
                    renderPageNumbers.push(<div
                        className="btn btn-default item"
                        disabled>...</div>)
                }

                renderPageNumbers.push(<div key={'page-' + i} id={i}
                    className={"btn btn-default item " + (i == this.state.currentPage ? 'active' : '')}
                    onClick={() => this.clickPaginationItem(i)}>{i}</div>)

                if (this.state.currentPage + 3 < Math.ceil(this.props.items.length / this.props.rowsPerPage) && i == this.state.currentPage + 2) {
                    renderPageNumbers.push(<div
                        className="btn btn-default item"
                        disabled>...</div>)
                }

            }
        }
        renderPageNumbers.push(<div
            className="btn btn-default item"
            onClick={() => this.clickPaginationItem(+this.state.currentPage + 1)}>{global.getLocales("Вперед")}</div>)

        return renderPageNumbers
    }

    prepareItems() {
        let items = []

        if (this.state.query.length > 0) {
            items = this.state.items
        } else {
            items = this.props.items
        }

        const firstEl = (this.state.currentPage - 1) * this.props.rowsPerPage
        const lastEl = firstEl + +this.props.rowsPerPage

        return items.slice(firstEl, lastEl)
    }


    render() {

        const items = this.prepareItems()

        return (
            <div className="table-wrapper">
                <style>{'.pagination .item {text-align: center;border-radius: 0 !important;padding: 5px;border: 1px solid #44464f;borderRadius: 3px;marginLeft: 5px;min-width: 35px;height: 35px;textAlign: center;cursor: pointer} .pagination .active {background-color: #44464f;} '}</style>
                {
                    this.props.search == false
                        ?
                        ''
                        :
                        <div className="search-wrapper">
                            <label className='font-m'>{global.getLocales("Поиск")} ({global.getLocales("Всего")}: {this.props.items.length} {global.getLocales("шт.")})</label>
                            <input type="text"
                                className="form-control"
                                value={this.state.query}
                                onChange={this.handleSearch}
                                placeholder={global.getLocales("Поиск")}
                            />
                        </div>
                }
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            {this.props.columns.map((item, index) =>
                                <th key={index} className={item.headerClassName}>
                                    {
                                        (item.sort === true)
                                            ?
                                            <>
                                                <span className="cursor-pointer"
                                                    onClick={() => this.sortColumn(item.dataIndex)}>{item.title}</span>&nbsp;
                                                {
                                                    ''
                                                }
                                            </>
                                            :
                                            <>{item.title}</>
                                    }
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => {
                            return (
                                <tr key={item.id} data-id={item.id}>
                                    {
                                        this.props.columns.map((field, index) =>
                                            (field.dataIndex == '' || field.key == 'operations')
                                                ?
                                                <td key={index}
                                                    className={field.itemClassName}>{field.render(field.id, item)}</td>
                                                :
                                                <td key={index} className={field.itemClassName}>{item[field.dataIndex]}</td>
                                        )
                                    }
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="pagination pull-right">{this.renderPagination()}
                </div>
            </div>
        )
    }
}

export default Table