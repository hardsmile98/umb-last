/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { request } from 'utils';

class Terms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      terms: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.getData = this.getData.bind(this);
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
          section: 'inform',
          type: 'getTerms',
        },
        action: 'admin',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    global.createRequest(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          this.setState({
            terms: response.data.data.terms,
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
    const { state } = this;

    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'inform',
          type: 'updateTerms',
          value: state.terms,
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
          toast.success(response.data.message);
          this.getData();
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
    const { state } = this;

    return (
      <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
        <div className="block-body">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="font-m">
                Настроки пользовательского соглашения
              </h3>

              <div className="avatar-block notice-chat">
                <FontAwesomeIcon icon={faInfoCircle} />
                {' HTML поддерживается.'}
              </div>

              <div className="form-group message-area">
                <label
                  htmlFor="terms"
                  className="font-m"
                >
                  Пользовательское соглашение
                </label>
                <textarea
                  name="terms"
                  value={state.terms}
                  onChange={this.handleChange}
                  className="form-control"
                  placeholder="Введите соглашение"
                />
              </div>

              <button
                type="button"
                className="btn btn-primary font-m right"
                onClick={this.sendData}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Terms;
