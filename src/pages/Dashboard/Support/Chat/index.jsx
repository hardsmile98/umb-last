/* eslint-disable react/no-danger */
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import moment from 'moment';
import { request, getLocales } from 'utils';
import renderHTML from 'react-render-html';

function Chat() {
  const intervalId = useRef(null);
  const messageBlockRef = useRef(null);

  const [isDataLoading, setDataLoading] = useState(false);
  const [isSending, setSending] = useState(false);
  const [data, setData] = useState({
    messages: [],
  });
  const [messageValue, setMessageValue] = useState('');

  const onMessageChange = (e) => setMessageValue(e.target.value);

  const scrollToBottom = () => {
    messageBlockRef.current.scrollTop = messageBlockRef.current?.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [data.messages]);

  const getData = () => {
    const body = {
      api: 'user',
      body: {
        data: {
          section: 'chat',
          type: 'get',
        },
        action: 'support',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(body, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          setData(response.data.data);
          setDataLoading(false);
        } else {
          setDataLoading(false);
          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  };

  const sendData = () => {
    if (!messageValue) {
      toast.error('Вы не ввели сообщение');
    }

    setSending(true);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'chat',
          type: 'send',
          text: messageValue,
        },
        action: 'support',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(body, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          setMessageValue('');
          setDataLoading(true);
          getData();
          setSending(false);
        } else {
          setSending(false);
          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  };

  useEffect(() => {
    setDataLoading(true);

    if (!intervalId.current) {
      intervalId.current = setInterval(getData, 5000);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className={`block animate__animated animate__fadeIn ${isDataLoading || isSending ? 'blur' : ''}`}>
          <div className="block-body">
            <h4 className="font-m">
              {getLocales('Чат с командой поддержки')}
            </h4>

            <div
              className="messages-block chat"
              ref={messageBlockRef}
            >
              {data.messages.length > 0
                ? data.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-block font-m chat ${message.admin ? 'admin' : 'user'}`}
                  >
                    <div className="bold message-name">
                      {message.user}
                    </div>

                    <div className="message-content">
                      <p>
                        {renderHTML(message.value)}
                      </p>
                    </div>

                    <div className="message-date text-right">
                      {moment.unix(message.date / 1000).format('LLL')}
                    </div>

                    {message.user.indexOf('стажёр') > -1 && (
                    <div className="avatar-block font-m">
                      <FontAwesomeIcon icon={faBolt} />
                      {' '}
                      <b>
                        Ни при каких условиях не передавайте данному сотруднику данные
                        Вашей учетной записи, АПИ токены и другую компроментирующую информацию.
                      </b>
                    </div>
                    )}
                  </div>
                ))
                : (
                  <div className="message-block font-m admin chat">
                    <div className="bold message-name">
                      System
                    </div>

                    <div className="message-content">
                      <p dangerouslySetInnerHTML={{
                        __html: getLocales('Доброго времени суток. Перед обращением в поддержку рекомендуем ознакомиться с инструкциями в базе знаний.<br/><br/>Наша команда поддержки работает 24/7, но ночью время ответа может составлять дольше обычного. Чем можем Вам помочь?'),
                      }}
                      />
                    </div>

                    <div className="message-date text-right">
                      {getLocales('сейчас')}
                    </div>
                  </div>
                )}
            </div>

            <div>
              <div className="form-group message-area">
                <label
                  htmlFor="message"
                  className="font-m"
                >
                  {getLocales('Сообщение')}
                </label>
                <textarea
                  name="message"
                  value={messageValue}
                  onChange={onMessageChange}
                  className="form-control"
                  placeholder={getLocales('Введите сообщение')}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-lg-3" />
              <div className="col-lg-3" />
              <div className="col-lg-6">
                <button
                  type="button"
                  onClick={sendData}
                  disabled={isSending || isDataLoading}
                  className="btn btn-primary right font-m auth-btn"
                >
                  {isSending || isDataLoading
                    ? getLocales('Загрузка...')
                    : getLocales('Отправить сообщение')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className={`block animate__animated animate__fadeIn ${isDataLoading ? 'blur' : ''}`}>
          <div className="block-body">
            <h4 className="font-m">
              {getLocales('Памятка')}
            </h4>

            <div className="avatar-block notice-chat">
              {getLocales('Ни при каких условиях')}
              {' '}
              <span className="text-danger">{getLocales('не сообщайте')}</span>
              {' '}
              {getLocales('никому, в том числе нашей команде технической поддержки конфиденциальные данные Вашего аккаунта.')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
