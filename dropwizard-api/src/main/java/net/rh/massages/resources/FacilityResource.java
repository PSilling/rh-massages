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

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriBuilder;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;
import io.dropwizard.jersey.params.IntParam;
import io.dropwizard.jersey.params.LongParam;
import net.rh.massages.auth.User;
import net.rh.massages.core.Facility;
import net.rh.massages.core.Massage;
import net.rh.massages.db.ClientDAO;
import net.rh.massages.db.FacilityDAO;
import net.rh.massages.db.MassageDAO;

/**
 * FacilityResource Facility resource class
 *
 * @author psilling
 * @since 1.0.0
 */

@Path("/facilities")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FacilityResource {

	private final FacilityDAO facilityDao; // Facility data access object
	private final MassageDAO massageDao; // Massage data access object
	private final ClientDAO clientDao; // Client data access object

	/**
	 * @param facilityDao new FacilityResource facilityDao
	 * @param massageDao new FacilityResource massageDao
	 * @param clientDao new MassageResource clientDao
	 */
	public FacilityResource(FacilityDAO facilityDao, MassageDAO massageDao, ClientDAO clientDao) {
		this.facilityDao = facilityDao;
		this.massageDao = massageDao;
		this.clientDao = clientDao;
	}

	/**
	 * GETs all Facilities that can be found
	 *
	 * @return list of all Facilities
	 */
	@GET
	@PermitAll
	@UnitOfWork
	public List<Facility> fetch() {
		return facilityDao.findAll();
	}

	/**
	 * Accepts POST request with a new Facility
	 *
	 * @param facility Facility new Facility
	 * @exception WebApplicationException if Facility could not be found after
	 *                creation
	 * @return on creation response
	 */
	@POST
	@RolesAllowed("admin")
	@UnitOfWork
	public Response createFacility(@NotNull @Valid Facility facility) {
		facilityDao.create(facility);

		if (facilityDao.findByName(facility.getName()) == null) {
			throw new WebApplicationException(Status.INTERNAL_SERVER_ERROR);
		}

		return Response.created(UriBuilder.fromResource(FacilityResource.class).path("/{id}").build(facility.getId()))
				.entity(facility).build();
	}

	/**
	 * GETs a Facility based on its id
	 *
	 * @param id Facility ID
	 * @exception WebApplicationException if the ID could not be found
	 * @return the desired Facility
	 */
	@GET
	@Path("/{id}")
	@PermitAll
	@UnitOfWork
	public Facility getById(@PathParam("id") LongParam id) {
		if (facilityDao.findById(id.get()) == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}

		return facilityDao.findById(id.get());
	}

	/**
	 * Updates a Facility given by ID to a given value
	 *
	 * @param facility Facility updated Facility
	 * @param id Facility ID
	 * @exception WebApplicationException if the ID could not be found
	 * @return on update response
	 */
	@PUT
	@Path("/{id}")
	@RolesAllowed("admin")
	@UnitOfWork
	public Response update(@NotNull @Valid Facility facility, @PathParam("id") LongParam id) {
		if (facilityDao.findById(id.get()) == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}

		facility.setId(id.get());
		facilityDao.update(facility);

		return Response.ok(facility).build();
	}

	/**
	 * DELETEs a Facility given by ID
	 *
	 * @param id Facility ID
	 * @exception WebApplicationException if the ID could not be found
	 * @return on delete response
	 */
	@DELETE
	@Path("/{id}")
	@RolesAllowed("admin")
	@UnitOfWork
	public Response delete(@PathParam("id") LongParam id) {
		if (facilityDao.findById(id.get()) == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}

		facilityDao.delete(facilityDao.findById(id.get()));

		return Response.noContent().build();
	}

	/**
	 * GETs all Massages of a Facility that haven't already passed based on its ID.
	 *
	 * @param id facility id
	 * @param search value of the text to be searched for
	 * @param free whether only unassigned Massages should be shown
	 * @param from limits results to be after the Date in milliseconds
	 * @param to limits results to be after the Date in milliseconds
	 * @param page current page number; for -1 doesn't use pagination
	 * @param perPage number of Massages to return per each page
	 * @exception WebApplicationException if the id could not be found
	 * @return list of all found massages
	 */
	@GET
	@Path("/{id}/massages")
	@PermitAll
	@UnitOfWork
	public Map<String, Object> getMassages(@PathParam("id") LongParam id, @QueryParam("search") String search,
			@QueryParam("free") boolean free, @Min(-1) @DefaultValue("-1") @QueryParam("from") LongParam from,
			@Min(-1) @DefaultValue("-1") @QueryParam("to") LongParam to,
			@Min(0) @DefaultValue("0") @QueryParam("page") IntParam page,
			@Min(1) @DefaultValue("12") @QueryParam("perPage") IntParam perPage, @Auth User user) {
		Map<String, Object> response;
		if (facilityDao.findById(id.get()) == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}

		// Dates default to null if -1 is supplied
		Date fromDate = null;
		Date toDate = null;
		if (from.get() != -1) {
			fromDate = new Date(from.get());
		}
		if (to.get() != -1) {
			toDate = new Date(to.get());
		}

		response = massageDao.searchNewByFacility(facilityDao.findById(id.get()), search, free, fromDate, toDate,
				page.get(), perPage.get());

		long massageTime = 0;
		List<Massage> daoMassagesClient = massageDao.findAllByClient(clientDao.findBySub(user.getSubject()));
		for (Massage clientMassage : daoMassagesClient) {
			massageTime += clientMassage.calculateDuration();
		}
		response.put("clientTime", massageTime);

		return response;
	}
}