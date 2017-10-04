package net.rh.massages.resources;

import io.dropwizard.hibernate.UnitOfWork;
import io.dropwizard.jersey.params.LongParam;

import java.util.List;

import com.codahale.metrics.annotation.ExceptionMetered;
import com.codahale.metrics.annotation.Timed;
import javax.inject.Inject;
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
import javax.ws.rs.core.UriBuilder;
import javax.ws.rs.core.Response.Status;

import net.rh.massages.core.Massage;
import net.rh.massages.db.MassageDAO;
import net.rh.massages.db.FacilityDAO;

@Path("/massages")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MassageResource {
  
  private final MassageDAO massageDao;

  public MassageResource(MassageDAO massageDao) {
      this.massageDao = massageDao;
  }
  
  @GET
  @UnitOfWork
  public List<Massage> fetch() {
	return massageDao.findAll();
  }
  
  @POST
  @ExceptionMetered
  @UnitOfWork
  public Response createMassage(@NotNull @Valid Massage massage) {
    massageDao.create(massage);
    
    if (massageDao.findById(massage.getId()) == null)
    	throw new WebApplicationException(Status.INTERNAL_SERVER_ERROR);
    
    return Response.created(UriBuilder.fromResource(MassageResource.class).path("/{id}")
    		.build(massage.getId())).entity(massage).build();
  }

  @GET
  @ExceptionMetered
  @Path("/{id}")
  @UnitOfWork
  public Massage findById(@PathParam("id") LongParam id) {
	if (massageDao.findById(id.get()) == null)
		throw new WebApplicationException(Status.NOT_FOUND);

    return massageDao.findById(id.get());
  }

  @DELETE
  @ExceptionMetered
  @Path("/{id}")
  @UnitOfWork
  public Response delete(@PathParam("id") LongParam id) {
	if (massageDao.findById(id.get()) == null)
		throw new WebApplicationException(Status.NOT_FOUND);
	
    massageDao.delete(massageDao.findById(id.get()));
    
    return Response.noContent().build();
  }

  @PUT
  @ExceptionMetered
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
