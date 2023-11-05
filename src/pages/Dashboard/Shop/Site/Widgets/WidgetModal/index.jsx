/* eslint-disable react/no-deprecated */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { request, getLocales } from 'utils';

class WidgetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      name: '',
      indexPage: 0,
      type: 'content',
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (String(this.props.page) !== String(nextProps.page)) {
      this.setState({
        name: nextProps.page.name,
        indexPage: nextProps.page.indexPage,
        type: nextProps.page.type,
        content: nextProps.page.content,
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
    if (this.state.name.length >= 1) {
      this.setState({
        loading: true,
      });
      const data = {
        api: 'user',
        body: {
          data: {
            section: 'shop',
            type: 'site',
            subtype: 'widgets',
            shop: this.props.match.params.shopId,
            action: 'update',
            name: this.state.name,
            indexPage: this.state.indexPage,
            content: this.state.content,
            pageType: this.state.type,
            id: this.props.page.id,
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
            this.props.getData();
            toast.success(response.data.message);
            this.props.toggle();
            this.setState({
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
    } else {
      toast.error('Заполнены не все поля');
    }
  }

  render() {
    return (
      <Modal
        size="lg"
        isOpen={this.props.modal}
        toggle={() => this.props.toggle(0)}
      >
        <div className="modal-header text-center">
          <h4 className="modal-title font-m">
            {getLocales('Виджет')}
            {' #'}
            {this.props.page.id}
          </h4>
        </div>

        <ModalBody>
          <div className="row">
            <div className="col-lg-12">
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Название')}
                </label>
                <input
                  className="form-control"
                  value={this.state.name}
                  placeholder={getLocales('Введите название страницы')}
                  name="name"
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="col-lg-12">
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Порядковый номер')}
                </label>
                <input
                  type="number"
                  disabled={this.state.loading}
                  value={this.state.indexPage}
                  onChange={this.handleChange}
                  name="indexPage"
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-lg-12">
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Тип страницы')}

                </label>
                <select
                  disabled={this.state.loading}
                  value={this.state.type}
                  onChange={this.handleChange}
                  name="type"
                  className="form-control"
                >
                  <option value="content">{getLocales('Страница с текстом')}</option>
                  <option value="link">{getLocales('Страница-ссылка')}</option>
                </select>
              </div>

              {this.state.type === 'content'
                ? (
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Содержание страницы')}
                    </label>
                    <textarea
                      className="form-control"
                      value={this.state.content}
                      placeholder={getLocales('Введите содержание страницы')}
                      name="content"
                      onChange={this.handleChange}
                    />
                  </div>
                )
                : (
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Ссылка')}

                    </label>
                    <input
                      placeholder={getLocales('Вставьте ссылку')}
                      type="text"
                      disabled={this.state.loading}
                      value={this.state.content}
                      onChange={this.handleChange}
                      name="content"
                      className="form-control"
                    />
                  </div>
                )}
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
                    onClick={() => { this.props.toggle(0); }}
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
                    ? <>{getLocales('Загрузка...')}</>
                    : <>{getLocales('Сохранить')}</>}
                </button>
              </div>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default WidgetModal;
