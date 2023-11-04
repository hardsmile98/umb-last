import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import renderHTML from 'react-render-html';
import { request, getLocales } from 'utils';

const opened = [];

class Answers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        faq: [{
          content: '',
          name: '',
        }],
      },
      opened: [],
      loading: true,
      search: '',
      display: [],
    };
    this.getData = this.getData.bind(this);
    this.search = this.search.bind(this);
    this.clickOnHead = this.clickOnHead.bind(this);
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
          section: 'get',
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
          const res = [];

          response.data.data.faq.forEach((item) => {
            if (item.flag === localStorage.getItem('lang')) {
              res.push(item);
            }
          });

          response.data.data.faq = res;

          this.setState({
            data: response.data.data,
            loading: false,
          }, () => {
            this.search({ target: { value: '' } });
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

  search(e) {
    const { state } = this;

    const results = [];

    this.setState({
      search: e.target.value.toLowerCase(),
    }, () => {
      for (let i = 0; i < state.data.faq.length; i += 1) {
        if (state.data.faq[i].name.toLowerCase()
          .indexOf(state.search) !== -1 || state.data.faq[i].content.toLowerCase()
          .indexOf(state.search) !== -1) {
          results.push(state.data.faq[i]);
        }
      }

      this.setState({
        display: results,
      });
    });
  }

  clickOnHead(id) {
    const { state } = this;

    if (state.opened.indexOf(id) === -1) {
      opened.push(id);

      this.setState({
        opened,
      });
    } else {
      const index = opened.indexOf(id);

      opened.splice(index, 1);

      this.setState({
        opened,
      });
    }
  }

  render() {
    const { state } = this;

    return (
      <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
        <div className="block-body">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="font-m">
                {getLocales('Инструкции')}
              </h3>

              <div className="row">
                <div className="col-lg-12">
                  <div className="form-group">
                    <label className="font-m">
                      {getLocales('Поиск')}
                    </label>
                    <input
                      className="form-control"
                      autoComplete={false}
                      name="search"
                      onChange={this.search}
                      value={state.search}
                      placeholder={getLocales('Введите ключевое слово')}
                    />
                  </div>
                </div>

                {state.display.map((item) => (
                  <div className="col-lg-12">
                    <div className="avatar-block notice-chat cursor-pointer font-m">
                      <span
                        aria-hidden
                        className="head-faq"
                        onClick={() => this.clickOnHead(item.id)}
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        {' '}
                        {item.name}
                      </span>

                      {state.opened.indexOf(item.id) !== -1 && (
                        <div className="avatar-block notice-chat font-m">
                            {renderHTML(item.content)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Answers;
