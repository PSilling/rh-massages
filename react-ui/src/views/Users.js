// react imports
import React, { Component } from "react";

// module imports
import { Table } from "reactstrap";

// component imports
import InfoAlert from "../components/util/InfoAlert";
import UnauthorizedMessage from "../components/util/UnauthorizedMessage";
import UserRow from "../components/rows/UserRow";
import "../styles/components/loader.css";

// util imports
import _t from "../util/Translations";
import Auth from "../util/Auth";
import Fetch from "../util/Fetch";
import Util from "../util/Util";

/**
 * Main view table component for User management. Visible only with administrator priviledges.
 */
class Users extends Component {
  state = { users: [], loading: true };

  alertMessage =
    _t.translate("Here you can control user visibility for client selection by removing users from the list. ") +
    _t.translate("Users are automatically added after they access the portal so that they can assign massages. ") +
    _t.translate("However, keep in mind that removing a user will cancel all of the user's assignments or, ") +
    _t.translate("if the user is a massuer or a masseuse, completely remove such massages. Removing a logged in ") +
    _t.translate("user will cause an automatic logout.");

  componentDidMount() {
    this.getUsers();
    Fetch.WEBSOCKET_CALLBACKS.client = this.clientCallback;
  }

  componentWillUnmount() {
    Fetch.WEBSOCKET_CALLBACKS.client = null;
  }

  getUsers = () => {
    Fetch.get(Util.CLIENTS_URL, json => {
      if (json !== undefined) {
        this.setState({ users: json, loading: false });
      }
    });
  };

  clientCallback = (operation, user) => {
    const users = [...this.state.users];
    const index = Util.findInArrayById(users, user.sub, "sub");

    if (index === -1 && operation !== Fetch.OPERATION_ADD) {
      return;
    }

    switch (operation) {
      case Fetch.OPERATION_ADD:
        users.push(user);
        break;
      case Fetch.OPERATION_CHANGE:
        users[index] = user;
        break;
      case Fetch.OPERATION_REMOVE:
        if (user.sub === Auth.getSub()) {
          Auth.keycloak.logout();
        }
        users.splice(index, 1);
        break;
      default:
        console.log(`Invalid WebSocket operation. Found: ${operation}.`); /* eslint-disable-line */
        break;
    }

    this.setState(() => ({ users }));
  };

  closeAlert = () => {
    localStorage.setItem("closeUsersAlert", true);
    this.setState(prevState => ({ loading: prevState.loading }));
  };

  render() {
    if (!Auth.isAdmin()) {
      return <UnauthorizedMessage title={_t.translate("Users")} />;
    }

    return (
      <div>
        {!localStorage.getItem("closeUsersAlert") && (
          <InfoAlert onClose={this.closeAlert}>{this.alertMessage}</InfoAlert>
        )}
        <h1>
          {this.state.loading && <div className="loader float-right" />}
          {_t.translate("Users")}
        </h1>
        <Table hover responsive striped size="sm">
          <thead>
            <tr>
              <th scope="col">{_t.translate("Name and surname")}</th>
              <th scope="col">{_t.translate("E-mail")}</th>
              <th scope="col">{_t.translate("Masseur role")}</th>
              <th scope="col" />
            </tr>
          </thead>
          {this.state.users !== undefined && this.state.users.length > 0 ? (
            <tbody>
              {this.state.users.map(item => (
                <UserRow key={item.sub} user={item} onDelete={() => Fetch.delete(Util.CLIENTS_URL + item.sub)} />
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <th colSpan="4" scope="row">
                  {_t.translate("None")}
                </th>
              </tr>
            </tbody>
          )}
        </Table>
      </div>
    );
  }
}

export default Users;
