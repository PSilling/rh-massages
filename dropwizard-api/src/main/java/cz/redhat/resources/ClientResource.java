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
import cz.redhat.configuration.MailClient;
import cz.redhat.core.Client;
import cz.redhat.core.Massage;
import cz.redhat.db.ClientDao;
import cz.redhat.db.MassageDao;
import cz.redhat.websockets.OperationType;
import cz.redhat.websockets.WebSocketResource;
import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
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

  private final MassageDao massageDao; // Massage data access object
  private final ClientDao clientDao; // Client data access object
  private final MailClient mailClient; // Mailing client

  /**
   * Constructor.
   *
   * @param massageDao {@link MassageDao} to work with
   * @param clientDao  {@link ClientDao} to work with
   * @param mailClient {@link MailClient} to use for messaging
   */
  public ClientResource(MassageDao massageDao, ClientDao clientDao, MailClient mailClient) {
    this.massageDao = massageDao;
    this.clientDao = clientDao;
    this.mailClient = mailClient;
  }

  /**
   * GETs all {@link Client}s that can be found.
   *
   * @return {@link List} of all {@link Client}s
   */
  @GET
  @PermitAll
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
   * Deletes a {@link Client} given by the subject. All massages assigned to that client are freed
   * before the deletion or, if the client is a masseur, those massages are automatically removed.
   *
   * @param sub {@link Client} subject
   * @return on delete {@link Response}
   * @throws WebApplicationException if the subject could not be found
   */
  @DELETE
  @Path("/{sub}")
  @RolesAllowed("admin")
  @UnitOfWork
  public Response delete(@PathParam("sub") String sub) {
    Client daoClient = clientDao.findBySub(sub);

    if (daoClient == null) {
      throw new WebApplicationException(Status.NOT_FOUND);
    }

    List<Massage> clientMassages;
    if (daoClient.isMasseur()) {
      clientMassages = massageDao.findAllByMasseuse(daoClient);
      for (Massage daoMassage : clientMassages) {

        Client emailingClient = daoMassage.getEmailingClient(null);

        massageDao.delete(daoMassage);
        WebSocketResource.informSubscribed("Massage", OperationType.REMOVE, daoMassage);

        // Send an e-mail to subscribed Users if they are set as Clients of the removed Massages.
        if (emailingClient != null) {
          Map<String, String> arguments = new HashMap<>();
          arguments.put("MASSAGE", daoMassage.getEmailRepresentation());
          mailClient.sendEmail(
              emailingClient.getEmail(), "Massage Cancelled", "massageRemoved.html", arguments
          );
        }
      }
    } else {
      clientMassages = massageDao.findAllByClient(daoClient);
      massageDao.clearClient(clientMassages);
    }

    clientDao.delete(daoClient);
    WebSocketResource.informSubscribed("Client", OperationType.REMOVE, daoClient);

    // Send an e-mail to the removed User. This e-mail will be sent regardless of subscription.
    mailClient.sendEmail(
        daoClient.getEmail(), "Account Removed", "accountRemoved.html", null
    );

    return Response.noContent().build();
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

      WebSocketResource.informSubscribed("Client", OperationType.ADD, client);

      if (clientDao.findBySub(user.getSubject()) == null) {
        throw new WebApplicationException(Status.INTERNAL_SERVER_ERROR);
      }
    } else if (!daoClient.equals(client)) {
      clientDao.update(client);
      WebSocketResource.informSubscribed("Client", OperationType.CHANGE, client);
    }

    return client.isSubscribed();
  }
}
