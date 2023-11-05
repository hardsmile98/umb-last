/* eslint-disable react/no-deprecated */
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { request } from 'utils';

class NewsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      content: '',
      id: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;

    if (String(props.new) !== String(nextProps.new)) {
      this.setState({
        content: nextProps.new.content,
        id: nextProps.new.id,
      });
    }
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

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'inform',
          type: 'newsUpdate',
          id: state.id,
          content: state.content,
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
          props.toggle(0);
          props.getData();
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
    const { state, props } = this;

    return (
      <Modal
        size="lg"
        isOpen={props.modal}
        toggle={() => props.toggle(0)}
      >
        <div className="modal-header text-center">
          <h4 className="modal-title font-m">
            Новость #
            {props.new.id}
          </h4>
        </div>

        <ModalBody>
          <div className="row">
            <div className="col-lg-12">
              <div className="form-group">
                <label className="form-control-label font-m">
                  Содержание новость (HTML поддерживается)
                </label>
                <textarea
                  className="form-control"
                  value={state.content}
                  placeholder="Введите содержание страницы"
                  name="content"
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
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
                    onClick={() => props.toggle(0)}
                  >
                    Закрыть
                  </button>
                </div>
              </div>

              <div className="col-lg-8">
                <button
                  type="button"
                  disabled={state.loading}
                  onClick={this.sendData}
                  className="btn btn-primary font-m auth-btn"
                >
                  {state.loading
                    ? 'Загрузка...'
                    : 'Сохранить'}
                </button>
              </div>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default NewsModal;
