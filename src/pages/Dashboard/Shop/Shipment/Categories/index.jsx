/* eslint-disable react/sort-comp */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ModalConfirm } from 'components';
import { request, getLocales } from 'utils';
import CategoryEdit from './Edit';

const subcategories = [{
  name: '',
}];

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      name: '',
      sub: 0,
      subcategories: [
        {
          name: '',
        },
      ],
      data: [],
      modal: false,
      category: {},
      confirmModal: false,
      categoryDelete: 0,
      currency: 's',
    };
    this.handleChange = this.handleChange.bind(this);
    this.addSubcategory = this.addSubcategory.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.getData = this.getData.bind(this);
    this.deleteSubcategory = this.deleteSubcategory.bind(this);
    this.toggle = this.toggle.bind(this);
    this.confirmToggle = this.confirmToggle.bind(this);
    this.categoryDelete = this.categoryDelete.bind(this);
  }

  confirmToggle(id) {
    this.setState({
      confirmModal: !this.state.confirmModal,
      categoryDelete: id,
    });
  }

  toggle(id) {
    this.state.data.map((item) => {
      if (String(item.id) === String(id)) {
        this.setState({
          category: item,
        });
      }
    });

    this.setState({
      modal: !this.state.modal,
    });
  }

  componentDidMount() {
    this.getData();
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox'
      ? 'checked'
      : 'value'];
    const { name } = e.target;

    if (name === 'subcategory') {
      subcategories[e.target.id].name = value;

      this.setState({
        subcategories,
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
  }

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'shipment',
          subtype: 'categories',
          shop: this.props.match.params.shopId,
          action: 'get',
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
            data: response.data.data.categories,
            currency: response.data.data.currency,
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

  createCategory() {
    if (this.state.name) {
      this.setState({
        loading: true,
      });

      const data = {
        api: 'user',
        body: {
          data: {
            section: 'shop',
            type: 'shipment',
            subtype: 'categories',
            name: this.state.name,
            sub: this.state.sub,
            subcategories: this.state.subcategories,
            shop: this.props.match.params.shopId,
            action: 'create',
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
              name: '',
              sub: 0,
              subcategories: this.state.subcategories,
              loading: false,
            });
            this.getData();
            toast.success(response.data.message);
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
      toast.error('Заполните название категории');
    }
  }

  categoryDelete() {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'shipment',
          subtype: 'categories',
          id: this.state.categoryDelete,
          shop: this.props.match.params.shopId,
          action: 'delete',
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
            categoryDelete: 0,
          });
          this.getData();
          this.confirmToggle();
          toast.success(response.data.message);
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

  deleteSubcategory(id) {
    subcategories.splice(id, 1);
    this.setState({
      subcategories,
    });
  }

  addSubcategory() {
    subcategories.push({
      name: '',
    });
    this.setState({
      subcategories,
    }, () => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  render() {
    return (
      <>
        <div className="row">
          <div className="col-lg-4">
            <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h4 className="font-m">
                  {getLocales('Создание города')}
                </h4>

                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Название')}
                  </label>
                  <input
                    disabled={this.state.loading}
                    value={this.state.name}
                    onChange={this.handleChange}
                    autoComplete="off"
                    type="text"
                    placeholder={getLocales('Введите название города')}
                    name="name"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-control-label font-m">
                    {getLocales('Районы')}
                  </label>
                  <select
                    disabled={this.state.loading}
                    value={this.state.sub}
                    onChange={this.handleChange}
                    name="sub"
                    className="form-control"
                  >
                    <option value="0">{getLocales('Отсутствуют')}</option>
                    <option value="1">{getLocales('Присутствуют')}</option>
                  </select>
                </div>

                {String(this.state.sub) === '1'
                  ? (
                    <>
                      <label className="form-control-label font-m">
                        {getLocales('Список районов')}
                      </label>
                      <div className="avatar-block">
                        {this.state.subcategories.map((item, key) => (
                          <div className="avatar-block">
                            <div className="form-group">
                              <label className="form-control-label font-m">
                                {getLocales('Название')}
                              </label>
                              <input
                                disabled={this.state.loading}
                                value={this.state.subcategories[key].name}
                                autoComplete="off"
                                onChange={this.handleChange}
                                type="text"
                                placeholder={getLocales('Введите название района')}
                                name="subcategory"
                                id={key}
                                className="form-control"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => { this.deleteSubcategory(key); }}
                              disabled={this.state.loading}
                              className="btn btn-danger font-m auth-btn margin-15"
                            >
                              {this.state.loading
                                ? getLocales('Загрузка...')
                                : getLocales('Удалить')}
                            </button>
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
                    </>
                  )
                  : ''}

                <button
                  type="button"
                  onClick={this.createCategory}
                  disabled={this.state.loading}
                  className="btn btn-primary font-m auth-btn margin-15"
                >
                  {this.state.loading
                    ? getLocales('Загрузка...')
                    : getLocales('Добавить город')}
                </button>

              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h4 className="font-m">
                  {getLocales('Города')}
                </h4>

                {this.state.data.length > 0
                  ? (
                    <div className="row">
                      {this.state.data.map((item) => (
                        <div className="col-lg-4">
                          <div className="avatar-block">
                            <h4 className="text-center font-m">
                              {item.name}
                            </h4>
                            <br />
                            <p className="font-m">
                              {getLocales('Районов')}
                              {': '}
                              <span className="highlight">
                                {item.subcategories.length}
                                {' '}
                                {getLocales('шт.')}
                              </span>
                              <br />
                              {getLocales('Адресов в наличии')}
                              {': '}
                              <span className="highlight">
                                {item.sellers}
                                {' '}
                                {getLocales('шт.')}
                              </span>
                              <br />
                              {getLocales('Продаж')}
                              {': '}
                              <span className="highlight">
                                {item.sales}
                                {' '}
                                {getLocales('шт.')}
                              </span>
                              <br />
                              {getLocales('Сумма продаж')}
                              {': '}
                              <span className="highlight">
                                {item.salessum.toFixed(2)}
                                {' '}
                                {this.state.currency}
                              </span>
                              <br />
                            </p>

                            <div className="text-center">
                              <div className="row">
                                <div className="col-lg-8">
                                  <button
                                    type="button"
                                    onClick={() => { this.toggle(item.id); }}
                                    disabled={this.state.loading}
                                    className="btn btn-secondary font-m auth-btn margin-15"
                                  >
                                    {this.state.loading
                                      ? getLocales('Загрузка...')
                                      : getLocales('Открыть')}

                                  </button>
                                </div>

                                <div className="col-lg-4">
                                  <button
                                    type="button"
                                    onClick={() => { this.confirmToggle(item.id); }}
                                    disabled={this.state.loading}
                                    className="btn btn-danger font-m auth-btn margin-15"
                                  >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                  : (
                    <div className="text-center">
                      {getLocales('Городаненайдены')}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        <CategoryEdit
          {...this.props}
          getData={this.getData}
          modal={this.state.modal}
          toggle={this.toggle}
          category={this.state.category}
        />

        <ModalConfirm
          action={getLocales('Вы действительно хотите удалить данный город?')}
          consequences={getLocales('Все адреса, из данной категории будут перенесены в раздел удаленных адресов.')}
          modal={this.state.confirmModal}
          toggle={this.confirmToggle}
          loading={this.state.loading}
          sendData={this.categoryDelete}
        />
      </>
    );
  }
}

export default Categories;
