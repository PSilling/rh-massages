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

package net.rh.massages.resources;

import javax.annotation.security.PermitAll;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;
import net.rh.massages.auth.User;

/**
 * Resource class for {@link User} logout.
 *
 * @author psilling
 * @since 1.0.0
 */
@Path("/logout")
public class LogoutResource {

  @Context
  private HttpServletRequest request; // request context (with authorization)

  /**
   * Constructor.
   */
  public LogoutResource() {
  }

  /**
   * Logs out the {@link User} from the application.
   *
   * @param context context connected to the request
   * @return a brief logging out out information message
   */
  @GET
  @PermitAll
  public String logout(@Context SecurityContext context) {
    if (context.getUserPrincipal() != null) {
      try {
        request.logout();
        return "You have been successfully logged out.";
      } catch (ServletException e) {
        return "You have not been logged out.";
      }
    }
    return "You have not been logged out.";
  }
}
