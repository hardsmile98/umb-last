/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Table, EmojiInput } from 'components';
import { request, getLocales } from 'utils';

class Userspam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        spam: [],
      },
      content: '',
      items: [],
    };
    this.getData = this.getData.bind(this);
    this.sendData = this.sendData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.prepareTableData = this.prepareTableData.bind(this);
    this.updateItems = this.updateItems.bind(this);
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
          subtype: 'spam',
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
            this.prepareTableData();
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
          type: 'bots',
          subtype: 'spam',
          shop: this.props.match.params.shopId,
          action: 'create',
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
          this.setState({
            content: '',
          });
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

  prepareTableData() {
    const newItems = this.state.data.spam.map((item) => ({
      id: item.id,
      content: item.content,
      date: moment.unix(item.date / 1000).format('LLL'),
      count: item.count,
    }));

    this.setState({
      items: newItems,
    });
  }

  updateItems(items) {
    this.setState({
      items,
    });
  }

  render() {
    const tableColumns = [
      {
        title:
         getLocales('Сообщение'),
        dataIndex: 'value',
        key: 'operations',
        render: (e, item) => <p>{item.content}</p>,
      },
      {
        title:
        getLocales('Кол-во получателей рассылки'),
        dataIndex: 'count',
        itemClassName: 'text-left',
        headerClassName: 'text-left',
        key: 'operations',
        sort: true,
        render: (e, item) => <p>{item.count}</p>,
      },
      {
        title: getLocales('Дата'),
        dataIndex: '',
        key: 'operations',
        render: (e, item) => <p>{item.date}</p>,
      },
      {
        title: getLocales('Действие'),
        dataIndex: '',
        key: 'operations',
        itemClassName: 'text-center',
        headerClassName: 'text-center',
        render: (_e, item) => (
          <div className="sparkline8">
            <button
              type="button"
              onClick={() => {
                this.handleChange({
                  target: {
                    name: 'content', value: item.content,
                  },
                });
                window.scrollTo(0, 0);
              }}
              className="btn font-m btn-primary btn-width-auto"
            >
              {getLocales('Повторить')}
            </button>
          </div>
        ),
      },
    ];

    return (
      <>
        <div
          className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="font-m">
                  {getLocales('Массовая рассылка')}
                </h3>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('Сообщение')}
                      </label>
                      <EmojiInput
                        type="textarea"
                        value={this.state.content}
                        placeholder={getLocales('Введите сообщение, которое необходимо разослать')}
                        name="content"
                        handleChange={this.handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <button
                      type="button"
                      onClick={this.sendData}
                      className="btn btn-primary font-m right"
                    >
                      {getLocales('Начать массовую рассылку')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
          <div className="block-body">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="font-m">
                  {getLocales('Предыдущие рассылки')}
                </h3>

                {this.state.data.spam.length > 0
                  ? (
                    <Table
                      search
                      columns={tableColumns}
                      items={this.state.items}
                      updateItems={this.updateItems}
                      rowsPerPage="10"
                    />
                  )
                  : (
                    <div className="text-center font-m">
                      {getLocales('Рассылок ранее не было')}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Userspam;
