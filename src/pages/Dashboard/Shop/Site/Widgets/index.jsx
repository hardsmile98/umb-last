/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable array-callback-return */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { Table, ModalConfirm } from 'components';
import { request, getLocales } from 'utils';
import WidgetModal from './WidgetModal';

// TODO
class Widgets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      name: '',
      data: {
        widgets: [],
      },
      indexPage: 0,
      content: '',
      type: 'content',
      modal: false,
      activePage: {},
      pageDelete: 0,
      modalDelete: false,
      items: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.getData = this.getData.bind(this);
    this.sendData = this.sendData.bind(this);
    this.toggle = this.toggle.bind(this);
    this.delete = this.delete.bind(this);
    this.toggleDelete = this.toggleDelete.bind(this);
    this.prepareTableData = this.prepareTableData.bind(this);
    this.updateItems = this.updateItems.bind(this);
  }

  prepareTableData() {
    const items = [];

    this.state.data.widgets.map((item) => {
      const itemModified = {
        id: item.id,
        name: item.name,
        type: item.type
          .replace(/content/g, getLocales('Текстовой'))
          .replace(/link/g, getLocales('Ссылка')),
        indexPage: item.indexPage,
      };
      items.push(itemModified);
    });

    this.setState({
      items,
    });
  }

  updateItems(items) {
    this.setState({
      items,
    });
  }

  toggleDelete(id) {
    this.setState({
      pageDelete: id,
      modalDelete: !this.state.modalDelete,
    });
  }

  delete() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'site',
          subtype: 'widgets',
          shop: this.props.match.params.shopId,
          action: 'delete',
          id: this.state.pageDelete,
        },
        action: 'shops',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          this.toggleDelete(0);
          this.getData();
          toast.success(response.data.message);
        } else {
          this.setState({
            loading: false,
          });
          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  }

  toggle(id) {
    if (id) {
      this.state.data.widgets.map((item) => {
        if (String(item.id) === String(id)) {
          this.setState({
            activePage: item,
            modal: !this.state.modal,
          });
        }
      });
    } else {
      this.setState({
        modal: !this.state.modal,
      });
    }
  }

  componentDidMount() {
    this.getData();
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox' ? 'checked' : 'value'];
    const { name } = e.target;

    this.setState({
      [name]: value,
    });
  }

  sendData() {
    if (this.state.name.length >= 1 && this.state.content.length >= 1) {
      this.setState({
        loading: true,
      });
      const data = {
        api: 'user',
        body: {
          data: {
            section: 'shop',
            type: 'site',
            subtype: 'widgets',
            shop: this.props.match.params.shopId,
            action: 'create',
            name: this.state.name,
            indexPage: this.state.indexPage,
            content: this.state.content,
            pageType: this.state.type,
          },
          action: 'shops',
        },
        headers: {
          authorization: localStorage.getItem('token'),
        },
      };

      request(data, (response) => {
        if (response.status === 200) {
          if (response.data.success) {
            this.setState({
              name: '',
              indexPage: 0,
              content: '',
              type: 'content',
            });
            this.getData();
            toast.success(response.data.message);
          } else {
            this.setState({
              loading: false,
            });
            toast.error(response.data.message);
          }
        } else {
          toast.error('Сервер недоступен');
        }
      });
    } else {
      toast.error('Заполнены не все поля');
    }
  }

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'site',
          subtype: 'widgets',
          shop: this.props.match.params.shopId,
          action: 'get',
        },
        action: 'shops',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          this.setState({
            data: response.data.data,
            loading: false,
          }, () => {
            this.prepareTableData();
          });
        } else {
          this.setState({
            loading: false,
          });
          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  }

  render() {
    const tableColumns = [
      {
        title: 'ID', dataIndex: 'id', key: 'id', sort: true,
      },
      {
        title: getLocales('Тип'), dataIndex: 'type', key: 'type', sort: true,
      },
      {
        title: getLocales('Название'), dataIndex: 'name', key: 'name', sort: true,
      },
      {
        title: getLocales('Действия'),
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        dataIndex: 'value',
        key: 'operations',
        render: (e, item) => (
          <div className="sparkline8">
            <button
              type="button"
              onClick={() => this.toggle(item.id)}
              className="btn btn-secondary btn-table"
            >
              <FontAwesomeIcon icon={faSearchPlus} />
            </button>

            <button
              type="button"
              onClick={() => this.toggleDelete(item.id)}
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
          <div className="col-lg-5" style={{ zIndex: '100' }}>
            <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <div className="row">
                  <div className="col-lg-12">
                    <h3 className="font-m">
                      {getLocales('Добавление виджета')}
                    </h3>
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Название')}
                      </label>
                      <input
                        type="text"
                        placeholder={getLocales('Введите название виджета')}
                        disabled={this.state.loading}
                        value={this.state.name}
                        onChange={this.handleChange}
                        name="name"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Порядковый номер')}
                      </label>
                      <input
                        type="number"
                        disabled={this.state.loading}
                        value={this.state.indexPage}
                        onChange={this.handleChange}
                        name="indexPage"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Тип виджета')}
                      </label>
                      <select
                        disabled={this.state.loading}
                        value={this.state.type}
                        onChange={this.handleChange}
                        name="type"
                        className="form-control"
                      >
                        <option value="content">{getLocales('Виджет с текстом')}</option>
                        <option value="link">{getLocales('Виджет-ссылка')}</option>
                      </select>
                    </div>
                    {this.state.type === 'content'
                      ? (
                        <div className="form-group">
                          <label className="form-control-label font-m">
                            {getLocales('Содержание виджета')}
                          </label>
                          <textarea
                            placeholder={getLocales('Введите содержание виджета')}
                            value={this.state.content}
                            className="form-control"
                            name="content"
                            onChange={this.handleChange}
                          />
                        </div>
                      )
                      : (
                        <div className="form-group">
                          <label className="form-control-label font-m">
                            {getLocales('Ссылка')}
                          </label>
                          <input
                            placeholder={getLocales('Вставьте ссылку')}
                            type="text"
                            disabled={this.state.loading}
                            value={this.state.content}
                            onChange={this.handleChange}
                            name="content"
                            className="form-control"
                          />
                        </div>
                      )}
                  </div>

                  <div className="col-lg-12">
                    <button
                      type="button"
                      onClick={this.sendData}
                      disabled={this.state.loading}
                      className="btn btn-primary font-m auth-btn margin-15"
                    >
                      {this.state.loading
                        ? <>{getLocales('Загрузка...')}</>
                        : <>{getLocales('Создать виджет')}</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <div className="row">
                  <div className="col-lg-12">
                    <h3 className="font-m">
                      {getLocales('Виджеты')}
                    </h3>

                    {this.state.data.widgets.length > 0
                      ? (
                        <Table
                          search={false}
                          columns={tableColumns}
                          items={this.state.items}
                          updateItems={this.updateItems}
                          rowsPerPage="10"
                        />
                      )
                      : (
                        <div className="text-center font-m">
                          {getLocales('Виджеты отсутствуют')}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <WidgetModal
          toggleDelete={this.toggleDelete}
          getData={this.getData}
          {...this.props}
          page={this.state.activePage}
          modal={this.state.modal}
          toggle={this.toggle}
        />

        <ModalConfirm
          action={getLocales('Вы действительно хотите удалить данный виджет?')}
          consequences=""
          modal={this.state.modalDelete}
          toggle={this.toggleDelete}
          loading={this.state.loading}
          sendData={this.delete}
        />
      </>
    );
  }
}

export default Widgets;
