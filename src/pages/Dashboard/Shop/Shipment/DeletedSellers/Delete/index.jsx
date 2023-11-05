/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { getLocales, request } from 'utils';

class DeletedModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      category: 0,
      subcategory: 0,
      product: 0,
      subproduct: 0,
      subproducts: [],
      subcategories: [],
      typeofklad: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  sendData() {
    if (this.state.category !== 0 && this.state.product !== 0) {
      this.setState({
        loading: true,
      });

      const data = {
        api: 'user',
        body: {
          data: {
            section: 'shop',
            type: 'shipment',
            subtype: 'sellers',
            shop: this.props.match.params.shopId,
            category: this.state.category.toString(),
            subcategory: this.state.subcategory.toString(),
            product: this.state.product.toString(),
            subproduct: this.state.subproduct.toString(),
            typeofklad: +this.state.typeofklad,
            selected: this.props.selected,
            action: 'updateDeleted',
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
    } else {
      this.setState({
        loading: false,
      });
      toast.error('Заполнены не все поля');
    }
  }

  componentDidMount() {
    this.props.categories.map((item) => {
      if (item.id === this.state.category) {
        if (item.sub === 1) {
          this.setState({
            subcategories: item.subcategories,
          });
        } else {
          this.setState({
            subcategories: [],
            subcategory: 0,
          });
        }
      }
    });

    this.props.products.map((item) => {
      if (item.id === this.state.product) {
        if (item.sub === 1) {
          this.setState({
            subproducts: item.subproducts,
          });
        } else {
          this.setState({
            subproducts: [],
            subproduct: 0,
          });
        }
      }
    });
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox' ? 'checked' : 'value'];
    const { name } = e.target;

    if (name === 'category') {
      this.props.categories.map((item) => {
        if (item.id === value) {
          if (item.sub === 1) {
            this.setState({
              subcategories: item.subcategories,
              subcategory: 0,
            });
          } else {
            this.setState({
              subcategories: [],
              subcategory: 0,
            });
          }
          this.setState({
            [name]: value,
          });
        }
      });
    } else if (name === 'product') {
      this.props.products.map((item) => {
        if (item.id === value) {
          if (item.sub === 1) {
            this.setState({
              subproducts: item.subproducts,
              subproduct: 0,
            });
          } else {
            this.setState({
              subproducts: [],
              subproduct: 0,
            });
          }
          this.setState({
            [name]: value,
          });
        }
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
  }

  render() {
    return (
      <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
        <div className="modal-header text-center">
          <h4 className="modal-title font-m">
            {getLocales('Восстановление адресов')}
          </h4>
        </div>

        <ModalBody>
          <div className="form-group ">
            <label className="form-control-label font-m">
              {getLocales('Город')}
            </label>
            <select
              disabled={this.state.loading}
              value={this.state.category}
              onChange={this.handleChange}
              name="category"
              className="form-control"
            >
              <option disabled value="0">{getLocales('Не выбран')}</option>
              {this.props.categories.map((item) => (
                <option
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {this.state.subcategories.length > 0
            ? (
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Район')}
                </label>
                <select
                  disabled={this.state.loading}
                  value={this.state.subcategory}
                  onChange={this.handleChange}
                  name="subcategory"
                  className="form-control"
                >
                  <option disabled value="0">{getLocales('Не выбран')}</option>
                  {this.state.subcategories.map((item) => (
                    <option
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )
            : ''}

          <div className="form-group">
            <label className="form-control-label font-m">
              {getLocales('Товар')}
            </label>
            <select
              disabled={this.state.loading}
              value={this.state.product}
              onChange={this.handleChange}
              name="product"
              className="form-control"
            >
              <option disabled value="0">{getLocales('Не выбран')}</option>
              {this.props.products.map((item) => (
                <option
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {this.state.subproducts.length > 0
            ? (
              <div className="form-group">
                <label className="form-control-label font-m">
                  {getLocales('Фасовка')}
                </label>
                <select
                  disabled={this.state.loading}
                  value={this.state.subproduct}
                  onChange={this.handleChange}
                  name="subproduct"
                  className="form-control"
                >
                  <option disabled value="0">{getLocales('Не выбран')}</option>
                  {this.state.subproducts.map((item) => (
                    <option
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )
            : ''}

          <div className="form-group">
            <label className="form-control-label font-m">
              {getLocales('Тип клада')}
            </label>
            <select
              disabled={this.state.loading}
              value={this.state.typeofklad}
              onChange={this.handleChange}
              name="typeofklad"
              className="form-control"
            >
              {this.props.typeOfKlads.map((item) => (
                <option
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>
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
                    : getLocales('Восстановить')}
                </button>
              </div>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default DeletedModal;
