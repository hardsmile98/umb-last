/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { request } from 'utils';

let coworkers = [];

class Coworkers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        coworkers: [],
      },
    };
    this.getData = this.getData.bind(this);
    this.sendData = this.sendData.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  handleChange(e) {
    const { name } = e.target;
    const { value } = e.target;
    const { id } = e.target;

    coworkers = this.state.data.coworkers;

    coworkers.map((item) => {
      if (item.id === id) {
        item[name] = value;
      }
    });

    this.setState({
      data: {
        coworkers,
      },
    });
  }

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'settings',
          type: 'getCoworkers',
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

  sendData(id) {
    let coworker = {};

    this.setState({
      loading: true,
    });

    this.state.data.coworkers.map((item) => {
      if (item.id === id) {
        coworker = item;
      }
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'settings',
          type: 'updateCoworkers',
          name: coworker.name,
          status: coworker.status,
          timefrom: coworker.timefrom,
          timeto: coworker.timeto,
          chatid: coworker.chatid,
          id,
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

  render() {
    return (
      <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
        <div className="block-body">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="font-m">
                Сотрудники
              </h3>

              {this.state.data.coworkers.map((item) => (
                <div className="avatar-block font-m">
                  <div className="row">
                    <div className="col-lg-2">
                      <div className="form-group message-area">
                        <label className="form-control-label font-m">
                          Имя сотрудника
                        </label>
                        <input
                          onChange={this.handleChange}
                          id={item.id}
                          type="text"
                          name="name"
                          value={item.name}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="col-lg-2">
                      <div className="form-group message-area">
                        <label className="form-control-label font-m">
                          CHATID
                        </label>
                        <input
                          onChange={this.handleChange}
                          id={item.id}
                          type="text"
                          name="chatid"
                          value={item.chatid}
                          className="form-control"
                        />
                        <small>
                          ID группы ТГ
                        </small>
                      </div>
                    </div>

                    <div className="col-lg-3">
                      <div className="form-group message-area">
                        <label className="form-control-label font-m">
                          Время работы (с какого часа МСК)
                        </label>
                        <input
                          onChange={this.handleChange}
                          id={item.id}
                          type="number"
                          name="timefrom"
                          value={item.timefrom}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="col-lg-3">
                      <div className="form-group message-area">
                        <label className="form-control-label font-m">
                          Время работы (до какого часа МСК)
                        </label>
                        <input
                          onChange={this.handleChange}
                          id={item.id}
                          type="number"
                          name="timeto"
                          value={item.timeto}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="col-lg-2">
                      <div className="form-group message-area">
                        <label className="form-control-label font-m">
                          Статус
                        </label>
                        <input
                          onChange={this.handleChange}
                          id={item.id}
                          type="number"
                          name="status"
                          value={item.status}
                          className="form-control"
                        />
                        <small>
                          1 - включен, 0 - выкючен
                        </small>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <button
                        type="button"
                        className="btn btn-success btn-auth font-m"
                        onClick={() => this.sendData(item.id)}
                      >
                        Сохранить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Coworkers;
