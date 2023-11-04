import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { request } from 'utils';

class CreateNewFaq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      content: '',
      name: '',
      flag: '',
      indexNum: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
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
          type: 'faqNew',
          content: state.content,
          name: state.name,
          flag: state.flag,
          indexNum: state.indexNum,
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
          props.toggle();
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
            Статья новая
          </h4>
        </div>

        <ModalBody>
          <div className="row">
            <div className="col-lg-12">
              <div className="form-group">
                <label className="form-control-label font-m">
                  название
                </label>
                <input
                  className="form-control"
                  value={state.name}
                  placeholder="Введите название статьи"
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
                  Содержание новость (HTML поддерживается)
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
                    : 'Создать'}
                </button>
              </div>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default CreateNewFaq;
