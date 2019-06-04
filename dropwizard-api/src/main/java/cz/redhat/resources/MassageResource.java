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
import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;
import io.dropwizard.jersey.params.IntParam;
import io.dropwizard.jersey.params.LongParam;
import java.util.Date;
import java.util.LinkedList;
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

/**
 * Massage resource class.
 *
 * @author psilling
 * @since 1.0.0
 */
@Path("/massages")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MassageResource {

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
  public MassageResource(MassageDao massageDao, ClientDao clientDao, MailClient mailClient) {
    this.massageDao = massageDao;
    this.clientDao = clientDao;
    this.mailClient = mailClient;
  }

  /**
   * GETs all {@link Massage}s that can be found.
   *
   * @return {@link List} of all found {@link Massage}s
   */
  @GET
  @PermitAll
  @UnitOfWork
  public List<Massage> fetch() {
    return massageDao.findAll();
  }

  /**
   * Accepts POST request with a new {@link List} of {@link Massage}s.
   *
   * @param massages {@link List} of {@link Massage}s to create
   * @return on creation OK {@link Response}
   * @throws WebApplicationException if {@link Massage} could not be found after creation or its
   *                                 ending is before now or when massage time collides with other
   *                                 {@link Massage}s with the same masseuse or when masseurs try
   *                                 to create other than their {@link Massage}s
   */
  @POST
  @RolesAllowed({"admin", "masseur"})
  @UnitOfWork
  public Response createMassage(@NotNull @Valid List<Massage> massages, @Auth User user) {
    // Validate Massage timing information.
    for (Massage massage : massages) {
      massage.checkDates();
      if (massage.getEnding().before(new Date())) {
        throw new WebApplicationException(Status.FORBIDDEN);
      }
    }

    // Create the given Massages.
    for (Massage massage : massages) {
      // Masseur can only create own massages.
      if (!user.isAdmin() && !user.getSubject().equals(massage.getMasseuse().getSub())) {
        throw new WebApplicationException(Status.FORBIDDEN);
      }

      // Check for Date collision for the given masseuse. Removes a colliding Massage
      // only if the Massage has no Client.
      List<Massage> daoMassages = massageDao.findAllByMasseuse(massage.getMasseuse());

      for (Massage daoMassage : daoMassages) {
        if (massage.datesCollide(daoMassage) && daoMassage.getClient() == null) {
          massageDao.delete(daoMassage);
        }
      }

      massageDao.create(massage);

      if (massageDao.findById(massage.getId()) == null) {
        throw new WebApplicationException(Status.INTERNAL_SERVER_ERROR);
      }
    }

    // Send an information email to subscribed Users if more than sendMailLimit
    // Massages get created
    // number of simultaneously created Massages necessary for sending an email
    int sendMailLimit = 5;
    if (massages.size() >= sendMailLimit) {
      sendInformationEmail();
    }

    return Response.ok(massages).build();
  }

  /**
   * Updates {@link Massage}s in a {@link List}. Supplying ID in {@link Massage}s is necessary.
   *
   * @param massages {@link List} of updated {@link Massage}s
   * @param user     authenticated {@link User}
   * @return on update OK {@link Response}
   * @throws WebApplicationException if any of the IDs could not be found or when normal {@link
   *                                 User} tries to change a {@link Massage} that isn't assigned to
   *                                 him, change the {@link Massage} itself or even too late or when
   *                                 its ending is before now or when massage time collides with
   *                                 other {@link Massage}s with the same masseuse
   */
  @PUT
  @PermitAll
  @UnitOfWork
  public Response update(@NotNull @Valid List<Massage> massages, @Auth User user) {
    Client daoClient = clientDao.findBySub(user.getSubject()); // Client representation of the User

    if (daoClient == null) {
      throw new WebApplicationException(Status.FORBIDDEN);
    }

    // Validate edited Massages and edit rights.
    for (Massage massage : massages) {
      Massage daoMassage = massageDao.findById(massage.getId());

      if (daoMassage == null) {
        throw new WebApplicationException(Status.NOT_FOUND);
      }

      validateMassageEditRights(user, daoClient, massage, daoMassage);

      // Validate Massage timing information.
      massage.checkDates();
      if (massage.getEnding().before(new Date())) {
        throw new WebApplicationException(Status.FORBIDDEN);
      }

      if (!user.isAdmin()) {
        checkTimeAvailability(massage, daoMassage);
      }
    }

    // Update the given Massages.
    for (Massage massage : massages) {
      Massage daoMassage = massageDao.findById(massage.getId());

      // Check for Date collision for the given masseuse. Removes a colliding Massage
      // only if the Massage has no Client.
      List<Massage> daoMassagesMasseuse = massageDao.findAllByMasseuse(massage.getMasseuse());
      List<Massage> massagesForRemoval = new LinkedList<>();

      // Remove the updated Massage from the List.
      daoMassagesMasseuse.remove(daoMassage);

      for (Massage masseuseMassage : daoMassagesMasseuse) {
        if (massage.datesCollide(masseuseMassage) && masseuseMassage.getClient() == null) {
          massagesForRemoval.add(masseuseMassage);
        }
      }

      massageDao.update(massage);

      // Remove the colliding Massages (after update to avoid session clearing).
      for (Massage massageForRemoval : massagesForRemoval) {
        massageDao.delete(massageForRemoval);
      }
    }

    return Response.ok(massages).build();
  }

  /**
   * Deletes {@link Massage}s given by their IDs.
   *
   * @param ids {@link List} of {@link Massage} IDs
   * @return on delete {@link Response}
   * @throws WebApplicationException if any of the IDs could not be found or when masseurs try
   *                                 to delete other than their {@link Massage}
   */
  @DELETE
  @RolesAllowed({"admin", "masseur"})
  @UnitOfWork
  public Response delete(@NotNull @QueryParam("ids") List<Long> ids, @Auth User user) {
    // Validate given Massage IDs.
    for (long id : ids) {
      if (massageDao.findById(id) == null) {
        throw new WebApplicationException(Status.NOT_FOUND);
      }
    }

    // Delete the given Massages.
    for (long id : ids) {
      Massage daoMassage = massageDao.findById(id);

      // Masseur can only delete own massages.
      if (!user.isAdmin() && !user.getSubject().equals(daoMassage.getMasseuse().getSub())) {
        throw new WebApplicationException(Status.FORBIDDEN);
      }

      // If a Massage with a subscribed Client is being deleted, send a notification email.
      if (daoMassage.getClient() != null && daoMassage.getClient().isSubscribed()) {
        mailClient.sendEmail(
            daoMassage.getClient().getEmail(), "Massage Cancelled", "assignedRemoved.html", null);
      }
      massageDao.delete(daoMassage);
    }

    return Response.noContent().build();
  }

  /**
   * GETs all {@link Massage}s that are dated after the current time.
   *
   * @param search  value of the {@link String} to be searched for
   * @param free    whether only unassigned {@link Massage}s should be shown
   * @param from    limits results to be after the {@link Date} in milliseconds
   * @param to      limits results to be after the {@link Date} in milliseconds
   * @param page    current page number; for -1 doesn't use pagination
   * @param perPage number of {@link Massage}s to return per each page
   * @return {@link Map} with all found {@link Massage}s and their total count
   */
  @GET
  @Path("/old")
  @PermitAll
  @UnitOfWork
  public Map<String, Object> fetchOld(
      @QueryParam("search") String search,
      @QueryParam("free") boolean free,
      @Min(-1) @DefaultValue("-1") @QueryParam("from") LongParam from,
      @Min(-1) @DefaultValue("-1") @QueryParam("to") LongParam to,
      @Min(0) @DefaultValue("0") @QueryParam("page") IntParam page,
      @Min(1) @DefaultValue("12") @QueryParam("perPage") IntParam perPage) {

    // Dates default to null if -1 is supplied.
    Date fromDate = null;
    Date toDate = null;
    if (from.get() != -1) {
      fromDate = new Date(from.get());
    }
    if (to.get() != -1) {
      toDate = new Date(to.get());
    }

    return massageDao.searchOld(search, free, fromDate, toDate, page.get(), perPage.get());
  }

  /**
   * GETs a {@link Massage} based on its ID.
   *
   * @param id {@link Massage} ID
   * @return the desired {@link Massage}
   * @throws WebApplicationException if the ID could not be found
   */
  @GET
  @Path("/{id}")
  @PermitAll
  @UnitOfWork
  public Massage findById(@PathParam("id") LongParam id) {
    if (massageDao.findById(id.get()) == null) {
      throw new WebApplicationException(Status.NOT_FOUND);
    }

    return massageDao.findById(id.get());
  }

  /**
   * GETs all {@link Massage}s of a given {@link Client} that haven't already passed.
   *
   * @param user authenticated {@link User}
   * @return {@link List} of all found {@link Massage}s
   */
  @GET
  @Path("/client")
  @PermitAll
  @UnitOfWork
  public List<Massage> findAllByClient(@Auth User user) {
    if (user.isMasseur()) {
      return massageDao.findNewByMasseuse(clientDao.findBySub(user.getSubject()));
    }
    return massageDao.findAllByClient(clientDao.findBySub(user.getSubject()));
  }

  /**
   * Checks whether a {@link User} has rights to edit the given {@link Massage}.
   *
   * @param user       {@link User} to check rights of
   * @param daoClient  {@link Client} representation of the given {@link User}
   * @param massage    {@link Massage} to check rights for
   * @param daoMassage unedited version of the {@link Massage}
   */
  private void validateMassageEditRights(
      User user, Client daoClient, Massage massage, Massage daoMassage) {
    // Forbid normal Users to edit anything other than the Client and even then the
    // Client has to be the User himself or a null when it was him. Normal User is
    // also forbidden to cancel a Massage after maxOffset. Masseurs have admin-like
    // edit privileges, unless they try to change the value of masseur.
    if (!user.isAdmin()) {
      // time limit for User Massage cancellation
      long maxOffset = 1810000;

      if (!user.isMasseur() || !user.getSubject().equals(massage.getMasseuse().getSub())
          || !user.getSubject().equals(daoMassage.getMasseuse().getSub())) {
        if (!daoMassage.equals(massage)
            || (!daoClient.equals(massage.getClient()) && !daoClient.equals(daoMassage.getClient()))
            || (massage.getClient() != null && !massage.getClient().equals(daoClient))
            || ((massage.getDate().before(new Date(new Date().getTime() + maxOffset)))
            && daoMassage.getClient() != null)) {
          throw new WebApplicationException(Status.FORBIDDEN);
        }
      }
    }

    if (daoMassage.getClient() != null
        && massage.getClient() == null
        && !user.getSubject().equals(daoMassage.getClient().getSub())
        && daoMassage.getClient().isSubscribed()) {
      mailClient.sendEmail(
          daoMassage.getClient().getEmail(), "Massage Cancelled", "assignedRemoved.html", null);
    }
  }

  /**
   * Checks whether the included {@link Client} has enough massage time left for assignment of the
   * given {@link Massage}.
   *
   * @param massage    {@link Massage} to get massage time from
   * @param daoMassage unedited version of the {@link Massage}
   */
  private void checkTimeAvailability(Massage massage, Massage daoMassage) {
    if (massage.getClient() != null) {
      long massageTime = massage.calculateDuration();
      List<Massage> daoMassagesClient = massageDao.findAllByClient(massage.getClient());

      daoMassagesClient.remove(daoMassage);

      for (Massage clientMassage : daoMassagesClient) {
        massageTime += clientMassage.calculateDuration();
      }

      // time limit for total User Massage time
      long massageLimit = 7202000;
      if (massageTime > massageLimit) {
        throw new WebApplicationException(Status.FORBIDDEN);
      }
    }
  }

  /**
   * Sends an email informing all subscribed users about new {@link Massage} availability.
   */
  private void sendInformationEmail() {
    String recipients = "";
    List<Client> clients = clientDao.findAllSubscribed();

    if (clients.isEmpty()) {
      return;
    }

    for (Client client : clients) {
      recipients = client.getEmail() + ",";
    }

    mailClient.sendEmail(recipients, "New Massages Available", "newMassages.html", null);
  }
}
