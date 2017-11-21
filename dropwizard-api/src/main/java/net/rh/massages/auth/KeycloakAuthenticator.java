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

import org.keycloak.KeycloakSecurityContext;

import de.ahus1.keycloak.dropwizard.AbstractKeycloakAuthenticator;
import de.ahus1.keycloak.dropwizard.KeycloakConfiguration;

/**
 * KeycloakAuthenticator Keycloak authenticator updated to work with new User
 * representation.
 *
 * @author psilling
 * @since 1.0.0
 *
 */

public class KeycloakAuthenticator extends AbstractKeycloakAuthenticator<User> {

	/**
	 * Parameterized KeycloakAuthenticator constructor
	 *
	 * @param configuration Keycloak configuration
	 */
	public KeycloakAuthenticator(KeycloakConfiguration configuration) {
		super(configuration);
	}

	/**
	 * Authenticates a new Keycloak user
	 *
	 * @return new authenticated User
	 */
	@Override
	protected User prepareAuthentication(KeycloakSecurityContext securityContext, HttpServletRequest request,
			KeycloakConfiguration configuration) {
		return new User(securityContext, request, configuration);
	}
}