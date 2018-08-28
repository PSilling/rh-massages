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

package cz.redhat.auth;

import de.ahus1.keycloak.dropwizard.AbstractKeycloakAuthenticator;
import de.ahus1.keycloak.dropwizard.KeycloakConfiguration;
import javax.servlet.http.HttpServletRequest;
import org.keycloak.KeycloakSecurityContext;

/**
 * Keycloak authenticator updated to work with new {@link User} representation.
 *
 * @author psilling
 * @since 1.0.0
 */
public class KeycloakAuthenticator extends AbstractKeycloakAuthenticator<User> {

  /**
   * Constructor.
   *
   * @param configuration Keycloak configuration
   */
  public KeycloakAuthenticator(KeycloakConfiguration configuration) {
    super(configuration);
  }

  /**
   * Authenticates a new Keycloak {@link User}.
   *
   * @return the newly authenticated {@link User}
   */
  @Override
  protected User prepareAuthentication(
      KeycloakSecurityContext securityContext,
      HttpServletRequest request,
      KeycloakConfiguration configuration) {
    return new User(securityContext, request, configuration);
  }
}
