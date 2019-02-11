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
import cz.redhat.core.Facility;
import cz.redhat.core.Massage;
import cz.redhat.db.MassageDao;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.oauth.OAuthCredentialAuthFilter;
import io.dropwizard.testing.junit.ResourceTestRule;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.ws.rs.core.GenericType;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.glassfish.jersey.test.grizzly.GrizzlyWebTestContainerFactory;
import org.junit.After;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;

/**
 * {@link MassageResource} JUnit resource test for /massages endpoint.
 *
 * @author psilling
 * @since 1.0.0
 */
public class MassageResourceTest {

  private static final MassageDao massageDao = mock(MassageDao.class); // mock of MassageDao
  /**
   * Creates a new static {@link ResourceTestRule} that tests a given resource. Uses {@link
   * GrizzlyWebTestContainerFactory} to deal with resource authentication.
   */
  @SuppressWarnings({"rawtypes", "unchecked"})
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
          .addResource(new MassageResource(massageDao, null, null))
          .build();
  private final long milliseconds = new Date().getTime(); // current time milliseconds
  private final Facility facility = new Facility("Facility"); // test Facility
  private final Client masseuse =
      new Client("Subject", "example@email.com", "FName",
          "SName", true, true); // test masseuse Client
  private final Massage massage =
      new Massage(new Date(0), new Date(1), masseuse, null, facility); // test
  // Massage
  private final Massage newMassage =
      new Massage(
          new Date(milliseconds + 10000),
          new Date(milliseconds + 10001),
          masseuse,
          null,
          facility); // test Massage for creation and updating

  /**
   * Configures mocks before each test.
   */
  @Before
  public void setup() {
    List<Massage> massages = new ArrayList<>();
    massages.add(massage);

    when(massageDao.findAll()).thenReturn(massages);
    when(massageDao.findById((long) 1)).thenReturn(massage);
    when(massageDao.findById((long) 0)).thenReturn(newMassage);
    when(massageDao.findById((long) 2)).thenReturn(newMassage);
  }

  /**
   * Resets mocks after each test.
   */
  @After
  public void tearDown() {
    reset(massageDao);
  }

  /**
   * Fetches all {@link Massage}s.
   *
   * @return {@link List} of all current {@link Massage}s
   */
  private List<Massage> fetchAll() {
    return RULE.target("/massages")
        .request()
        .header("Authorization", "Bearer TOKEN")
        .get(new GenericType<List<Massage>>() {
        });
  }

  /**
   * Tests whether fetch request for all {@link Massage}s works as intended.
   */
  @Test
  public void fetchTest() {
    List<Massage> massages = fetchAll();

    assertNotNull(massages);
    assertEquals(1, massages.size());
    assertEquals(massage, massages.get(0));
  }

  /**
   * Test whether fetch request for a given {@link Massage} works as intended.
   */
  @Test
  public void getByIdTest() {
    Massage massage =
        RULE.target("/massages/1")
            .request()
            .header("Authorization", "Bearer TOKEN")
            .get(Massage.class);

    assertNotNull(massage);
    assertEquals(this.massage, massage);
  }
}
