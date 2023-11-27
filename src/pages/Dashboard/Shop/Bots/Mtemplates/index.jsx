/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import renderHTML from 'react-render-html';
import { request, getLocales } from 'utils';
import { EmojiInput, ModalConfirm } from 'components';

class Mtemplates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        tTemplates: [],
        shoptTemplates: [],
      },
      category: 'page',
      datas: [],
      content: '',
      templateName: '',
      systemName: 'startPage',
      variables: '',
      canRecovery: false,
      modal: false,
    };

    this.getData = this.getData.bind(this);
    this.sendData = this.sendData.bind(this);
    this.changeCategory = this.changeCategory.bind(this);
    this.compile = this.compile.bind(this);
    this.getValueOfTemplate = this.getValueOfTemplate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.recovery = this.recovery.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  handleChange(e) {
    const value = e.target[e.target.type === 'checkbox' ? 'checked' : 'value'];
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
          section: 'shop',
          type: 'bots',
          subtype: 'tTemplates',
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
            data: response.data.data,
            loading: false,
          }, () => {
            this.compile();
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

  getValueOfTemplate(name) {
    let result = false;
    let nameT = false;
    let systemName = false;
    let variables = '';
    let canRecovery = false;
    this.state.data.shoptTemplates.map((item) => {
      if (item.name === name) {
        result = item.content;
        nameT = item.label;
        systemName = name;
        canRecovery = true;
      }
    });

    if (!result) {
      this.state.data.tTemplates.map((item) => {
        if (item.name === name) {
          result = item.content;
          nameT = item.label;
          systemName = name;
          canRecovery = false;
        }
      });
    }

    this.state.data.tTemplates.map((item) => {
      if (item.name === name) {
        variables = item.variables;
      }
    });

    this.setState({
      content: result,
      templateName: nameT,
      systemName,
      variables,
      canRecovery,
    });
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  recovery() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'bots',
          subtype: 'tTemplates',
          shop: this.props.match.params.shopId,
          action: 'recovery',
          name: this.state.systemName,
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
          this.toggle();
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

  sendData() {
    if (this.state.content.length > 0) {
      this.setState({
        loading: true,
      });

      const data = {
        api: 'user',
        body: {
          data: {
            section: 'shop',
            type: 'bots',
            subtype: 'tTemplates',
            shop: this.props.match.params.shopId,
            action: 'update',
            name: this.state.systemName,
            value: this.state.content,
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
    } else {
      toast.error('Шаблон не может быть пустым');
    }
  }

  changeCategory(name) {
    this.setState({
      category: name,
    }, () => {
      this.compile();
    });
  }

  compile() {
    const datas = [];
    this.state.data.tTemplates.map((item) => {
      if (item.category === this.state.category) {
        datas.push(item);
      }
    });

    this.state.data.shoptTemplates.map((item) => {
      if (item.name === datas[0].name) {
        datas[0].content = item.content;
        datas[0].canRecovery = true;
      }
    });

    this.setState({
      datas,
      content: datas[0].content,
      templateName: datas[0].label,
      systemName: datas[0].name,
      variables: datas[0].variables,
      canRecovery: datas[0].canRecovery ? datas[0].canRecovery : false,
    });
  }

  render() {
    return (
      <>
        <div className={`block animate__animated animate__fadeIn no-margin ${this.state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="font-m">
                  {getLocales('Шаблоны сообщений')}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className={`xtabs template xtabs_bottom animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
          <div className="xtabs__body">
            <a
              aria-hidden
              className={`xtabs__item font-m ${this.state.category === 'page' ? 'active' : ''}`}
              onClick={() => this.changeCategory('page')}
            >
              <span>{getLocales('Общие')}</span>
            </a>

            <a
              aria-hidden
              className={`xtabs__item font-m ${this.state.category === 'shop' ? 'active' : ''}`}
              onClick={() => this.changeCategory('shop')}
            >
              <span>{getLocales('Магазин')}</span>
            </a>

            <a
              aria-hidden
              className={`xtabs__item font-m ${this.state.category === 'support' ? 'active' : ''}`}
              onClick={() => this.changeCategory('support')}
            >
              <span>{getLocales('Поддержка')}</span>
            </a>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 bigzindex">
            <div className={`block animate__animated animate__fadeIn margin-block-top ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h3 className="font-m">
                  {getLocales('Шаблон')}
                  :
                  {' '}
                  {this.state.templateName}
                  {' '}
                  {this.state.canRecovery && (
                    <span className="right">
                      <a onClick={this.toggle} aria-hidden>
                        {getLocales('Восстановить шаблон')}
                      </a>
                    </span>
                  )}
                </h3>

                <div className="row">
                  <div className="col-lg-12">
                    <EmojiInput
                      type="textarea"
                      value={this.state.content}
                      placeholder={getLocales('Введите содержание страницы')}
                      name="content"
                      handleChange={this.handleChange}
                    />
                    <br />
                  </div>

                  <div className="col-lg-8">
                    <div className="avatar-block notice-chat no-margin">
                      <h3 className="font-m">
                        {getLocales('Переменные')}
                        :
                      </h3>
                      {renderHTML(this.state.variables)}
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <button
                      type="button"
                      disabled={this.state.loading}
                      className="btn btn-primary w-100 font-m"
                      onClick={this.sendData}
                    >
                      {this.state.loading
                        ? getLocales('Загрузка...')
                        : getLocales('Сохранить')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className={`block animate__animated animate__fadeIn margin-block-top ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                {this.state.datas
                  .map((item) => (
                    <button
                      type="button"
                      onClick={() => this.getValueOfTemplate(item.name)}
                      className="btn btn-secondary auth-btn list font-m"
                    >
                      {item.label}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <ModalConfirm
          action={getLocales('Вы действительно хотите восстановить данный шаблон?')}
          modal={this.state.modal}
          toggle={this.toggle}
          loading={this.state.loading}
          sendData={this.recovery}
        />
      </>
    );
  }
}

export default Mtemplates;
