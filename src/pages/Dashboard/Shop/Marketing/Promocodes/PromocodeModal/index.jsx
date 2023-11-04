/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-deprecated */
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { getLocales, request } from 'utils';

class PromocodeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      value: '',
      fromDate: '',
      toDate: '',
      percent: '',
      sum: '',
      limitActive: 0,
      onlyone: 1,
      note: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.promocode !== nextProps.promocode) {
      this.setState({
        value: nextProps.promocode.value,
        fromDate: moment.unix(nextProps.promocode.fromDate / 1000).format('YYYY-MM-DD'),
        toDate: moment.unix(nextProps.promocode.toDate / 1000).format('YYYY-MM-DD'),
        percent: nextProps.promocode.percent,
        sum: nextProps.promocode.sum,
        limitActive: nextProps.promocode.limitActive,
        onlyone: nextProps.promocode.onlyone,
        note: nextProps.promocode.note,
        id: nextProps.promocode.id,
      });
    }
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox' ? 'checked' : 'value'];
    const { name } = e.target;

    this.setState({
      [name]: value,
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
          section: 'shop',
          type: 'settings',
          subtype: 'promocodes',
          shop: this.props.match.params.shopId,
          id: this.state.id,
          percent: this.state.percent,
          sum: this.state.sum,
          fromDate: +new Date(this.state.fromDate),
          toDate: +new Date(this.state.toDate),
          limitActive: this.state.limitActive,
          onlyone: this.state.onlyone,
          note: this.state.note,
          action: 'update',
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
            loading: false,
            value: '',
            fromDate: '',
            toDate: '',
            percent: '',
            sum: '',
            limitActive: 0,
            onlyone: 1,
            note: '',
          });
          toast.success(response.data.message);
          this.props.toggle();
          this.props.getData();
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
      <div>
        <Modal
          size="md"
          isOpen={this.props.modal}
          toggle={this.props.toggle}
        >
          <div className="modal-header text-center">
            <h4 className="modal-title font-m">
              {getLocales('Промокод')}
              {' #'}
              {this.state.id}
            </h4>
          </div>

          <ModalBody>
            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Промокод')}
              </label>
              <input
                placeholder={getLocales('Введите промокод')}
                disabled
                value={this.state.value}
                onChange={this.handleChange}
                name="value"
                className="form-control"
              />
            </div>

            <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Скидка в')}
                    {' '}
                    %
                  </label>
                  <div className="input-group">
                    <input
                      placeholder={getLocales('Введите процент скидки')}
                      disabled={this.state.loading}
                      value={this.state.percent}
                      onChange={this.handleChange}
                      name="percent"
                      className="form-control"
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Скидка в')}
                    {' '}
                    {this.props.currency}
                  </label>
                  <div className="input-group">
                    <input
                      placeholder={getLocales('Введите сумму скидки')}
                      disabled={this.state.loading}
                      value={this.state.sum}
                      onChange={this.handleChange}
                      name="sum"
                      className="form-control"
                    />
                    <span className="input-group-text">{this.props.currency}</span>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-m">
              {getLocales('Время действия промокода')}
            </h3>

            <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('От')}
                  </label>
                  <input
                    type="date"
                    placeholder={getLocales('Выберите дату действия от')}
                    disabled={this.state.loading}
                    value={this.state.fromDate}
                    onChange={this.handleChange}
                    name="fromDate"
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
                    placeholder={getLocales('Выберите дату действия до')}
                    disabled={this.state.loading}
                    value={this.state.toDate}
                    onChange={this.handleChange}
                    name="toDate"
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Максимальное кол-во активаций')}
              </label>
              <input
                placeholder={getLocales('Введите максимальное кол-во активаций')}
                disabled={this.state.loading}
                value={this.state.limitActive}
                onChange={this.handleChange}
                name="limitActive"
                className="form-control"
              />
              <small>
                {getLocales('Оставьте 0, если хотите сделать бесконечное кол-во активаций')}
              </small>
            </div>

            <div className="avatar-block no-margin">
              <div className="i-checks">
                <input
                  name="onlyone"
                  checked={this.state.onlyone}
                  onClick={this.handleChange}
                  id="oneone"
                  type="checkbox"
                  className="checkbox-template"
                />
                <label
                  htmlFor="onlyone"
                  className="checkbox-label font-m promocode"
                >
                  {getLocales('Единичная активация (1 пользователь = 1 активация)')}
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Заметка')}
              </label>
              <input
                placeholder={getLocales('Введите заметку о промокоде')}
                disabled={this.state.loading}
                value={this.state.note}
                onChange={this.handleChange}
                name="note"
                className="form-control"
              />
            </div>

            <h4 className="modal-title font-m">
              {getLocales('История активаций')}
            </h4>

            {this.props.active.length > 0
              ? this.props.active.map((item) => (
                <div className="form-group">
                  <div className="input-group">
                    <input disabled className="form-control" value={item.name} />

                    <NavLink to={`/dashboard/shops/${this.props.shopId}/datas/users/${item.id}`}>
                      <span className="input-group-text">
                        {getLocales('Перейти в профиль')}
                      </span>

                    </NavLink>
                  </div>
                </div>
              ))
              : (
                <div className="text-center font-m">
                  {getLocales('История отсутствует')}
                </div>
              )}
          </ModalBody>

          <ModalFooter>
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-4">
                  <div className="mr-auto">
                    <button
                      type="button"
                      value="Закрыть"
                      className="btn btn-secondary font-m auth-btn"
                      onClick={this.props.toggle}
                    >
                      {getLocales('Закрыть')}

                    </button>
                  </div>
                </div>

                <div className="col-lg-8">
                  <button
                    type="button"
                    disabled={this.state.loading}
                    onClick={this.sendData}
                    className="btn btn-primary font-m auth-btn"
                  >
                    {this.state.loading
                      ? getLocales('Загрузка...')
                      : getLocales('Сохранить')}
                  </button>
                </div>
              </div>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default PromocodeModal;
