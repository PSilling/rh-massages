/*
  Copyright (C) 2017 Petr Silling

  <p>This program is free software: you can redistribute it and/or modify it under the terms of the
  GNU General Public License as published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.

  <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
  without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  <p>You should have received a copy of the GNU General Public License along with this program. If
  not, see <http://www.gnu.org/licenses/>.
*/

package net.rh.massages.auth;

import io.dropwizard.auth.Authorizer;
import javax.ws.rs.ForbiddenException;

/**
 * User authorizer updated to work with new {@link User} representation.
 *
 * @author psilling
 * @since 1.0.0
 */
public class UserAuthorizer implements Authorizer<User> {

  /**
   * Authorizes a User to an action depending on his role.
   *
   * @param user the {@link User} to be authorized
   * @param role the role that is required for the authorization
   * @return true if the {@link User} is authorized, false otherwise
   */
  @Override
  public boolean authorize(User user, String role) {
    try {
      user.checkUserInRole(role);
      return true;
    } catch (ForbiddenException e) {
      return false;
    }
  }
}
