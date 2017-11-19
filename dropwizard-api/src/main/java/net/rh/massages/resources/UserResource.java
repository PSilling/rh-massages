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
import javax.annotation.security.RolesAllowed;
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

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;
import io.dropwizard.jersey.params.LongParam;
import net.rh.massages.core.Massage;
import net.rh.massages.core.User;
import net.rh.massages.db.MassageDAO;
import net.rh.massages.db.UserDAO;

/**
 * UserResource User resource class
 *
 * @author psilling
 * @since 1.0.0
 *
 */

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

	private final MassageDAO massageDao; // massage data access object
	private final UserDAO userDao; // user data access object

	/**
	 * Parameterized UserResource constructor
	 *
	 * @param massageDao new UserResource massageDao
	 * @param userDao new UserResource userDao
	 */
	public UserResource(MassageDAO massageDao, UserDAO userDao) {
		this.massageDao = massageDao;
		this.userDao = userDao;
	}

	/**
	 * GETs all users that can be found
	 *
	 * @return list of all users
	 */
	@GET
	@RolesAllowed("admin")
	@UnitOfWork
	public List<User> fetch(@Auth User user) {
		return userDao.findAll();
	}

	/**
	 * Accepts POST request with a new User
	 *
	 * @param user new User
	 * @exception WebApplicationException if user could not be found after creation
	 * @return on creation response
	 */
	@POST
	@RolesAllowed("admin")
	@UnitOfWork
	public Response createUser(@NotNull @Valid User user, @Auth User authUser) {
		userDao.create(user);

		if (userDao.findById(user.getId()) == null) {
			throw new WebApplicationException(Status.INTERNAL_SERVER_ERROR);
		}

		return Response.created(UriBuilder.fromResource(UserResource.class).path("/{id}").build(user.getId()))
				.entity(user).build();
	}

	/**
	 * GETs a user based on id
	 *
	 * @param id user id
	 * @exception WebApplicationException if the id could not be found
	 * @return the desired user
	 */
	@GET
	@Path("/{id}")
	@RolesAllowed("admin")
	@UnitOfWork
	public User findById(@PathParam("id") LongParam id, @Auth User user) {
		if (userDao.findById(id.get()) == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}

		return userDao.findById(id.get());
	}

	/**
	 * DELETEs a user given by id
	 *
	 * @param id user id
	 * @exception WebApplicationException if the id could not be found
	 * @return on delete response
	 */
	@DELETE
	@Path("/{id}")
	@RolesAllowed("admin")
	@UnitOfWork
	public Response delete(@PathParam("id") LongParam id, @Auth User user) {
		if (userDao.findById(id.get()) == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}

		userDao.delete(userDao.findById(id.get()));

		return Response.noContent().build();
	}

	/**
	 * Updates a user given by id to a given value
	 *
	 * @param user updated user
	 * @param id user id
	 * @exception WebApplicationException if the id could not be found
	 * @return on update response
	 */
	@PUT
	@Path("/{id}")
	@RolesAllowed("admin")
	@UnitOfWork
	public Response update(@NotNull @Valid User user, @PathParam("id") LongParam id, @Auth User authUser) {
		if (userDao.findById(id.get()) == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}

		user.setId(id.get());
		userDao.update(user);

		return Response.ok(user).build();
	}

	/**
	 * GETs all massages of a user given by id
	 *
	 * @param id user id
	 * @exception WebApplicationException if the id could not be found
	 * @return list of the desired massages
	 */
	@GET
	@Path("/{id}/massages")
	@PermitAll
	@UnitOfWork
	public List<Massage> fetchMassages(@PathParam("id") LongParam id, @Auth User user) {
		if (userDao.findById(id.get()) == null) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}

		return massageDao.findAllByUser(userDao.findById(id.get()));
	}
}