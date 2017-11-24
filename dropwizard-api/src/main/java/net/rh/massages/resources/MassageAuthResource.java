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
package net.rh.massages.resources;

import java.util.List;

import javax.annotation.security.PermitAll;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;
import io.dropwizard.jersey.params.LongParam;
import net.rh.massages.auth.User;
import net.rh.massages.core.Massage;
import net.rh.massages.db.MassageDAO;

/**
 * MassageAuthResource Massage resource class that groups methods using Auth
 * annotation to allow resource testing
 *
 * @author psilling
 * @since 1.0.0
 *
 */

@Path("/massages")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MassageAuthResource {

	private final MassageDAO massageDao; // massage data access object

	/**
	 * Parameterized MassageResource constructor
	 *
	 * @param massageDao new MassageResource massageDao
	 */
	public MassageAuthResource(MassageDAO massageDao) {
		this.massageDao = massageDao;
	}

	/**
	 * Updates a massage given by id to a given value
	 *
	 * @param massage updated massage
	 * @param id massage id
	 * @exception WebApplicationException if the id could not be found or when
	 *                normal user tries to change a massage that isn't assigned to
	 *                him or change the massage itself
	 * @return on update response
	 */
	@PUT
	@Path("/{id}")
	@PermitAll
	@UnitOfWork
	public Response update(@NotNull @Valid Massage massage, @PathParam("id") LongParam id, @Auth User user) {
		Massage daoMassage = massageDao.findById(id.get());

		if (daoMassage == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}

		massage.setId(id.get());

		if (!user.getRoles().contains("admin")) {
			// user is forbidden to edit anything other than the client and even then the
			// client has to be the user himself or a null
			if (!daoMassage.equals(massage)
					|| (!user.getSubject().equals(massage.getClient())
							&& !user.getSubject().equals(daoMassage.getClient()))
					|| (massage.getClient() != null && !massage.getClient().equals(user.getSubject()))) {
				throw new WebApplicationException(Status.FORBIDDEN);
			}
		}

		massageDao.update(massage);

		return Response.ok(massage).build();
	}

	/**
	 * GETs all massages of a give client
	 *
	 * @return all found massages
	 */
	@GET
	@Path("/client")
	@PermitAll
	@UnitOfWork
	public List<Massage> findAllByClient(@Auth User user) {
		return massageDao.findAllByClient(user.getSubject());
	}
}