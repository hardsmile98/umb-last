/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { faCashRegister, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ModalConfirm } from 'components';
import { request, getLocales } from 'utils';
import ShopNotifyModal from './ShopNotifyModal';

class Shops extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        shops: [],
        limit: 1,
        price: 100,
      },
      modal: false,
      modalNot: false,
    };
    this.getData = this.getData.bind(this);
    this.createNew = this.createNew.bind(this);
    this.toggle = this.toggle.bind(this);
    this.buySlot = this.buySlot.bind(this);
    this.toggleNot = this.toggleNot.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const { state } = this;

    this.setState({
      loading: true,
    });

    const data = {
      api: 'user',
      body: {
        data: {
          section: 'get',
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
            if (state.data.shops.length <= 0) {
              this.toggleNot();
            }
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

  toggleNot() {
    const { state } = this;

    this.setState({
      modalNot: !state.modalNot,
    });
  }

  toggle() {
    const { state } = this;

    this.setState({
      modal: !state.modal,
    });
  }

  buySlot() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'buyslot',
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
          this.toggle();
          this.getData();
        } else {
          this.toggle();
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

  createNew() {
    const { state, props } = this;

    if (+state.data.shops.length < +state.data.limit) {
      props.history.push('/dashboard/shops/new');
    } else {
      this.toggle();
      toast.error(getLocales('Достигнут лимит магазинов'));
    }
  }

  render() {
    const { state, props } = this;

    return (
      <>
        <div className="row">
          <div className="col-lg-12">
            <div className={`block animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h4 className="font-m">
                  {getLocales('Ваши магазины')}
                </h4>

                <br />

                <div className="row">
                  {state.data.shops.map((item, i) => (
                    <Link to={`${props.match.url}/${item.uniqueId}`}>
                      <div className="col-lg-3">
                        <div className="avatar-block coworker-block shop-block-act">
                          <div className="text-center flex-center">
                            <div className="avatar">
                              <FontAwesomeIcon icon={faCashRegister} />
                            </div>
                            <br />
                          </div>

                          <div className="text-center margin-15">
                            <div className="bold font-m">
                              {getLocales('Магазин')}
                              {'# '}
                              {i + 1}
                            </div>

                            <small className="text-danger">
                              {item.uniqueId}
                            </small>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}

                  <div className="col-lg-3">
                    <a onClick={this.createNew}>
                      <div className="avatar-block coworker-block add-coworker shop-block-act">
                        <div className="text-center flex-center">
                          <div className="avatar">
                            <FontAwesomeIcon icon={faPlusCircle} />
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ShopNotifyModal
          modal={state.modalNot}
          toggle={this.toggleNot}
        />

        <ModalConfirm
          action={`${getLocales('Лимит магазинов достигнут. Желаете приобрести 3 дополнительных слота для магазина за ')} ${state.data.price}$?`}
          consequences=""
          modal={state.modal}
          toggle={this.toggle}
          loading={state.loading}
          sendData={this.buySlot}
        />
      </>
    );
  }
}

export default Shops;
