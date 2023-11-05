import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { request } from 'utils';

class TicketNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        categories: {},
      },
      category: 'none',
      theme: '',
      message: '',
      loading: true,
    };
    this.getData = this.getData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  componentDidMount() {
    this.getData();
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

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'tickets',
          type: 'ticketsData',
        },
        action: 'support',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          this.setState({
            data: response.data.data,
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

  sendData() {
    const { state, props } = this;

    if (state.category === 'none') {
      toast.error('Необходимо выбрать категорию обращения');
      return;
    }

    if (state.theme.length > 36) {
      toast.error('Максимальная длина темы - 36 символов');
      return;
    }

    if (state.message.length > 2048) {
      toast.error('Максимальная длина проблемы - 2048 символов');
    }

    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'tickets',
          type: 'create',
          category: state.category,
          theme: state.theme,
          message: state.message,
        },
        action: 'support',
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

          props.history.push(`/dashboard/support/ticket/${response.data.data.ticket}`);
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
    const { state } = this;

    return (
      <>
        <div
          className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}
          style={{ marginBottom: '15px' }}
        >
          <div className="text-center">
            Ни при каких условиях
            {' '}
            <span className="text-danger">
              не сообщайте
            </span>
            {' '}
            никому конфиденциальные данные Вашего аккаунта
          </div>
        </div>
        <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="form-group">
                  <label className="form-control-label font-m">
                    Категория обращения
                  </label>
                  <select
                    disabled={state.loading}
                    onChange={this.handleChange}
                    value={state.category}
                    name="category"
                    className="form-control"
                  >
                    <option disabled value="none">Не выбрано</option>
                    {Object.entries(state.data.categories)
                      .map((item) => (
                        <option
                          value={item[1].name}
                        >
                          {item[1].title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-control-label font-m">
                    Тема
                  </label>
                  <input
                    autoComplete="off"
                    maxLength={36}
                    disabled={state.loading}
                    onChange={this.handleChange}
                    value={state.theme}
                    className="form-control"
                    placeholder="Введите тему"
                    name="theme"
                  />
                  <small>
                    Максимальная длина темы - 36 символов
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-control-label font-m">
                    Описание проблемы
                  </label>
                  <textarea
                    autoComplete="off"
                    maxLength={2048}
                    disabled={state.loading}
                    onChange={this.handleChange}
                    value={state.message}
                    className="form-control support-textarea"
                    placeholder="Введите проблему"
                    name="message"
                  />
                  <small>
                    Максимальная длина сообщения - 2048 символов
                  </small>
                </div>

                <div className="row">
                  <div className="col-lg-2">
                    <NavLink to="/dashboard/support/tickets">
                      <button
                        type="button"
                        className="btn btn-secondary font-g auth-btn"
                      >
                        Назад
                      </button>
                    </NavLink>
                  </div>

                  <div className="col-lg-6" />

                  <div className="col-lg-4">
                    <button
                      type="button"
                      onClick={this.sendData}
                      disabled={state.loading}
                      className="btn btn-primary right font-g auth-btn"
                    >
                      {state.loading
                        ? 'Загрузка...'
                        : 'Создать обращение'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default TicketNew;
