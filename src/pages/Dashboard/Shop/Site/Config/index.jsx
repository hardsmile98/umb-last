/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { request, getLocales } from 'utils';
import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';

class Config extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      css: '',
    };

    this.handleCssChange = this.handleCssChange.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  handleCssChange(value) {
    this.setState({
      css: value,
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
          subtype: 'css',
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
            loading: false,
            css: response.data.data.css,
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
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'site',
          subtype: 'css',
          shop: this.props.match.params.shopId,
          action: 'update',
          value: this.state.css,
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
    return (
      <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
        <div className="block-body">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="font-m">
                {getLocales('Продвинутая конфигурация')}
              </h3>

              <br />

              <div className="form-group">
                <label className="form-control-label font-m">
                  CSS
                </label>

                <CodeMirror
                  value={this.state.css}
                  height="240px"
                  className="code-css"
                  onChange={this.handleCssChange}
                  extensions={[css()]}
                />
              </div>

              <div className="mr-auto right">
                <button
                  type="button"
                  className="btn btn-primary font-m"
                  onClick={this.sendData}
                >
                  {getLocales('Сохранить')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Config;
