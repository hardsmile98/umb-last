/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-deprecated */
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { EmojiInput } from 'components';
import { request, getLocales } from 'utils';

let links = [];
const deleted = [];

class PageEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      name: '',
      width: 1,
      indexPage: 0,
      type: 'content',
      links: [],
      id: 0,
      category: 'custom',
    };
    this.handleChange = this.handleChange.bind(this);
    this.deleteSubcategory = this.deleteSubcategory.bind(this);
    this.addSubcategory = this.addSubcategory.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (String(this.props.page) !== String(nextProps.page)) {
      this.setState({
        name: nextProps.page.name,
        width: nextProps.page.width,
        indexPage: nextProps.page.indexPage,
        type: nextProps.page.type,
        content: nextProps.page.content,
        links: nextProps.page.links,
        id: nextProps.page.id,
        category: nextProps.page.category,
      });
      links = nextProps.page.links;
    }
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox' ? 'checked' : 'value'];
    const { name } = e.target;

    if (name === 'link' || name === 'value') {
      links[e.target.id][name] = value;
      this.setState({
        links,
      });
    } else if (name === 'type') {
      this.setState({
        content: '',
      }, () => {
        this.setState({
          [name]: value,
        });
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
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
            type: 'bots',
            subtype: 'pages',
            shop: this.props.match.params.shopId,
            action: 'update',
            name: this.state.name,
            width: this.state.width,
            indexPage: this.state.indexPage,
            content: this.state.content,
            links: this.state.links,
            pageType: this.state.type,
            deleted,
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

  deleteSubcategory(id) {
    deleted.push(links[id].id);
    links.splice(id, 1);
    this.setState({
      links,
    });
  }

  addSubcategory() {
    links.push({
      link: '',
      value: '',
    });
    this.setState({
      links,
    });
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
            {getLocales('Страница')}
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
                <EmojiInput
                  value={this.state.name}
                  placeholder={getLocales('Введите название страницы')}
                  name="name"
                  handleChange={this.handleChange}
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Ширина кнопки')}
                </label>
                <select
                  disabled={this.state.loading}
                  value={this.state.width}
                  onChange={this.handleChange}
                  name="width"
                  className="form-control"
                >
                  <option value="1">{getLocales('Полная ширина экрана')}</option>
                  <option value="2">{getLocales('Половина ширины экрана')}</option>
                </select>
              </div>
            </div>

            <div className="col-lg-6">
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

            {this.state.category === 'custom'
              ? (
                <>
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
                          <EmojiInput
                            type="textarea"
                            value={this.state.content}
                            placeholder={getLocales('Введите содержание страницы')}
                            name="content"
                            handleChange={this.handleChange}
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
                  {this.state.type === 'content'
                    ? (
                      <div className="col-lg-12">
                        <label className="form-control-label font-m">
                          {getLocales('Ссылки под страницей')}
                        </label>

                        <div className="avatar-block">
                          {links.length === 0 && (
                            <div className="text-center">
                              <span className="font-m">{getLocales('Ссылки отсутствуют')}</span>
                            </div>
                          )}

                          {this.state.links.map((item, key) => (
                            <div className="avatar-block">
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="form-group">
                                    <label className="form-control-label font-m">
                                      {getLocales('Название ссылки')}
                                    </label>
                                    <EmojiInput
                                      value={this.state.links[key].link}
                                      placeholder={getLocales('Введите название ссылки')}
                                      name="link"
                                      handleChange={this.handleChange}
                                      id={key}
                                    />
                                  </div>
                                </div>

                                <div className="col-lg-12">
                                  <div className="form-group">
                                    <label className="form-control-label font-m">
                                      Ссылка
                                    </label>
                                    <input
                                      disabled={this.state.loading}
                                      value={this.state.links[key].value}
                                      onChange={this.handleChange}
                                      autoComplete="off"
                                      type="text"
                                      placeholder={getLocales('Вставьте ссылку')}
                                      name="value"
                                      id={key}
                                      className="form-control"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => this.deleteSubcategory(key)}
                                    disabled={this.state.loading}
                                    className="btn btn-danger font-m auth-btn margin-15"
                                  >
                                    {this.state.loading
                                      ? getLocales('Загрузка...')
                                      : getLocales('Удалить')}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={this.addSubcategory}
                            disabled={this.state.loading}
                            className="btn btn-secondary font-m auth-btn margin-15"
                          >
                            {this.state.loading
                              ? getLocales('Загрузка...')
                              : getLocales('Добавить')}
                          </button>
                        </div>
                      </div>
                    )
                    : ''}
                </>
              )
              : ''}
            {this.state.type !== 'service' && (
              <div className="col-lg-12">
                <button
                  type="button"
                  onClick={() => {
                    this.props.toggle();
                    this.props.toggleDelete(this.state.id);
                  }}
                  disabled={this.state.loading}
                  className="btn btn-danger font-m auth-btn margin-15"
                >
                  {this.state.loading
                    ? getLocales('Загрузка...')
                    : getLocales('Удалить страницу')}
                </button>
              </div>
            )}
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
                    onClick={() => this.props.toggle(0)}
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
    );
  }
}

export default PageEdit;
