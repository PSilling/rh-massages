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

package net.rh.massages.resources;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.oauth.OAuthCredentialAuthFilter;
import io.dropwizard.testing.junit.ResourceTestRule;
import java.util.ArrayList;
import java.util.List;
import javax.ws.rs.core.GenericType;
import net.rh.massages.auth.TestAuthenticator;
import net.rh.massages.auth.TestAuthorizer;
import net.rh.massages.auth.TestUser;
import net.rh.massages.auth.User;
import net.rh.massages.core.Client;
import net.rh.massages.db.ClientDao;
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
      new Client("Subject", "example@email.com", "FName", "SName", true); // test Client

  /**
   * Configures mocks before each test.
   */
  @Before
  public void setup() {
    List<Client> clients = new ArrayList<>();
    clients.add(client);

    when(clientDao.findAll()).thenReturn(clients);
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
    assertEquals(1, clients.size());
  }
}
