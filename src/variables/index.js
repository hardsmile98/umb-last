const apiUrl = window.location.hostname.indexOf('.onion') > -1
  ? 'http://o5thcbe4ud7agx3mdhuis7u5hdjmbmc7ekbz2kyrrnrb6fenictzl7yd.onion'
  : 'https://apis.umbrella.day';

const captchaKey = '951a4e66-a414-4ed4-9dce-3473af0fbd38';

export {
  captchaKey,
  apiUrl,
};
