/*******************************************************************************
 * Copyright (C) 2017 Petr Silling
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 *******************************************************************************/
package net.rh.massages.resources;

import javax.annotation.security.PermitAll;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;

/**
 * LogoutResource resource class for User logout
 *
 * @author psilling
 * @since 1.0.0
 */

@Path("/logout")
public class LogoutResource {

	@Context
	private HttpServletRequest request;

	public LogoutResource() {
	}

	/**
	 * Logs out the User
	 *
	 * @throws ServletException
	 * @return a brief logged out message
	 */
	@GET
	@PermitAll
	public String logout(@Context SecurityContext context) throws ServletException {
		if (context.getUserPrincipal() != null) {
			request.logout();
		}
		return "You have been successfully logged out.";
	}

}
