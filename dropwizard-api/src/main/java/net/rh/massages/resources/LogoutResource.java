package net.rh.massages.resources;

import javax.annotation.security.PermitAll;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;

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
