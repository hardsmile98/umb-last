/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { request, getLocales } from 'utils';

class BotsSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        available: {},
        settings: {},
      },
    };

    this.getData = this.getData.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'bots',
          subtype: 'settings',
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

  sendData(e) {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'bots',
          subtype: 'settings',
          shop: this.props.match.params.shopId,
          action: 'change',
          name: e.target.name,
          value: e.target.value.toString(),
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
                {getLocales('Настройки')}
              </h3>

              <div className="row">
                {Object.keys(this.state.data.available).map((keyName) => (
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales(this.state.data.available[keyName].title)}
                      </label>

                      <select
                        onChange={this.sendData}
                        value={this.state.data.settings[keyName]
                          ? this.state.data.settings[keyName]
                          : this.state.data.available[keyName].default}
                        name={this.state.data.available[keyName].name}
                        className="form-control"
                      >
                        {this.state.data.available[keyName].values.split(',')
                          .map((value, key) => (
                            <option
                              value={value}
                            >
                              {getLocales(this.state.data.available[keyName].valuesNames.split(',')[key])}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BotsSettings;
