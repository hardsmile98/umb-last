/* eslint-disable react/no-deprecated */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { request } from 'utils';

class FaqModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      content: '',
      id: 0,
      name: '',
      flag: '',
      indexNum: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;

    if (props.new !== nextProps.new) {
      this.setState({
        content: nextProps.new.content,
        id: nextProps.new.id,
        flag: nextProps.new.flag,
        name: nextProps.new.name,
        indexNum: nextProps.new.indexNum,

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
    const { props, state } = this;

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'inform',
          type: 'faqUpdate',
          id: state.id,
          content: state.content,
          name: state.name,
          indexNum: state.indexNum,
          flag: state.flag,
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
    const { props, state } = this;

    return (
      <Modal
        size="lg"
        isOpen={props.modal}
        toggle={() => props.toggle(0)}
      >
        <div className="modal-header text-center">
          <h4 className="modal-title font-m">
            Статья #
            {props.new.id}
          </h4>
        </div>

        <ModalBody>
          <div className="row">
            <div className="col-lg-12">
              <div className="form-group">
                <label className="form-control-label font-m">
                  Название
                </label>
                <input
                  className="form-control"
                  value={state.name}
                  placeholder="Введите название"
                  name="name"
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-control-label font-m">
                  FLAG
                </label>
                <input
                  className="form-control"
                  value={state.flag}
                  placeholder="Введите FLAG"
                  name="flag"
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-control-label font-m">
                  Порядковый номер
                </label>
                <input
                  className="form-control"
                  value={state.indexNum}
                  placeholder="Введите порядковый номер"
                  name="indexNum"
                  onChange={this.handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-control-label font-m">
                  Содержание статьи (HTML поддерживается)
                </label>
                <textarea
                  className="form-control"
                  value={state.content}
                  placeholder="Введите содержание статьи"
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

export default FaqModal;
