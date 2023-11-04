/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';

import { toast } from 'react-toastify';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus, faBackspace } from '@fortawesome/free-solid-svg-icons';

import { getLocales, request } from 'utils';
import { ModalConfirm, Table } from 'components';
import WalletModal from './WalletModal';

class CryptoWallets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        wallets: [],
        directions: {
          btc: {
            name: 'btc',
            title: 'BitCoin',
          },
        },
      },
      type: 'none',
      note: '',
      wallet: '',
      items: [],
      delete: false,
      deleteTarget: 0,
      infoModal: false,
      infoWallet: {
        id: 0,
        type: 'NONE',
        value: 'NONE',
        created: 0,
        note: '',
      },
    };
    this.getData = this.getData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addWallet = this.addWallet.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteWallet = this.deleteWallet.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
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
          section: 'crypto',
          type: 'get',
        },
        action: 'wallets',
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
          });

          this.prepareTableData();
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

  toggleInfo(id) {
    const { state } = this;

    state.data.wallets.forEach((item) => {
      if (item.id === id) {
        this.setState({
          infoWallet: item,
        });
      }
    });

    this.setState({
      infoModal: !state.infoModal,
    });
  }

  delete(id) {
    const { state } = this;

    this.setState({
      delete: !state.delete,
      deleteTarget: id,
    });
  }

  prepareTableData() {
    const { state } = this;

    const itemModified = state.data.wallets.map((item) => ({
      id: item.id,
      type: item.type.toUpperCase(),
      value: item.note === 'Отсутствует'
        ? (`${item.value.slice(0, 15)}...`)
        : item.note,
      created: moment.unix(item.created / 1000).format('LLL'),
    }));

    this.setState({
      items: itemModified,
    });
  }

  updateItems(items) {
    this.setState({
      items,
    });
  }

  addWallet() {
    const { state } = this;

    this.setState({
      loading: true,
    });

    if (state.type !== 'none') {
      if (state.wallet.length > 0) {
        if (state.note.length < 50) {
          const data = {
            api: 'user',
            body: {
              data: {
                section: 'crypto',
                type: 'add',
                wallet: state.wallet,
                direction: state.type,
                note: state.note,
              },
              action: 'wallets',
            },
            headers: {
              authorization: localStorage.getItem('token'),
            },
          };

          request(data, (response) => {
            if (response.status === 200) {
              if (response.data.success) {
                this.setState({
                  loading: false,
                  wallet: '',
                  note: '',
                  type: 'none',
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
              this.setState({
                loading: false,
              });
              toast.error(getLocales('Сервер недоступен'));
            }
          });
        } else {
          this.setState({
            loading: false,
          });
          toast.error(getLocales('Максимальная длина заметки - 50 символов'));
        }
      } else {
        this.setState({
          loading: false,
        });
        toast.error(getLocales('Не введен кошелек'));
      }
    } else {
      this.setState({
        loading: false,
      });
      toast.error(getLocales('Не выбран тип кошелька'));
    }
  }

  deleteWallet() {
    const { state } = this;

    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'crypto',
          type: 'delete',
          id: state.deleteTarget,
        },
        action: 'wallets',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          this.setState({
            loading: false,
            delete: false,
            deleteTarget: 0,
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
        this.setState({
          loading: false,
        });
        toast.error(getLocales('Сервер недоступен'));
      }
    });
  }

  render() {
    const { state } = this;

    const tableColumns = [
      {
        title: 'ID', dataIndex: 'id', key: 'id', sort: true,
      },
      {
        title: getLocales('Тип'), dataIndex: 'type', key: 'type', sort: true,
      },
      {
        title: getLocales('Кошелек / Заметка'), dataIndex: 'value', key: 'value', sort: true,
      },
      {
        title: getLocales('Добавлен'), dataIndex: 'created', key: 'created', sort: true,
      },
      {
        title: getLocales('Действия'),
        dataIndex: '',
        key: 'operations',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        render: (_e, item) => (
          <div className="sparkline8">
            <button
              type="button"
              onClick={() => this.toggleInfo(item.id)}
              className="btn btn-secondary btn-table"
            >
              <FontAwesomeIcon icon={faSearchPlus} />
            </button>
            <button
              type="button"
              onClick={() => this.delete(item.id)}
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
          <div className="col-lg-4">
            <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h4 className="font-m">
                  {getLocales('Добавление кошелька')}
                </h4>

                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Тип')}
                  </label>
                  <select
                    disabled={state.loading}
                    value={state.type}
                    onChange={this.handleChange}
                    name="type"
                    className="form-control"
                  >
                    <option value="none">Не выбран</option>
                    {Object.entries(state.data.directions)
                      .map((item) => (
                        <option
                          value={item[1].name}
                        >
                          {item[1].title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Адрес')}
                  </label>
                  <input
                    disabled={state.loading}
                    value={state.wallet}
                    onChange={this.handleChange}
                    autoComplete="off"
                    type="text"
                    placeholder={getLocales('Введите адрес кошелька')}
                    name="wallet"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Заметка')}
                  </label>
                  <input
                    disabled={state.loading}
                    value={state.note}
                    onChange={this.handleChange}
                    maxLength="50"
                    autoComplete="off"
                    type="text"
                    placeholder={getLocales('Введите примечание')}
                    name="note"
                    className="form-control"
                  />
                  <small>
                    {getLocales('Максимальная длина заметки - 50 символов')}
                  </small>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={this.addWallet}
                    disabled={state.loading}
                    className="btn btn-primary font-g auth-btn"
                  >
                    {state.loading
                      ? getLocales('Загрузка...')
                      : getLocales('Добавить')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h4 className="font-m">
                  {getLocales('Кошельки')}
                </h4>

                {state.items.length > 0
                  ? (
                    <Table
                      search={false}
                      columns={tableColumns}
                      items={state.items}
                      updateItems={this.updateItems}
                      rowsPerPage="10"
                    />
                  )
                  : (
                    <div className="text-center">
                      {getLocales('Кошельки отсутствуют')}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        <ModalConfirm
          action="Вы действительно хотите удалить данный кошелек?"
          consequences="Данное действие приведет к удалению кошелька из всех магазинов."
          modal={state.delete}
          toggle={this.delete}
          loading={state.loading}
          sendData={this.deleteWallet}
        />

        <WalletModal
          loadData={this.getData}
          modal={state.infoModal}
          toggle={this.toggleInfo}
          wallet={state.infoWallet}
        />
      </>
    );
  }
}

export default CryptoWallets;
