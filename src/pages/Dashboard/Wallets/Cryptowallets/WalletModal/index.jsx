import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import { toast } from 'react-toastify';
import { request, getLocales } from 'utils';

class WalletModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      note: '',
    };
    this.sendData = this.sendData.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox'
      ? 'checked'
      : 'value'];
    const { name } = e.target;

    this.setState({
      [name]: value,
    });
  }

  sendData() {
    const { state, props } = this;

    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'crypto',
          type: 'edit',
          id: props.wallet.id,
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
            note: '',
          });
          toast.success(response.data.message);
          props.loadData();
          props.toggle();
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

        toast.error('Сервер недоступен');
      }
    });
  }

  render() {
    const { state, props } = this;

    return (
      <div>
        <Modal
          size="md"
          isOpen={props.modal}
          toggle={props.toggle}
        >
          <div className="modal-header">
            <h4 className="font-m">
              {getLocales('Кошелек')}
              {' #'}
              {props.wallet.id}
            </h4>
          </div>
          <ModalBody>
            <div className="form-group">
              <label className="form-control-label font-m">
                Тип
              </label>
              <input
                disabled
                autoComplete="off"
                value={props.wallet.type.toUpperCase()}
                name="type"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Кошелек')}
              </label>
              <input
                disabled
                autoComplete="off"
                value={props.wallet.value}
                name="wallet"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Дата добавления')}
              </label>
              <input
                disabled
                autoComplete="off"
                name="created"
                value={moment.unix(props.wallet.created / 1000).format('LLL')}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-control-label font-m">
                {getLocales('Заметка')}
              </label>
              <input
                maxLength="50"
                disabled={state.loading}
                defaultValue={props.wallet.note}
                autoComplete="off"
                type="text"
                onChange={this.handleChange}
                name="note"
                placeholder="Введите примечание"
                className="form-control"
              />
              <small>
                {getLocales('Максимальная длина заметки - 50 символов')}
              </small>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-4">
                  <button
                    type="button"
                    value="Закрыть"
                    className="btn btn-secondary font-g auth-btn"
                    onClick={props.toggle}
                  >
                    {getLocales('Закрыть')}
                  </button>
                </div>

                <div className="col-lg-8">
                  <button
                    type="button"
                    disabled={state.loading}
                    onClick={this.sendData}
                    className="btn btn-primary font-g auth-btn"
                  >
                    {state.loading
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

export default WalletModal;
