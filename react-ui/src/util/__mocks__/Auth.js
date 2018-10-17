const isAdmin = jest.fn().mockReturnValue(true);
const isAuthenticated = jest.fn().mockReturnValue(true);
const subscribed = true;
const getToken = jest.fn().mockReturnValue("secret");
const getSub = jest.fn().mockReturnValue("test");
const getClient = jest.fn().mockReturnValue({
  sub: "test",
  email: "test@email.com",
  name: "Test",
  surname: "User",
  subscribed: true
});

module.exports = {
  isAdmin,
  isAuthenticated,
  subscribed,
  getToken,
  getSub,
  getClient
};
