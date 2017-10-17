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

import io.dropwizard.hibernate.UnitOfWork;
import io.dropwizard.jersey.params.LongParam;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriBuilder;

import net.rh.massages.core.Massage;
import net.rh.massages.db.MassageDAO;

/**
 * MassageResource Massage resource class
 * 
 * @author psilling
 * @since 1.0.0
 *
 */

@Path("/massages")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MassageResource {

	private final MassageDAO massageDao; // massage data access object

	/**
	 * Parameterized MassageResource constructor
	 * 
	 * @param massageDao new MassageResource massageDao
	 */
	public MassageResource(MassageDAO massageDao) {
		this.massageDao = massageDao;
	}

	/**
	 * GETs all massages that can be found
	 * 
	 * @return list of all massages
	 */
	@GET
	@UnitOfWork
	public List<Massage> fetch() {
		return massageDao.findAll();
	}

	/**
	 * Accepts POST request with a new Massage
	 * 
	 * @param massage new Massage
	 * @exception WebApplicationException if massage could not be found after creation
	 * @return on creation response
	 */
	@POST
	@UnitOfWork
	public Response createMassage(@NotNull @Valid Massage massage) {
		massageDao.create(massage);

		if (massageDao.findById(massage.getId()) == null)
			throw new WebApplicationException(Status.INTERNAL_SERVER_ERROR);

		return Response.created(UriBuilder.fromResource(MassageResource.class).path("/{id}")
				.build(massage.getId())).entity(massage).build();
	}

	/**
	 * GETs a massage based on its id
	 * 
	 * @param id massage id
	 * @exception WebApplicationException if the id could not be found
	 * @return the desired massage
	 */
	@GET
	@Path("/{id}")
	@UnitOfWork
	public Massage findById(@PathParam("id") LongParam id) {
		if (massageDao.findById(id.get()) == null)
			throw new WebApplicationException(Status.NOT_FOUND);

		return massageDao.findById(id.get());
	}

	/**
	 * DELETEs a massage given by id
	 * 
	 * @param id massage id
	 * @exception WebApplicationException if the id could not be found
	 * @return on delete response
	 */
	@DELETE
	@Path("/{id}")
	@UnitOfWork
	public Response delete(@PathParam("id") LongParam id) {
		if (massageDao.findById(id.get()) == null)
			throw new WebApplicationException(Status.NOT_FOUND);

		massageDao.delete(massageDao.findById(id.get()));

		return Response.noContent().build();
	}

	/**
	 * Updates a massage given by id to a given value
	 * 
	 * @param massage updated massage
	 * @param id massage id
	 * @exception WebApplicationException if the id could not be found
	 * @return on update response
	 */
	@PUT
	@Path("/{id}")
	@UnitOfWork
	public Response update(@NotNull @Valid Massage massage, @PathParam("id") LongParam id) {
		if (massageDao.findById(id.get()) == null)
			throw new WebApplicationException(Status.NOT_FOUND);

		massage.setId(id.get());
		massageDao.update(massage);

		return Response.ok(massage).build();
	}
}
