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

import java.util.List;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;
import net.rh.massages.auth.User;
import net.rh.massages.core.Client;
import net.rh.massages.db.ClientDAO;

/**
 * ClientResource Client resource class
 *
 * @author psilling
 * @since 1.2.1
 */

@Path("/clients")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClientResource {

	private final ClientDAO clientDao; // Client data access object

	public ClientResource(ClientDAO clientDao) {
		this.clientDao = clientDao;
	}

	/**
	 * GETs all Clients that can be found
	 *
	 * @return list of all Clients
	 */
	@GET
	@RolesAllowed("admin")
	@UnitOfWork
	public List<Client> fetch() {
		return clientDao.findAll();
	}

	/**
	 * Updates a Client to an updated value
	 *
	 * @param client updated Client
	 * @exception WebApplicationException if the Client could not be found or User
	 *                tries to change other Clients without admin role
	 * @return on update response
	 */
	@PUT
	@PermitAll
	@UnitOfWork
	public Response update(@NotNull @Valid Client client, @Auth User user) {
		if (client.getSub() == null) {
			client.setSub(user.getSubject());
		}

		Client daoClient = clientDao.findBySub(client.getSub());

		if (!user.getRoles().contains("admin") && !user.getSubject().equals(client.getSub())) {
			throw new WebApplicationException(Status.FORBIDDEN);
		}

		if (daoClient == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}

		if (!daoClient.equals(client)) {
			clientDao.update(client);
			return Response.ok(client).build();
		} else {
			return Response.noContent().build();
		}
	}

	/**
	 * GETs a Client subscription value. For new Users also creates their Client
	 * representation and returns true.
	 *
	 * @exception WebApplicationException if the Client could not be found after
	 *                creation
	 * @return true if subscribed, false otherwise
	 */
	@GET
	@Path("/my/subscribed")
	@PermitAll
	@UnitOfWork
	public boolean getSubscription(@Auth User user) {
		Client client = clientDao.findBySub(user.getSubject());

		if (client == null) {
			client = new Client(user.getSubject(), user.getEmail(), user.getFirstName(), user.getSurname(), true);
			clientDao.create(client);

			if (clientDao.findBySub(user.getSubject()) == null) {
				throw new WebApplicationException(Status.INTERNAL_SERVER_ERROR);
			}
		}

		return client.isSubscribed();
	}

}
