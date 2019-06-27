const get = jest.fn((url, update) => {
  update([]);
});

const post = jest.fn((url, data, update = () => {}) => {
  update();
});

const put = jest.fn((url, data, update = () => {}) => {
  update();
});

const send = jest.fn();

const tryWebSocketSend = jest.fn(message => {
  send(message);
});

const WEBSOCKET_CALLBACKS = {
  client: null,
  facility: null,
  massage: null
};

module.exports = {
  get,
  post,
  put,
  send,
  tryWebSocketSend,
  WEBSOCKET_CALLBACKS
};
