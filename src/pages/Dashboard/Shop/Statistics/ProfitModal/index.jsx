/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-deprecated */
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import { getLocales } from 'utils';

class ProfitModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateFrom: moment.unix(new Date(Date.now() - 2592000000)
        .setHours(0, 0, 0, 0) / 1000).format('YYYY-MM-DD'),
      dateTo: moment.unix(new Date(Date.now() + 86400000)
        .setHours(0, 0, 0, 0) / 1000).format('YYYY-MM-DD'),
      profit: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.getProfit = this.getProfit.bind(this);
  }

  componentDidMount() {
    this.getProfit();
  }

  componentWillReceiveProps() {
    this.getProfit();
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    }, () => {
      this.getProfit();
    });
  }

  getProfit() {
    const res = {};

    this.props.purchases.map((purchase) => {
      if (+purchase.closed >= +new Date(this.state.dateFrom)
       && +purchase.closed < +new Date(this.state.dateTo)) {
        if (!purchase.subproduct) {
          this.props.products.map((item) => {
            if (item.name === purchase.product) {
              if (res[purchase.category]) {
                res[purchase.category].turnover += +purchase.sum;
                res[purchase.category].courier += +item.bonus;
                res[purchase.category].seb += 0;
                res[purchase.category].prefer += (+purchase.sum - +item.bonus - 0);
              } else {
                res[purchase.category] = {
                  turnover: +purchase.sum,
                  courier: +item.bonus,
                  seb: 0,
                  prefer: (+purchase.sum - +item.bonus - 0),
                };
              }
            }
          });
        } else {
          this.props.subproducts.map((item) => {
            if (item.name === purchase.subproduct) {
              if (res[purchase.category]) {
                res[purchase.category].turnover += +purchase.sum;
                res[purchase.category].courier += +item.bonus;
                res[purchase.category].seb += +item.sum;
                res[purchase.category].prefer += (+purchase.sum - +item.bonus - +item.sum);
              } else {
                res[purchase.category] = {
                  turnover: +purchase.sum,
                  courier: +item.bonus,
                  seb: +item.sum,
                  prefer: (+purchase.sum - +item.bonus - +item.sum),
                };
              }
            }
          });
        }
      }
    });

    this.setState({
      profit: res,
    });
  }

  render() {
    return (
      <Modal
        size="xl"
        isOpen={this.props.modal}
        toggle={this.props.toggle}
      >
        <div className="modal-header text-center">
          <h4 className="modal-title font-m">
            {getLocales('Рассчет прибыли')}
          </h4>
        </div>

        <ModalBody>
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('От')}
                </label>
                <input
                  type="date"
                  onChange={this.handleChange}
                  value={this.state.dateFrom}
                  name="dateFrom"
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('До')}
                </label>
                <input
                  type="date"
                  onChange={this.handleChange}
                  value={this.state.dateTo}
                  name="dateTo"
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-lg-12">
              <div className="avatar-block notice no-margin">
                <h3 className="font-m">
                  {getLocales('Статистика по городам')}
                </h3>

                {Object.keys(this.state.profit).length > 0
                  ? (
                    <div>
                      <div className="avatar-block font-m">
                        <div className="row">
                          <div className="col-lg-2">
                            <b>Город</b>
                          </div>
                          <div className="col-lg-2 text-center">
                            <b>Оборот</b>
                          </div>
                          <div className="col-lg-2 text-center">
                            <b>З/п курьерам</b>
                          </div>
                          <div className="col-lg-3 text-center">
                            <b>Себестоимость товара</b>
                          </div>
                          <div className="col-lg-2 text-center">
                            <b>Чистая прибыль</b>
                          </div>
                        </div>
                      </div>

                      {Object.keys(this.state.profit).map((key) => (
                        <div className="avatar-block font-m" key={key}>
                          <div className="row">
                            <div className="col-lg-2">
                              {key}
                            </div>
                            <div className="col-lg-2 text-center">
                              {Math.round(this.state.profit[key].turnover)}
                              {' '}
                              {this.props.currency}
                            </div>
                            <div className="col-lg-2 text-center">
                              {Math.round(this.state.profit[key].courier)}
                              {' '}
                              {this.props.currency}
                            </div>
                            <div className="col-lg-3 text-center">
                              {Math.round(this.state.profit[key].seb)}
                              {' '}
                              {this.props.currency}
                            </div>
                            <div className="col-lg-2 text-center">
                              {Math.round(this.state.profit[key].prefer)}
                              {' '}
                              {this.props.currency}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                  : (
                    <div className="text-center font-m">
                      Не найдено
                    </div>
                  )}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  value={getLocales('Закрыть')}
                  className="btn btn-secondary font-m auth-btn"
                  onClick={this.props.toggle}
                >
                  {getLocales('Закрыть')}
                </button>
              </div>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ProfitModal;
