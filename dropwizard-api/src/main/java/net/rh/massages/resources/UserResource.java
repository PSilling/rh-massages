package net.rh.massages.resources;

import io.dropwizard.hibernate.UnitOfWork;
import io.dropwizard.jersey.params.LongParam;

import java.util.List;

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

import com.codahale.metrics.annotation.ExceptionMetered;
import com.codahale.metrics.annotation.Timed;

import net.rh.massages.core.Massage;
import net.rh.massages.core.User;
import net.rh.massages.db.MassageDAO;
import net.rh.massages.db.UserDAO;
import net.rh.massages.db.MassageDAO;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

  private final MassageDAO massageDao;
  private final UserDAO userDao;

  public UserResource(MassageDAO massageDao, UserDAO userDao) {
      this.massageDao = massageDao;
      this.userDao = userDao;
  }
  
  @GET
  @UnitOfWork
  public List<User> fetch() {
    return userDao.findAll();
  }
  
  @POST
  @ExceptionMetered
  @UnitOfWork
  public Response createUser(@NotNull @Valid User user) {
    userDao.create(user);
    
    if (userDao.findById(user.getId()) == null)
    	throw new WebApplicationException(Status.INTERNAL_SERVER_ERROR);
    
    return Response.created(UriBuilder.fromResource(UserResource.class).path("/{id}")
    		.build(user.getId())).entity(user).build();
  }

  @GET
  @ExceptionMetered
  @Path("/{id}")
  @UnitOfWork
  public User findById(@PathParam("id") LongParam id) {
	if (userDao.findById(id.get()) == null)
		throw new WebApplicationException(Status.NOT_FOUND);
		
    return userDao.findById(id.get());
  }

  @DELETE
  @ExceptionMetered
  @Path("/{id}")
  @UnitOfWork
  public Response delete(@PathParam("id") LongParam id) {
	if (userDao.findById(id.get()) == null)
		throw new WebApplicationException(Status.NOT_FOUND);
	  
    userDao.delete(userDao.findById(id.get()));
    
    return Response.noContent().build();
  }

  @PUT
  @ExceptionMetered
  @Path("/{id}")
  @UnitOfWork
  public Response update(@NotNull @Valid User user, @PathParam("id") LongParam id) {
	if (userDao.findById(id.get()) == null)
		throw new WebApplicationException(Status.NOT_FOUND);
	
	user.setId(id.get());
    userDao.update(user);
    
    return Response.ok(user).build();
  }

  @GET
  @ExceptionMetered
  @Path("/{id}/massages")
  @UnitOfWork
  public List<Massage> fetchMassages(@PathParam("id") LongParam id) {
	if (userDao.findById(id.get()) == null)
		throw new WebApplicationException(Status.NOT_FOUND);
	
	return massageDao.findByUser(userDao.findById(id.get()));
  }
}