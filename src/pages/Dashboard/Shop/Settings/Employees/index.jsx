/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faTrashAlt,
  faPlusCircle,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { ModalConfirm } from 'components';
import { request, getLocales } from 'utils';
import StatisticModal from './StatisticModal';

class Employees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        employees: [],
        currency: '',
      },
      statData: {
        sellers: [],
        purchases: [],
      },
      confirmModal: false,
      deleteId: 0,
      modal: false,
      idStat: 0,
    };
    this.getData = this.getData.bind(this);
    this.delete = this.delete.bind(this);
    this.confirmToggle = this.confirmToggle.bind(this);
    this.zero = this.zero.bind(this);
    this.toggle = this.toggle.bind(this);
    this.getStat = this.getStat.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  confirmToggle(id) {
    this.setState({
      deleteId: id,
      confirmModal: !this.state.confirmModal,
    });
  }

  componentDidMount() {
    this.getData();
  }

  delete() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'employees',
          action: 'delete',
          id: this.state.deleteId,
          shop: this.props.match.params.shopId,
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
            confirmModal: false,
          });
          toast.success(response.data.message);
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

  zero(type, id) {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'employees',
          action: 'zero',
          types: type,
          id,
          shop: this.props.match.params.shopId,
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
          toast.success(response.data.message);
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

  getStat(id) {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'employees',
          action: 'statistic',
          shop: this.props.match.params.shopId,
          id,
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
            statData: response.data.data,
            loading: false,
            idStat: id,
          }, () => {
            this.toggle();
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

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'settings',
          subtype: 'employees',
          action: 'getAll',
          shop: this.props.match.params.shopId,
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
    return (
      <>
        <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="font-m">
                  {getLocales('Сотрудники')}
                </h3>

                <br />

                <div className="row">
                  {this.state.data.employees.map((item) => (
                    <div className="col-lg-3">
                      <div className="avatar-block coworker-block">
                        <div className="text-center flex-center">
                          <div className="avatar">
                            <FontAwesomeIcon icon={faUser} />
                          </div>
                          <br />
                        </div>

                        <div className="text-center margin-15">
                          <div className="bold font-m">
                            {item.login}
                          </div>
                          <small>
                            {item.notice
                              ? item.notice
                              : getLocales('Нет примечания')}
                          </small>
                          <div className="text-left font-m">
                            {getLocales('Доход')}
                            :
                            <span className="highlight">
                              {item.earnings}
                              {' '}
                              {this.state.data.currency}
                              {' '}
                              <a
                                aria-hidden
                                onClick={() => this.zero('earnings', item.id)}
                                className="right"
                              >
                                {getLocales('Обнулить')}
                              </a>
                            </span>
                            <br />
                            {getLocales('Штрафы')}
                            :
                            <span className="highlight">
                              {item.fines}
                              {' '}
                              {this.state.data.currency}
                              {' '}
                              <a
                                aria-hidden
                                onClick={() => this.zero('fines', item.id)}
                                className="right"
                              >
                                {getLocales('Обнулить')}
                              </a>
                            </span>
                            <br />
                            <br />
                            {getLocales('Итого')}
                            :
                            <span className="highlight">
                              {+item.earnings - +item.fines}
                              {' '}
                              {this.state.data.currency}
                            </span>
                            <br />
                          </div>

                          <div className="row">
                            <div className="col-lg-12">
                              <button
                                type="button"
                                onClick={() => this.getStat(item.id)}
                                disabled={this.state.loading}
                                className="btn btn-secondary font-m auth-btn margin-15"
                              >
                                {this.state.loading ? getLocales('Загрузка...') : (
                                  <>
                                    <FontAwesomeIcon icon={faChartLine} />
                                    {' '}
                                    {getLocales('Статистика')}
                                  </>
                                )}
                              </button>
                            </div>

                            <div className="col-lg-8">
                              <Link to={`${this.props.match.url}/${item.id}`}>
                                <button
                                  type="button"
                                  disabled={this.state.loading}
                                  className="btn btn-secondary font-m auth-btn margin-15"
                                >
                                  {this.state.loading
                                    ? getLocales('Загрузка...')
                                    : getLocales('Открыть')}
                                </button>
                              </Link>
                            </div>

                            <div className="col-lg-4">
                              <button
                                type="button"
                                onClick={() => this.confirmToggle(item.id)}
                                disabled={this.state.loading}
                                className="btn btn-danger font-m auth-btn margin-15"
                              >
                                <FontAwesomeIcon icon={faTrashAlt} />
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}

                  <div className="col-lg-3">
                    <Link to={`${this.props.match.url}/new`}>
                      <div className="avatar-block coworker-block add-coworker">
                        <div className="text-center flex-center">
                          <div className="avatar">
                            <FontAwesomeIcon icon={faPlusCircle} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <StatisticModal
          modal={this.state.modal}
          data={this.state.statData}
          toggle={this.toggle}
          id={this.state.idStat}
        />

        <ModalConfirm
          action={getLocales('Вы действительно хотите удалить данного сотрудника?')}
          consequences={getLocales('Данное действие безвозвратно, все заполненные данные восстановить не удастся.')}
          modal={this.state.confirmModal}
          toggle={this.confirmToggle}
          loading={this.state.loading}
          sendData={this.delete}
        />
      </>
    );
  }
}

export default Employees;
