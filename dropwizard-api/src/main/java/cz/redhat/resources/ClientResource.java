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

package cz.redhat.resources;

import cz.redhat.auth.User;
import cz.redhat.core.Client;
import cz.redhat.db.ClientDao;
import cz.redhat.websockets.OperationType;
import cz.redhat.websockets.WebSocketResource;
import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;
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

/**
 * Client resource class.
 *
 * @author psilling
 * @since 1.2.1
 */
@Path("/clients")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClientResource {

  private final ClientDao clientDao; // Client data access object

  /**
   * Constructor.
   *
   * @param clientDao {@link ClientDao} to work with
   */
  public ClientResource(ClientDao clientDao) {
    this.clientDao = clientDao;
  }

  /**
   * GETs all {@link Client}s that can be found.
   *
   * @return {@link List} of all {@link Client}s
   */
  @GET
  @RolesAllowed("admin")
  @UnitOfWork
  public List<Client> fetch() {
    return clientDao.findAll();
  }

  /**
   * GETs all {@link Client}s that are registered as masseurs.
   *
   * @return {@link List} of all masseur {@link Client}s
   */
  @GET
  @Path("/masseuses")
  @PermitAll
  @UnitOfWork
  public List<Client> getMasseurs() {
    return clientDao.findAllMasseurs();
  }

  /**
   * GETs all {@link Client}s that are registered as normal users (non-masseurs).
   *
   * @return {@link List} of all non-masseur {@link Client}s
   */
  @GET
  @Path("/users")
  @PermitAll
  @UnitOfWork
  public List<Client> getNonMasseurs() {
    return clientDao.findAllNonMasseurs();
  }

  /**
   * Updates a {@link Client} to an updated value.
   *
   * @param client updated {@link Client}
   * @param user   authenticated {@link User}
   * @return on update {@link Response}
   * @throws WebApplicationException if the {@link Client} could not be found or {@link User}
   *                                 tries to change other {@link Client}s without administrator
   *                                 rights
   */
  @PUT
  @PermitAll
  @UnitOfWork
  public Response update(@NotNull @Valid Client client, @Auth User user) {
    if (client.getSub() == null) {
      client.setSub(user.getSubject());
    }

    Client daoClient = clientDao.findBySub(client.getSub());

    if (!user.isAdmin() && !user.getSubject().equals(client.getSub())) {
      throw new WebApplicationException(Status.FORBIDDEN);
    }

    if (daoClient == null) {
      throw new WebApplicationException(Status.NOT_FOUND);
    }

    if (!user.isAdmin()) {
      client.setMasseur(user.isMasseur());
    }

    // Update only if a change is detected.
    if (!daoClient.equals(client)) {
      clientDao.update(client);
      WebSocketResource.informSubscribed("Client", OperationType.CHANGE, client);
      return Response.ok(client).build();
    } else {
      return Response.noContent().build();
    }
  }

  /**
   * GETs local information of a {@link Client} (currently only his subscription value). For new
   * {@link User}s creates their {@link Client} representation while returning {@link User}s get
   * their {@link Client} representation updated if a change is detected.
   *
   * @param user authenticated {@link User}
   * @return true if subscribed, false otherwise
   * @throws WebApplicationException if the {@link Client} could not be found after creation
   */
  @GET
  @Path("/retrieve-info")
  @PermitAll
  @UnitOfWork
  public boolean retrieveInfo(@Auth User user) {
    Client daoClient = clientDao.findBySub(user.getSubject());
    Client client =
        new Client(user.getSubject(), user.getEmail(), user.getFirstName(), user.getSurname(),
            user.isMasseur(), daoClient == null || daoClient.isSubscribed());

    // Create a new Client the User doesn't have its Client representation instance.
    if (daoClient == null) {
      clientDao.create(client);

      if (clientDao.findBySub(user.getSubject()) == null) {
        throw new WebApplicationException(Status.INTERNAL_SERVER_ERROR);
      }
    } else if (!daoClient.equals(client)) {
      clientDao.update(client);
    }

    return client.isSubscribed();
  }
}
