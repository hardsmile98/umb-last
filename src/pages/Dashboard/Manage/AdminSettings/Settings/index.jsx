/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { request } from 'utils';

class AdminAllSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      values: {},
      newDatas: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.getData = this.getData.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox'
      ? 'checked'
      : 'value'];
    const { name } = e.target;

    this.state.newDatas[name] = value;

    this.setState({
      values: this.state.newDatas,
    });
  }

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'settings',
          type: 'getSettings',
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
            data: response.data.data.settings,
            loading: false,
          }, () => {
            this.state.data.map((item) => {
              this.setState({
                [item.name]: item.value,
              });
            });
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

  sendData() {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'settings',
          type: 'update',
          values: this.state.values,
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

  render() {
    return (
      <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
        <div className="block-body">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="font-m">
                Настройки
              </h3>

              <div className="row">
                {this.state.data.map((item) => (
                  <div className="col-lg-6">
                    <div className="form-group message-area">
                      <label
                        htmlFor={item.name}
                        className="font-m"
                      >
                        {item.name}
                      </label>
                      <input
                        name={item.name}
                        defaultValue={item.value}
                        value={this.state.values[item.name]}
                        onChange={this.handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn btn-primary font-m right"
                onClick={this.sendData}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminAllSettings;
