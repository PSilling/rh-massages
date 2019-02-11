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

package cz.redhat.db;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

import cz.redhat.core.Client;
import io.dropwizard.testing.junit.DAOTestRule;
import java.util.List;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;

/**
 * Client Data Access Object JUnit test class.
 *
 * @author psilling
 * @since 1.2.1
 */
public class ClientDaoTest {

  @Rule
  public DAOTestRule daoTestRule =
      DAOTestRule.newBuilder().addEntityClass(Client.class).build(); // database mock

  private ClientDao clientDao; // Client data access object

  /**
   * Creates {@link ClientDao} with test database session.
   */
  @Before
  public void setUp() {
    clientDao = new ClientDao(daoTestRule.getSessionFactory());
  }

  /**
   * Tests whether {@link Client} creation works as intended.
   */
  @Test
  public void testCreate() {
    final Client client = new Client("Subject", "example@email.com", "FName", "SName", false, true);
    final Client createdClient = daoTestRule.inTransaction(() -> clientDao.create(client));

    assertEquals(client, createdClient);
  }

  /**
   * Tests whether {@link Client} updating works as intended.
   */
  @Test
  public void testUpdate() {
    final Client client = new Client("Subject", "example@email.com", "FName", "SName", true, true);
    final Client updatedClient =
        daoTestRule.inTransaction(
            () -> {
              clientDao.create(client);
              client.setSub("Updated Subject");
              client.setEmail("new@email.com");
              client.setName("Updated FName");
              client.setSurname("Updated SName");
              client.setMasseur(false);
              client.setSubscribed(false);
              return clientDao.update(client);
            });

    assertEquals("Updated Subject", updatedClient.getSub());
    assertEquals("new@email.com", updatedClient.getEmail());
    assertEquals("Updated FName", updatedClient.getName());
    assertEquals("Updated SName", updatedClient.getSurname());
    assertFalse(updatedClient.isMasseur());
    assertFalse(updatedClient.isSubscribed());
    assertEquals(client, updatedClient);
  }

  /**
   * Tests whether {@link Client} removal works as intended.
   */
  @Test
  public void testDelete() {
    final Client client = new Client("Subject", "example@email.com", "FName", "SName", false, true);
    Client removedClient =
        daoTestRule.inTransaction(
            () -> {
              Client deletedClient = clientDao.create(client);
              clientDao.delete(client);
              return deletedClient;
            });

    List<Client> clients = clientDao.findAll();

    assertNotNull(removedClient);
    assertFalse(clients.contains(client));
  }

  /**
   * Tests whether all {@link ClientDao} finding methods are working as intended.
   */
  @Test
  public void testFind() {
    final Client client1 = new Client("Subject", "example@email.com", "FName", "SName", true, true);
    final Client client2 = new Client("Sub", "another@email.com", "Name", "Surname", false, false);
    daoTestRule.inTransaction(
        () -> {
          clientDao.create(client1);
          clientDao.create(client2);
        });

    Client clientBySub = clientDao.findBySub("Subject");
    List<Client> masseurs = clientDao.findAllMasseurs();
    List<Client> subscribedClients = clientDao.findAllSubscribed();
    List<Client> clients = clientDao.findAll();

    assertEquals(client1, clientBySub);
    assertEquals(1, masseurs.size());
    assertEquals(1, subscribedClients.size());
    assertEquals(masseurs.get(0), subscribedClients.get(0));
    assertEquals(2, clients.size());
  }
}
