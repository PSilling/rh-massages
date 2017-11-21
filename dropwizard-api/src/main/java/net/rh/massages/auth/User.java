/*******************************************************************************
 *     Copyright (C) 2017  Petr Silling
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *******************************************************************************/
package net.rh.massages.auth;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.ForbiddenException;

import org.keycloak.KeycloakSecurityContext;

import de.ahus1.keycloak.dropwizard.AbstractUser;
import de.ahus1.keycloak.dropwizard.KeycloakConfiguration;

/**
 * User Custom authentication User representation with an added user subject
 * getter.
 *
 * @author psilling
 * @since 1.0.0
 *
 */

public class User extends AbstractUser {

	/**
	 * Parameterized User constructor
	 *
	 * @param securityContext Keycloak authorization context
	 * @param request user HTTP servlet request
	 * @param keycloakConfiguration Keycloak configuration
	 */
	public User(KeycloakSecurityContext securityContext, HttpServletRequest request,
			KeycloakConfiguration keycloakConfiguration) {
		super(request, securityContext, keycloakConfiguration);
	}

	/**
	 * Checks whether the User has a given role.
	 *
	 * @param role role to be checked
	 * @throws ForbiddenException if the User doesn't have the required role
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
	 * Gives out the subject of the Keycloak user.
	 *
	 * @return the desired subject
	 */
	public String getSubject() {
		return securityContext.getToken().getSubject();
	}
}