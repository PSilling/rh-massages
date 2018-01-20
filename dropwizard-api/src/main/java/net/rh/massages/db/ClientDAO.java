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
package net.rh.massages.db;

import java.util.List;

import org.hibernate.SessionFactory;

import io.dropwizard.hibernate.AbstractDAO;
import net.rh.massages.core.Client;

/**
 * ClientDAO Client Data Access Object
 *
 * @author psilling
 * @since 1.2.1
 *
 */

public class ClientDAO extends AbstractDAO<Client> {

	/**
	 * @param sessionFactory new ClientDAO SessionFactory
	 */
	public ClientDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}

	/**
	 * Creates a new Session and adds a given Client to the database
	 *
	 * @param client Client to be created
	 * @return the created Client
	 */
	public Client create(Client client) {
		return persist(client);
	}

	/**
	 * Clears the current Session and then updates a given Client with a new Session
	 *
	 * @param client updated Client
	 * @return the updated Client
	 */
	public Client update(Client client) {
		currentSession().clear();
		return persist(client);
	}

	/**
	 * Creates a new Session that finds a Client in the database based on subject
	 *
	 * @param sub subject to be found
	 * @return the found Client
	 */
	public Client findBySub(String sub) {
		return get(sub);
	}

	/**
	 * Creates a new Session that finds all Clients in the database
	 *
	 * @return list of all Clients
	 */
	@SuppressWarnings("unchecked")
	public List<Client> findAll() {
		return list(namedQuery("Client.findAll"));
	}

	/**
	 * Creates a new Session that finds all subscribed Clients in the database based
	 *
	 * @return list of all found Clients
	 */
	@SuppressWarnings("unchecked")
	public List<Client> findAllSubscribed() {
		return list(namedQuery("Client.findAllSubscribed"));
	}

	/**
	 * Removes a given Client from the current Session
	 *
	 * @param client Client to be removed
	 */
	public void delete(Client client) {
		currentSession().delete(client);
	}
}
