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
import java.util.LinkedList;
import java.util.List;

import javax.annotation.security.PermitAll;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import io.dropwizard.auth.Auth;
import io.dropwizard.hibernate.UnitOfWork;
import net.rh.massages.auth.User;
import net.rh.massages.configuration.MailClient;
import net.rh.massages.core.Client;
import net.rh.massages.core.Massage;
import net.rh.massages.db.ClientDAO;
import net.rh.massages.db.MassageDAO;

/**
 * MassageAuthResource Massage resource class that groups methods using Auth
 * annotation to allow resource testing
 *
 * @author psilling
 * @since 1.0.0
 *
 */

@Path("/massages")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MassageAuthResource {

	private final MassageDAO massageDao; // Massage data access object
	private final ClientDAO clientDao; // Client data access object
	private final MailClient mailClient; // Mailing client
	private final long MAX_OFFSET = 1810000; // time limit for User Massage cancellation
	private final long MASSAGE_LIMIT = 7202000; // time limit for total User Massage time

	/**
	 * @param massageDao new MassageResource massageDao
	 * @param clientDao new MassageResource clientDao
	 * @param mailClient new MassageResource mailClient
	 */
	public MassageAuthResource(MassageDAO massageDao, ClientDAO clientDao, MailClient mailClient) {
		this.massageDao = massageDao;
		this.clientDao = clientDao;
		this.mailClient = mailClient;
	}

	/**
	 * Updates Massage in a list given by ids to a new value
	 *
	 * @param massages list of updated Massages
	 * @param ids set of Massage ids
	 * @exception WebApplicationException if the id could not be found or when
	 *                normal user tries to change a massage that isn't assigned to
	 *                him, change the massage itself or even too late or when its
	 *                ending is before now or when massage time collides with other
	 *                massages with the same massuese
	 * @return on update response of last updated Massage
	 */
	@PUT
	@PermitAll
	@UnitOfWork
	public Response update(@NotNull @Valid List<Massage> massages, @NotNull @QueryParam("ids") List<Integer> ids,
			@Auth User user) {
		Response response = null;
		boolean throwForbidden = false;
		boolean throwNotFound = false;
		Client daoClient = clientDao.findBySub(user.getSubject());

		if (daoClient == null) {
			throw new WebApplicationException(Status.FORBIDDEN);
		}

		for (int i = 0; i < ids.size(); i++) {
			Massage daoMassage = massageDao.findById(Long.valueOf(ids.get(i)));
			Massage massage = massages.get(i);

			if (daoMassage == null) {
				throwNotFound = true;
				continue;
			}

			massage.setId(Long.valueOf(ids.get(i)));

			if (!user.getRoles().contains("admin")) {
				// user is forbidden to edit anything other than the client and even then the
				// client has to be the user himself or a null
				if (!daoMassage.equals(massage)
						|| (!daoClient.equals(massage.getClient()) && !daoClient.equals(daoMassage.getClient()))
						|| (massage.getClient() != null && !massage.getClient().equals(daoClient))
						|| ((massage.getDate().before(new Date(new Date().getTime() + MAX_OFFSET)))
								&& daoMassage.getClient() != null)) {
					throwForbidden = true;
					continue;
				}
			} else if (daoMassage.getClient() != null && massage.getClient() == null
					&& !user.getSubject().equals(daoMassage.getClient().getSub())
					&& daoMassage.getClient().isSubscribed()) {
				mailClient.sendEmail(daoMassage.getClient().getEmail(), "Massage Cancelled", "assignedRemoved.html",
						null);
			}

			massage.checkDates();
			if (massage.getEnding().before(new Date())) {
				throwForbidden = true;
				continue;
			}

			// check whether the user still has massage time available for the given
			// Facility
			if (massage.getClient() != null) {
				long massageTime = massage.calculateDuration();
				List<Massage> daoMassagesClient = massageDao.findAllByClient(massage.getClient());

				if (daoMassagesClient.contains(daoMassage)) {
					daoMassagesClient.remove(daoMassage);
				}

				for (Massage clientMassage : daoMassagesClient) {
					massageTime += clientMassage.calculateDuration();
				}

				if (massageTime > MASSAGE_LIMIT) {
					throwForbidden = true;
					continue;
				}
			}

			// check for date collision for the given masseuse
			List<Massage> daoMassagesMasseuse = massageDao.findAllByMasseuse(massage.getMasseuse());
			List<Massage> massagesForRemoval = new LinkedList<>();

			// remove the updated Massage from list
			if (daoMassagesMasseuse.contains(daoMassage)) {
				daoMassagesMasseuse.remove(daoMassage);
			}

			for (Massage masseuseMassage : daoMassagesMasseuse) {
				if (massage.datesCollide(masseuseMassage)) {
					// queue and then remove all colliding Massages for removal if they all have no
					// client or cancel the request if a client is assigned to them
					if (masseuseMassage.getClient() == null) {
						massagesForRemoval.add(masseuseMassage);
					} else {
						response = Response.noContent().build();
						continue;
					}
				}
			}

			massageDao.update(massage);

			for (Massage massageForRemoval : massagesForRemoval) {
				massageDao.delete(massageForRemoval);
			}

			response = Response.ok(massage).build();
		}

		if (throwNotFound) {
			throw new WebApplicationException(Status.NOT_FOUND);
		}

		if (throwForbidden) {
			throw new WebApplicationException(Status.FORBIDDEN);
		}

		return response;
	}

	/**
	 * GETs all massages of a given Client that haven't already passed
	 *
	 * @return all found massages
	 */
	@GET
	@Path("/client")
	@PermitAll
	@UnitOfWork
	public List<Massage> findAllByClient(@Auth User user) {
		return massageDao.findAllByClient(clientDao.findBySub(user.getSubject()));
	}
}