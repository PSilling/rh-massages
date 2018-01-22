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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

import java.util.List;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;

import io.dropwizard.testing.junit.DAOTestRule;
import net.rh.massages.core.Client;

/**
 * Client Data Access Object JUnit test class.
 *
 * @author psilling
 * @since 1.2.1
 *
 */
public class ClientDAOTest {

	@Rule
	public DAOTestRule daoTestRule = DAOTestRule.newBuilder().addEntityClass(Client.class).build(); // database mock

	private ClientDAO clientDao; // Client data access object

	/**
	 * Creates {@link ClientDAO} with test database session.
	 */
	@Before
	public void setUp() {
		clientDao = new ClientDAO(daoTestRule.getSessionFactory());
	}

	/**
	 * Tests whether {@link Client} creation works as intended.
	 */
	@Test
	public void testCreate() {
		final Client client = new Client("Subject", "example@email.com", "FName", "SName", true);
		final Client createdClient = daoTestRule.inTransaction(() -> clientDao.create(client));

		assertEquals(client, createdClient);
	}

	/**
	 * Tests whether {@link Client} updating works as intended.
	 */
	@Test
	public void testUpdate() {
		final Client client = new Client("Subject", "example@email.com", "FName", "SName", true);
		final Client updatedClient = daoTestRule.inTransaction(() -> {
			clientDao.create(client);
			client.setSub("Updated Subject");
			client.setEmail("new@email.com");
			client.setName("Updated FName");
			client.setSurname("Updated SName");
			client.setSubscribed(false);
			return clientDao.update(client);
		});

		assertEquals("Updated Subject", updatedClient.getSub());
		assertEquals("new@email.com", updatedClient.getEmail());
		assertEquals("Updated FName", updatedClient.getName());
		assertEquals("Updated SName", updatedClient.getSurname());
		assertFalse(updatedClient.isSubscribed());
		assertEquals(client, updatedClient);
	}

	/**
	 * Tests whether {@link Client} removal works as intended.
	 */
	@Test
	public void testDelete() {
		final Client client = new Client("Subject", "example@email.com", "FName", "SName", true);
		Client removedClient = daoTestRule.inTransaction(() -> {
			Client deletedClient = clientDao.create(client);
			clientDao.delete(client);
			return deletedClient;
		});

		List<Client> clients = clientDao.findAll();

		assertNotNull(removedClient);
		assertFalse(clients.contains(client));
	}

	/**
	 * Tests whether all {@link ClientDAO} finding methods are working as intended.
	 */
	@Test
	public void testFind() {
		final Client client1 = new Client("Subject", "example@email.com", "FName", "SName", true);
		final Client client2 = new Client("Sub", "another@email.com", "Name", "Surname", false);
		daoTestRule.inTransaction(() -> {
			clientDao.create(client1);
			clientDao.create(client2);
		});

		Client clientBySub = clientDao.findBySub("Subject");
		List<Client> subscribedClients = clientDao.findAllSubscribed();
		List<Client> clients = clientDao.findAll();

		assertEquals(client1, clientBySub);
		assertEquals(1, subscribedClients.size());
		assertEquals(2, clients.size());
	}
}