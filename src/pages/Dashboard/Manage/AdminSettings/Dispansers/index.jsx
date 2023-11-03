/* eslint-disable react/destructuring-assignment */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { request } from 'utils';

class Dispansers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        bots: [],
        dispansers: [],
      },
      availableBots: 0,
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
          type: 'getBotsInfo',
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
          let availableBots = 0;
          response.data.data.bots.map((item) => {
            const need = 10 - +item.countBots;
            availableBots += need;
          });
          this.setState({
            data: response.data.data,
            availableBots,
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
                Профили распределители ТГ
              </h3>

              <div className="row">
                <div className="col-lg-4">
                  <div className="avatar-block font-m text-center">
                    <b>
                      {this.state.data.bots.length - this.state.data.dispansers.length}
                      /
                      {this.state.data.bots.length}
                    </b>
                    <br />
                    Доступно распределителей
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="avatar-block font-m text-center">
                    <b>{this.state.availableBots}</b>
                    <br />
                    Доступно ботов для создания
                  </div>
                </div>
                <div className="col-lg-4" />
              </div>

              <div className="avatar-block font-m">
                <div className="row">
                  <div className="col-lg-4 flex-center">
                    <b>Телефон</b>
                  </div>

                  <div className="col-lg-4 flex-center">
                    <b>Кол-во созданных ботов</b>
                  </div>

                  <div className="col-lg-4 flex-center">
                    <b>Юзернейм</b>
                  </div>
                </div>
              </div>

              {this.state.data.bots.map((item) => (
                <div className="avatar-block font-m">
                  <div className="row">
                    <div className="col-lg-4 flex-center">
                      +
                      {item.account}
                    </div>

                    <div className="col-lg-4 flex-center">
                      {item.countBots}
                      {' из 10'}
                    </div>

                    <div className="col-lg-4 flex-center">
                      @
                      {item.username}
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

export default Dispansers;
