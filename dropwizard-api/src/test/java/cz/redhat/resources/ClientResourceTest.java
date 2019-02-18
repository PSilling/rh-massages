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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

import cz.redhat.auth.TestAuthenticator;
import cz.redhat.auth.TestAuthorizer;
import cz.redhat.auth.TestUser;
import cz.redhat.auth.User;
import cz.redhat.core.Client;
import cz.redhat.db.ClientDao;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.oauth.OAuthCredentialAuthFilter;
import io.dropwizard.testing.junit.ResourceTestRule;
import java.util.ArrayList;
import java.util.List;
import javax.ws.rs.core.GenericType;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.glassfish.jersey.test.grizzly.GrizzlyWebTestContainerFactory;
import org.junit.After;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;

/**
 * {@link ClientResource} JUnit resource test for /clients endpoint.
 *
 * @author psilling
 * @since 1.2.2
 */
public class ClientResourceTest {

  private static final ClientDao clientDao = mock(ClientDao.class); // mock of ClientDao
  /**
   * Creates a new static {@link ResourceTestRule} that tests a given resource. Uses {@link
   * GrizzlyWebTestContainerFactory} to deal with resource authentication.
   */
  @SuppressWarnings({"unchecked", "rawtypes"})
  @ClassRule
  public static final ResourceTestRule RULE =
      ResourceTestRule.builder()
          .setTestContainerFactory(new GrizzlyWebTestContainerFactory())
          .addProvider(
              new AuthDynamicFeature(
                  new OAuthCredentialAuthFilter.Builder<TestUser>()
                      .setAuthenticator(new TestAuthenticator())
                      .setAuthorizer(new TestAuthorizer())
                      .setRealm("SECRET")
                      .setPrefix("Bearer")
                      .buildAuthFilter()))
          .addProvider(RolesAllowedDynamicFeature.class)
          .addProvider(new AuthValueFactoryProvider.Binder<>(User.class))
          .addResource(new ClientResource(clientDao))
          .build();
  private final Client client =
      new Client("Subject1", "example1@email.com", "FName", "SName", false, true); // test Client
  private final Client masseur =
      new Client("Subject2", "example2@email.com", "Name", "Surname", true, false); // test masseur Client

  /**
   * Configures mocks before each test.
   */
  @Before
  public void setup() {
    List<Client> clients = new ArrayList<>();
    List<Client> masseurs = new ArrayList<>();
    List<Client> users = new ArrayList<>();
    clients.add(client);
    clients.add(masseur);
    masseurs.add(masseur);
    users.add(client);

    when(clientDao.findAll()).thenReturn(clients);
    when(clientDao.findAllMasseurs()).thenReturn(masseurs);
    when(clientDao.findAllNonMasseurs()).thenReturn(users);
  }

  /**
   * Resets mocks after each test.
   */
  @After
  public void tearDown() {
    reset(clientDao);
  }

  /**
   * Tests whether fetch request for all {@link Client}s works as intended.
   */
  @Test
  public void fetchTest() {
    List<Client> clients =
        RULE.target("/clients")
            .request()
            .header("Authorization", "Bearer TOKEN")
            .get(new GenericType<List<Client>>() {
            });

    assertNotNull(clients);
    assertEquals(2, clients.size());
  }

  /**
   * Tests whether fetch request for all masseur {@link Client}s works as intended.
   */
  @Test
  public void masseuseFetchTest() {
    List<Client> clients =
        RULE.target("/clients/masseuses")
            .request()
            .header("Authorization", "Bearer TOKEN")
            .get(new GenericType<List<Client>>() {
            });

    assertNotNull(clients);
    assertEquals(1, clients.size());
    assertEquals(clients.get(0), masseur);
  }

  /**
   * Tests whether fetch request for all non-masseur {@link Client}s works as intended.
   */
  @Test
  public void userFetchTest() {
    List<Client> clients =
        RULE.target("/clients/users")
            .request()
            .header("Authorization", "Bearer TOKEN")
            .get(new GenericType<List<Client>>() {
            });

    assertNotNull(clients);
    assertEquals(1, clients.size());
    assertEquals(clients.get(0), client);
  }
}
