/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { Table, ModalConfirm } from 'components';
import { request } from 'utils';
import NewsModal from './NewsModal';
import CreateNews from './CreateNews';

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        news: [],
      },
      items: [],
      modal: false,
      new: {},
      confirmModal: false,
      deleteId: 0,
      modalCreate: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.getData = this.getData.bind(this);
    this.prepareTableData = this.prepareTableData.bind(this);
    this.updateItems = this.updateItems.bind(this);
    this.change = this.change.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteModal = this.deleteModal.bind(this);
    this.togglenew = this.togglenew.bind(this);
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

  getData() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'inform',
          type: 'newsGet',
        },
        action: 'admin',
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

  togglenew() {
    const { state } = this;

    this.setState({
      modalCreate: !state.modalCreate,
    });
  }

  deleteModal(id) {
    if (String(id) !== '0') {
      this.setState({
        confirmModal: true,
        deleteId: id,
      });
    } else {
      this.setState({
        confirmModal: false,
      });
    }
  }

  delete() {
    const { state } = this;

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'inform',
          type: 'newsDelete',
          id: state.deleteId,
        },
        action: 'admin',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          this.deleteModal(0);
          this.getData();
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

  prepareTableData() {
    const { state } = this;

    const newItems = state.data.news.map((item) => ({
      id: item.id,
      content: item.content.slice(0, 25),
      date: moment.unix(item.date / 1000).format('LLL'),

    }));

    this.setState({
      items: newItems,
    });
  }

  updateItems(items) {
    this.setState({
      items,
    });
  }

  change(id) {
    const { state } = this;

    if (String(id) !== '0') {
      state.data.news.forEach((item) => {
        if (String(item.id) === String(id)) {
          this.setState({
            modal: true,
            new: item,
          });
        }
      });
    } else {
      this.setState({
        modal: !state.modal,
        new: {},
      });
    }
  }

  render() {
    const tableColumns = [
      {
        title: 'ID', dataIndex: 'id', key: 'id', sort: true,
      },
      {
        title: 'Новость', dataIndex: 'content', key: 'content', sort: true,
      },
      {
        title: 'Дата', dataIndex: 'date', key: 'date', sort: true,
      },

      {
        title: 'Действие',
        dataIndex: 'name',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        key: 'operations',
        render: (e, item) => (
          <div className="sparkline8">
            <button
              type="button"
              onClick={() => this.change(item.id)}
              className="btn btn-secondary btn-table"
            >
              <FontAwesomeIcon icon={faSearchPlus} />
            </button>

            <button
              type="button"
              onClick={() => this.deleteModal(item.id)}
              className="btn btn-danger btn-table"
            >
              <FontAwesomeIcon icon={faBackspace} />
            </button>
          </div>
        ),
      },
    ];

    const { state } = this;

    return (
      <>
        <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="font-m">
                  {'Новости '}
                  <span
                    aria-hidden
                    className="right cursor-pointer"
                    onClick={this.togglenew}
                  >
                    + Создать новость
                  </span>
                </h3>

                <Table
                  columns={tableColumns}
                  items={state.items}
                  updateItems={this.updateItems}
                  rowsPerPage="10"
                />
              </div>
            </div>
          </div>
        </div>

        <ModalConfirm
          action="Вы действительно хотите удалить новость?"
          consequences=""
          modal={state.confirmModal}
          toggle={() => this.deleteModal(0)}
          loading={state.loading}
          sendData={this.delete}
        />

        <NewsModal
          modal={state.modal}
          toggle={this.change}
          new={state.new}
          getData={this.getData}
        />

        <CreateNews
          modal={state.modalCreate}
          toggle={this.togglenew}
          getData={this.getData}
        />
      </>
    );
  }
}

export default News;
