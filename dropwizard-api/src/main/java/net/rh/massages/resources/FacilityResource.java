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

package net.rh.massages.resources;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;
import io.dropwizard.jersey.params.IntParam;
import io.dropwizard.jersey.params.LongParam;
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
import net.rh.massages.auth.User;
import net.rh.massages.core.Facility;
import net.rh.massages.core.Massage;
import net.rh.massages.db.ClientDao;
import net.rh.massages.db.FacilityDao;
import net.rh.massages.db.MassageDao;

/**
 * Facility resource class.
 *
 * @author psilling
 * @since 1.0.0
 */
@Path("/facilities")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FacilityResource {

  private final FacilityDao facilityDao; // Facility data access object
  private final MassageDao massageDao; // Massage data access object
  private final ClientDao clientDao; // Client data access object

  /**
   * Constructor.
   *
   * @param facilityDao {@link FacilityDao} to work with
   * @param massageDao  {@link MassageDao} to work with
   * @param clientDao   {@link ClientDao} to work with
   */
  public FacilityResource(FacilityDao facilityDao, MassageDao massageDao, ClientDao clientDao) {
    this.facilityDao = facilityDao;
    this.massageDao = massageDao;
    this.clientDao = clientDao;
  }

  /**
   * GETs all {@link Facility}s that can be found.
   *
   * @return {@link List} of all {@link Facility}s
   */
  @GET
  @PermitAll
  @UnitOfWork
  public List<Facility> fetch() {
    return facilityDao.findAll();
  }

  /**
   * Accepts POST request with a new {@link Facility}.
   *
   * @param facility new {@link Facility} to be created
   * @return on creation {@link Response}
   * @throws WebApplicationException if {@link Facility} could not be found after creation
   */
  @POST
  @RolesAllowed("admin")
  @UnitOfWork
  public Response createFacility(@NotNull @Valid Facility facility) {
    facilityDao.create(facility);

    if (facilityDao.findByName(facility.getName()) == null) {
      throw new WebApplicationException(Status.INTERNAL_SERVER_ERROR);
    }

    return Response.created(
        UriBuilder.fromResource(FacilityResource.class).path("/{id}").build(facility.getId()))
        .entity(facility)
        .build();
  }

  /**
   * GETs a {@link Facility} based on its ID.
   *
   * @param id {@link Facility} ID
   * @return the desired {@link Facility}
   * @throws WebApplicationException if the ID could not be found
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
   * Updates a {@link Facility} given by ID to a given value.
   *
   * @param facility an updated {@link Facility}
   * @param id       {@link Facility} ID
   * @return on update {@link Response}
   * @throws WebApplicationException if the ID could not be found
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
   * Deletes a {@link Facility} given by ID.
   *
   * @param id {@link Facility} ID
   * @return on delete {@link Response}
   * @throws WebApplicationException if the ID could not be found
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
   * GETs all {@link Massage}s of a {@link Facility} that haven't already passed based on {@link
   * Facility} ID and query parameters.
   *
   * @param id      {@link Facility} ID
   * @param search  value of the {@link String} to be searched for
   * @param free    whether only unassigned {@link Massage}s should be shown
   * @param from    limits results to be after the {@link Date} in milliseconds
   * @param to      limits results to be after the {@link Date} in milliseconds
   * @param page    current page number; for -1 doesn't use pagination
   * @param perPage number of {@link Massage}s to return per each page
   * @param user    authenticated {@link User}
   * @return {@link Map} with all found {@link Massage}s, their total count and total client massage
   *     time
   * @throws WebApplicationException if the ID could not be found
   */
  @GET
  @Path("/{id}/massages")
  @PermitAll
  @UnitOfWork
  public Map<String, Object> getMassages(
      @PathParam("id") LongParam id,
      @QueryParam("search") String search,
      @QueryParam("free") boolean free,
      @Min(-1) @DefaultValue("-1") @QueryParam("from") LongParam from,
      @Min(-1) @DefaultValue("-1") @QueryParam("to") LongParam to,
      @Min(0) @DefaultValue("0") @QueryParam("page") IntParam page,
      @Min(1) @DefaultValue("12") @QueryParam("perPage") IntParam perPage,
      @Auth User user) {

    if (facilityDao.findById(id.get()) == null) {
      throw new WebApplicationException(Status.NOT_FOUND);
    }

    // Dates default to null if -1 is supplied.
    Date fromDate = null;
    Date toDate = null;
    if (from.get() != -1) {
      fromDate = new Date(from.get());
    }
    if (to.get() != -1) {
      toDate = new Date(to.get());
    }

    // Add Massages and their total count to the response map.
    Map<String, Object> response =
        massageDao.searchNewByFacility(
            facilityDao.findById(id.get()),
            search,
            free,
            fromDate,
            toDate,
            page.get(),
            perPage.get());

    // Add total massage time to the response.
    long massageTime = 0;
    List<Massage> daoMassagesClient =
        massageDao.findAllByClient(clientDao.findBySub(user.getSubject()));
    for (Massage clientMassage : daoMassagesClient) {
      massageTime += clientMassage.calculateDuration();
    }
    response.put("clientTime", massageTime);

    return response;
  }
}
