/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { request, getLocales } from 'utils';

class Terms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        terms: '',
      },
      loading: true,
    };

    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'getTerms',
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
          response.data.data.terms = response.data.data.terms.split('----');

          response.data.data.terms.map((item) => {
            if (item.replace(/[\r\n]/gm, '').slice(0, 2) === localStorage.getItem('lang')) {
              response.data.data.terms = item.slice(2);
            }

            return item;
          });

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

  render() {
    const { state } = this;

    return (
      <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
        <div className="block-body">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="font-m">
                {getLocales('Пользовательское соглашение')}
              </h3>

              <div className="row">
                <div
                  className="col-lg-12 font-m"
                  dangerouslySetInnerHTML={{ __html: state.data.terms }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Terms;
