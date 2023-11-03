/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { Table, ModalConfirm } from 'components';
import { request } from 'utils';
import FaqModal from './FaqModal';
import CreateNewFaq from './CreateNewFaq';

class Faq extends Component {
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
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'inform',
          type: 'faqGet',
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

  deleteModal(id) {
    if (id !== 0) {
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
          type: 'faqDelete',
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
      name: item.name,
      indexNum: item.indexNum,
      flag: item.flag,
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

    if (id !== 0) {
      state.data.news.forEach((item) => {
        if (item.id === id) {
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

  togglenew() {
    const { state } = this;

    this.setState({
      modalCreate: !state.modalCreate,
    });
  }

  render() {
    const tableColumns = [
      {
        title: 'ID', dataIndex: 'id', key: 'id', sort: true,
      },
      {
        title: 'Название', dataIndex: 'name', key: 'name', sort: true,
      },
      {
        title: 'Порядковый номер', dataIndex: 'indexNum', key: 'indexNum', sort: true,
      },
      {
        title: 'FLAG', dataIndex: 'flag', key: 'flag', sort: true,
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
                  {'Статьи FAQ '}
                  <span
                    aria-hidden
                    className="right cursor-pointer"
                    onClick={this.togglenew}
                  >
                    + Создать статью
                  </span>
                </h3>

                <Table
                  search={false}
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
          action="Вы действительно хотите удалить статью?"
          consequences=""
          modal={state.confirmModal}
          toggle={() => this.deleteModal(0)}
          loading={state.loading}
          sendData={this.delete}
        />

        <FaqModal
          modal={state.modal}
          toggle={this.change}
          new={state.new}
          getData={this.getData}
        />

        <CreateNewFaq
          modal={state.modalCreate}
          toggle={this.togglenew}
          getData={this.getData}
        />
      </>
    );
  }
}

export default Faq;
