/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-quill/dist/quill.bubble.css';
import ReactQuill from 'react-quill';
import { NavLink } from 'react-router-dom';
import { request, getLocales } from 'utils';

class PageChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      name: '',
      path: '',
      indexPage: '',
      type: 'text',
      content: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.changeContent = this.changeContent.bind(this);
    this.update = this.update.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox' ? 'checked' : 'value'];
    const { name } = e.target;

    if (name === 'type') {
      this.setState({
        content: '',
        [name]: value,
      });
    }
    this.setState({
      [name]: value,
    });
  }

  getData() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'site',
          subtype: 'pages',
          shop: this.props.match.params.shopId,
          action: 'getPage',
          id: this.props.match.params.pageId,
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
          }, () => {
            this.setState({
              name: response.data.data.page.name,
              type: response.data.data.page.type,
              indexPage: response.data.data.page.indexPage,
              path: response.data.data.page.path,
              content: response.data.data.page.content,
            });
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

  update() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'site',
          subtype: 'pages',
          shop: this.props.match.params.shopId,
          action: 'update',
          name: this.state.name,
          typePage: this.state.type,
          indexPage: this.state.indexPage,
          path: this.state.path,
          content: this.state.content,
          id: this.props.match.params.pageId,
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
          toast.success(response.data.message);
          this.props.history.push(`/dashboard/shops/${this.props.match.params.shopId}/site/pages`);
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

  changeContent(v) {
    this.setState({
      content: v,
    });
  }

  render() {
    return (
      <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
        <div className="block-body">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="font-m">
                {getLocales('Обновление страницы')}
              </h3>

              <div className="row">
                <div className="col-lg-3">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Название')}
                    </label>
                    <input
                      onChange={this.handleChange}
                      value={this.state.name}
                      type="text"
                      autoComplete="off"
                      className="form-control"
                      placeholder={getLocales('Введите название')}
                      name="name"
                    />
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Тип страницы')}
                    </label>
                    <select
                      onChange={this.handleChange}
                      name="type"
                      value={this.state.type}
                      className="form-control"
                    >
                      <option value="text">{getLocales('Информационная страница')}</option>
                      <option value="link">{getLocales('Страница-ссылка')}</option>
                    </select>
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Порядковый номер')}
                    </label>
                    <input
                      type="number"
                      onChange={this.handleChange}
                      value={this.state.indexPage}
                      autoComplete="off"
                      className="form-control"
                      placeholder={getLocales('Введите порядковый номер')}
                      name="indexPage"
                    />
                  </div>
                </div>

                {this.state.type === 'text'
                  ? (
                    <div className="col-lg-3">
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Путь')}
                        </label>
                        <div className="input-group">
                          <span className="input-group-text font-m">/</span>
                          <input
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.path}
                            autoComplete="off"
                            className="form-control"
                            placeholder="page"
                            name="path"
                          />
                        </div>
                        <small>
                          {getLocales('Путь, по которому будет доступна страница')}
                        </small>
                      </div>
                    </div>
                  )
                  : (
                    <div className="col-lg-3">
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Ссылка')}
                        </label>
                        <input
                          type="text"
                          onChange={this.handleChange}
                          value={this.state.content}
                          autoComplete="off"
                          className="form-control"
                          placeholder={getLocales('Вставьте ссылку')}
                          name="content"
                        />
                      </div>
                    </div>
                  )}
                {this.state.type === 'text'
                  ? (
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label className="form-control-label font-m">
                          {getLocales('Содержание страницы')}
                        </label>

                        <div className="avatar-block no-margin">
                          <ReactQuill
                            modules={{
                              toolbar: [
                                ['bold', 'italic', 'underline', 'strike'],
                                ['blockquote', 'code-block'],

                                [{ header: 1 }, { header: 2 }],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                [{ script: 'sub' }, { script: 'super' }],
                                [{ indent: '-1' }, { indent: '+1' }],
                                [{ direction: 'rtl' }],

                                [{ size: ['small', false, 'large', 'huge'] }],
                                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                                ['link', 'image', 'video'],

                                [{ color: [] }, { background: [] }],
                                [{ font: [] }],
                                [{ align: [] }],

                                ['clean'],
                              ],
                            }}
                            theme="bubble"
                            value={this.state.content}
                            onChange={this.changeContent}
                          />
                        </div>
                        <small className="font-m">
                          Для кастомизации контента выделите требуемый текст.
                        </small>
                      </div>
                    </div>
                  )
                  : ''}
                <div className="col-lg-12">
                  <NavLink
                    to={`/dashboard/shops/${this.props.match.params.shopId}/site/pages`}
                  >
                    <button type="button" className="btn btn-secondary left font-m">
                      {getLocales('Назад')}
                    </button>
                  </NavLink>

                  <div className="mr-auto right">
                    <button
                      type="button"
                      className="btn btn-primary left font-m"
                      onClick={this.update}
                    >
                      {getLocales('Обновить')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PageChange;
