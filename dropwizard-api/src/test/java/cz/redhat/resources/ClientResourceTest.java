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
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

import cz.redhat.auth.TestAuthenticator;
import cz.redhat.auth.TestAuthorizer;
import cz.redhat.auth.TestUser;
import cz.redhat.auth.User;
import cz.redhat.configuration.MailClient;
import cz.redhat.core.Client;
import cz.redhat.core.Facility;
import cz.redhat.core.Massage;
import cz.redhat.db.ClientDao;
import cz.redhat.db.FacilityDao;
import cz.redhat.db.MassageDao;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.oauth.OAuthCredentialAuthFilter;
import io.dropwizard.testing.junit.ResourceTestRule;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.glassfish.jersey.test.grizzly.GrizzlyWebTestContainerFactory;
import org.junit.After;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.mockito.stubbing.Answer;

/**
 * {@link ClientResource} JUnit resource test for /clients endpoint.
 *
 * @author psilling
 * @since 1.2.2
 */
public class ClientResourceTest {

  private static final FacilityDao facilityDao = mock(FacilityDao.class); // mock of FacilityDao
  private static final MassageDao massageDao = mock(MassageDao.class); // mock of MassageDao
  private static final ClientDao clientDao = mock(ClientDao.class); // mock of ClientDao
  private static final MailClient mailClient = mock(MailClient.class); // mock of MailClient

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
          .addResource(new MassageResource(facilityDao, massageDao, clientDao, mailClient))
          .addResource(new ClientResource(massageDao, clientDao, mailClient))
          .build();
  private final Facility facility = new Facility("Facility"); // test Facility
  private final Client client =
      new Client("Subject1", "example1@email.com", "FName", "SName", false, true); // test Client
  private final Client masseur = new Client(
      "Subject2", "example2@email.com", "Name", "Surname", true, true
  ); // test masseur Client
  private final Massage clientMassage =
      new Massage(new Date(0), new Date(1), masseur, client, facility); // Client test Massage
  private final Massage freeClientMassage =
      new Massage(new Date(0), new Date(1), masseur, null, facility); // freed Client test Massage
  private boolean massageRemoved = false; // true after a massage removal (concurrency protection)
  private int accountEmailSentTimes = 0;
  private int cancelEmailSentTimes = 0;

  /**
   * Configures mocks before each test.
   */
  @Before
  public void setup() {
    final List<Client> clients = new ArrayList<>();
    final List<Client> masseurs = new ArrayList<>();
    final List<Client> users = new ArrayList<>();
    final List<Massage> massages = new ArrayList<>();
    final Map<String, String> mailArguments = new HashMap<>();
    accountEmailSentTimes = 0;
    cancelEmailSentTimes = 0;

    clients.add(client);
    clients.add(masseur);
    masseurs.add(masseur);
    users.add(client);
    massages.add(clientMassage);
    mailArguments.put("MASSAGE", clientMassage.getEmailRepresentation());

    when(clientDao.findAll()).thenReturn(clients);
    when(clientDao.findAllMasseurs()).thenReturn(masseurs);
    when(clientDao.findAllNonMasseurs()).thenReturn(users);
    when(clientDao.findBySub("Subject1")).thenReturn(client);
    when(clientDao.findBySub("Subject2")).thenReturn(masseur);
    when(massageDao.findAll()).thenReturn(massages);
    when(massageDao.findAllByMasseuse(masseur)).thenReturn(massages);
    when(massageDao.findAllByClient(client)).thenReturn(massages);

    doAnswer(
        (Answer<Client>) invocation -> {
          clients.remove(client);
          return null;
        })
        .when(clientDao)
        .delete(client);

    doAnswer(
        (Answer<Client>) invocation -> {
          clients.remove(masseur);
          return null;
        })
        .when(clientDao)
        .delete(masseur);

    doAnswer(
        (Answer<Massage>) invocation -> {
          massageRemoved = true;
          return null;
        })
        .when(massageDao)
        .delete(clientMassage);

    doAnswer(
        invocation -> {
          massages.remove(clientMassage);
          massages.add(freeClientMassage);
          return null;
        })
        .when(massageDao)
        .clearClient(massages);

    doAnswer(
        (Answer<MailClient>) invocation -> {
          accountEmailSentTimes++;
          return null;
        })
        .when(mailClient)
        .sendEmail(client.getEmail(), "Account Removed", "accountRemoved.html", null);

    doAnswer(
        (Answer<MailClient>) invocation -> {
          accountEmailSentTimes++;
          return null;
        })
        .when(mailClient)
        .sendEmail(masseur.getEmail(), "Account Removed", "accountRemoved.html", null);

    doAnswer(
        (Answer<MailClient>) invocation -> {
          cancelEmailSentTimes++;
          return null;
        })
        .when(mailClient)
        .sendEmail(client.getEmail(), "Massage Cancelled", "massageRemoved.html", mailArguments);

    doAnswer(
        (Answer<MailClient>) invocation -> {
          accountEmailSentTimes++;
          return null;
        })
        .when(mailClient)
        .sendEmail(masseur.getEmail(), "Massage Cancelled", "massageRemoved.html", null);
  }

  /**
   * Resets mocks after each test.
   */
  @After
  public void tearDown() {
    reset(massageDao);
    reset(clientDao);
  }

  /**
   * Fetches all {@link Client}s.
   *
   * @return {@link List} of all current {@link Client}s
   */
  private List<Client> fetchAll() {
    return RULE.target("/clients")
        .request()
        .header("Authorization", "Bearer TOKEN")
        .get(new GenericType<List<Client>>() {
        });
  }

  /**
   * Fetches all {@link Massage}s.
   *
   * @return {@link List} of all current {@link Massage}s
   */
  private List<Massage> fetchAllMassages() {
    return RULE.target("/massages")
        .request()
        .header("Authorization", "Bearer TOKEN")
        .get(new GenericType<List<Massage>>() {
        });
  }

  /**
   * Tests whether fetch request for all {@link Client}s works as intended.
   */
  @Test
  public void fetchTest() {
    List<Client> clients = fetchAll();

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

  /**
   * Test whether removal requests for normal {@link Client}s work as intended. This includes the
   * successful removal of all of their {@link Massage} assignments.
   */
  @Test
  public void deleteByClient() {
    final Response response =
        RULE.target("/clients/Subject1")
            .request()
            .header("Authorization", "Bearer TOKEN")
            .delete();
    final List<Client> clients = fetchAll();
    final List<Massage> massages = fetchAllMassages();

    assertNotNull(response);
    assertEquals(204, response.getStatus());
    assertEquals(1, clients.size());
    assertEquals(masseur, clients.get(0));
    assertEquals(1, massages.size());
    assertNull(massages.get(0).getClient());
    assertEquals(1, accountEmailSentTimes);
    assertEquals(0, cancelEmailSentTimes);
  }

  /**
   * Test whether removal requests for masseuse {@link Client}s work as intended. This includes the
   * successful removal of all of their {@link Massage}s.
   */
  @Test
  public void deleteByMasseuse() {
    final Response response =
        RULE.target("/clients/Subject2")
            .request()
            .header("Authorization", "Bearer TOKEN")
            .delete();
    final List<Client> clients = fetchAll();
    final List<Massage> massages = fetchAllMassages();

    assertNotNull(response);
    assertEquals(204, response.getStatus());
    assertEquals(1, clients.size());
    assertEquals(client, clients.get(0));
    assertTrue(massageRemoved);
    assertEquals(clientMassage, massages.get(0));
    assertEquals(1, accountEmailSentTimes);
    assertEquals(1, cancelEmailSentTimes);
  }
}
