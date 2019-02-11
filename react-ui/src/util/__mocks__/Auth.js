const isAdmin = jest.fn().mockReturnValue(true);
const isMasseur = jest.fn().mockReturnValue(true);
const isAdminOrMasseur = jest.fn().mockReturnValue(true);
const isAuthenticated = jest.fn().mockReturnValue(true);
const subscribed = true;
const getToken = jest.fn().mockReturnValue("secret");
const getSub = jest.fn().mockReturnValue("test");
const getClient = jest.fn().mockReturnValue({
  sub: "test",
  email: "test@email.com",
  name: "Test",
  surname: "User",
  masseur: false,
  subscribed: true
});
const keycloak = {
  subject: "test",
  idTokenParsed: {
    email: "test@email.com",
    given_name: "Test",
    family_name: "User"
  }
};

module.exports = {
  isAdmin,
  isMasseur,
  isAdminOrMasseur,
  isAuthenticated,
  subscribed,
  getToken,
  getSub,
  getClient,
  keycloak
};
