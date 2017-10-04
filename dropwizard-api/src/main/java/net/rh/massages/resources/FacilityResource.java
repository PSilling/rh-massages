package net.rh.massages.resources;

import io.dropwizard.hibernate.UnitOfWork;
import io.dropwizard.jersey.params.LongParam;

import java.util.List;

import javax.annotation.security.PermitAll;
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

import com.codahale.metrics.annotation.ExceptionMetered;

import net.rh.massages.core.Facility;
import net.rh.massages.core.Massage;
import net.rh.massages.db.FacilityDAO;
import net.rh.massages.db.MassageDAO;

@Path("/facilities")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FacilityResource {

  private final FacilityDAO facilityDao;
  private final MassageDAO massageDao;

  public FacilityResource(FacilityDAO facilityDao, MassageDAO massageDao) {
      this.facilityDao = facilityDao;
      this.massageDao = massageDao;
  }
  
  @GET
  @UnitOfWork
  public List<Facility> fetch() {
    return facilityDao.findAll();
  }
  
  @POST
  @ExceptionMetered
  @UnitOfWork
  public Response createUser(@NotNull @Valid Facility facility) {
    facilityDao.create(facility);
    
    if (facilityDao.findByName(facility.getName()) == null)
    	throw new WebApplicationException(Status.INTERNAL_SERVER_ERROR);
    
    return Response.created(UriBuilder.fromResource(FacilityResource.class).path("/{id}")
    		.build(facility.getId())).entity(facility).build();
  }

  @GET
  @ExceptionMetered
  @Path("/{id}")
  @UnitOfWork
  public Facility getByName(@PathParam("id") LongParam id) {
	if (facilityDao.findById(id.get()) == null)
		throw new WebApplicationException(Status.NOT_FOUND);
	
    return facilityDao.findById(id.get());
  }

  @PUT
  @ExceptionMetered
  @Path("/{id}")
  @UnitOfWork
  public Response update(@NotNull @Valid Facility facility, @PathParam("id") LongParam id) {
	if (facilityDao.findById(id.get()) == null)
		throw new WebApplicationException(Status.NOT_FOUND);
	
	facility.setId(id.get());
    facilityDao.update(facility);
	
	return Response.ok(facility).build();
  }

  @DELETE
  @ExceptionMetered
  @Path("/{id}")
  @UnitOfWork
  public Response delete(@PathParam("id") LongParam id) {
	if (facilityDao.findById(id.get()) == null)
		throw new WebApplicationException(Status.NOT_FOUND);
	
	facilityDao.delete(facilityDao.findById(id.get()));
	
	return Response.noContent().build();
  }

  @GET
  @ExceptionMetered
  @Path("/{id}/massages")
  @UnitOfWork
  public List<Massage> getMassages(@PathParam("id") LongParam id) {
	if (facilityDao.findById(id.get()) == null)
		throw new WebApplicationException(Status.NOT_FOUND);
	
    return massageDao.findByFacility(facilityDao.findById(id.get()));
  }
}