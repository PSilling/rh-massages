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

import de.ahus1.keycloak.dropwizard.AbstractUser;
import de.ahus1.keycloak.dropwizard.KeycloakConfiguration;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.ForbiddenException;
import org.keycloak.KeycloakSecurityContext;

/**
 * Custom authentication user representation with added user information getters.
 *
 * @author psilling
 * @since 1.0.0
 */
public class User extends AbstractUser {

  /**
   * Constructor.
   *
   * @param securityContext       Keycloak authorization context
   * @param request               HTTP servlet request
   * @param keycloakConfiguration Keycloak configuration
   */
  public User(
      KeycloakSecurityContext securityContext,
      HttpServletRequest request,
      KeycloakConfiguration keycloakConfiguration) {
    super(request, securityContext, keycloakConfiguration);
  }

  /**
   * Checks whether the {@link User} has admin role.
   *
   * @return true if admin role is present, false otherwise
   */
  @SuppressWarnings("BooleanMethodIsAlwaysInverted")
  public boolean isAdmin() {
    return getRoles().contains("admin");
  }

  /**
   * Checks whether the {@link User} has masseur role.
   *
   * @return true if masseur role is present, false otherwise
   */
  public boolean isMasseur() {
    return getRoles().contains("masseur");
  }

  /**
   * Checks whether the {@link User} has a given role.
   *
   * @param role role to be checked
   * @throws ForbiddenException if the {@link User} doesn't have the required role
   */
  public void checkUserInRole(String role) {
    if (!getRoles().contains(role)) {
      throw new ForbiddenException();
    }
  }

  /**
   * Gives out the name of the Keycloak user.
   *
   * @return the desired name
   */
  @Override
  public String getName() {
    return securityContext.getToken().getName();
  }

  /**
   * Gives out the first name of the Keycloak user.
   *
   * @return the desired name
   */
  public String getFirstName() {
    return securityContext.getToken().getGivenName();
  }

  /**
   * Gives out the surname of the Keycloak user.
   *
   * @return the desired surname
   */
  public String getSurname() {
    return securityContext.getToken().getFamilyName();
  }

  /**
   * Gives out the subject of the Keycloak user.
   *
   * @return the desired subject
   */
  public String getSubject() {
    return securityContext.getToken().getSubject();
  }

  /**
   * Gives out the email of the Keycloak user.
   *
   * @return the desired email
   */
  public String getEmail() {
    return securityContext.getToken().getEmail();
  }
}
