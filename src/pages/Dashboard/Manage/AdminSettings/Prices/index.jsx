/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { request } from 'utils';

class Prices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        prices: [],
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
          section: 'settings',
          type: 'getPrices',
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

  sendData(e) {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'settings',
          type: 'updatePrice',
          price: e.target.value,
          name: e.target.name,
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
                Платные услуги
              </h3>

              <div className="avatar-block font-m">
                <div className="row">
                  <div className="col-lg-6 flex-center">
                    Название
                  </div>

                  <div className="col-lg-6">
                    Цена
                  </div>
                </div>
              </div>

              {this.state.data.prices.map((item) => (
                <div className="avatar-block font-m">
                  <div className="row">
                    <div className="col-lg-6 flex-center">
                      {item.label}
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group message-area">
                        <input
                          onChange={this.sendData}
                          type="number"
                          name={item.name}
                          value={item.price}
                          className="form-control"
                        />
                      </div>
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

export default Prices;
