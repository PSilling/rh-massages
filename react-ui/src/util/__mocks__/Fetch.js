const get = jest.fn((url, update) => {
  update([]);
});
const post = jest.fn((url, data, update) => {
  update();
});
const put = jest.fn((url, data, update) => {
  update();
});

module.exports = {
  get,
  post,
  put
};
