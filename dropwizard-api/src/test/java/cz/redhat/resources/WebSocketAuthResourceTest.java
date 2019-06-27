/*
  Copyright (C) 2019 Petr Silling

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
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import cz.redhat.auth.TestAuthenticator;
import cz.redhat.auth.TestAuthorizer;
import cz.redhat.auth.TestUser;
import cz.redhat.auth.User;
import cz.redhat.websockets.SubscriptionSession;
import cz.redhat.websockets.TestSession;
import cz.redhat.websockets.WebSocketResource;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.oauth.OAuthCredentialAuthFilter;
import io.dropwizard.testing.junit.ResourceTestRule;
import java.util.Objects;
import javax.websocket.Session;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.glassfish.jersey.test.grizzly.GrizzlyWebTestContainerFactory;
import org.junit.ClassRule;
import org.junit.Test;

/**
 * {@link WebSocketAuthResource} JUnit resource test for authentication using the /websockets
 * endpoint.
 *
 * @author psilling
 * @since 1.7.0
 */
public class WebSocketAuthResourceTest {

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
          .addResource(new WebSocketAuthResource())
          .build();

  private final String authString = "01234567899876543210"; // test authorization number string
  private final Session session = new TestSession(); // mocked session instance
  private final SubscriptionSession subSession
      = new SubscriptionSession(session, authString); // test subscription session

  /**
   * Tests whether WebSocket authentication works as intended.
   */
  @Test
  public void webSocketAuthTest() {
    // test invalid format authentication failure
    WebSocketResource.getClients().put(session.getId(), subSession);
    Response response =
        RULE.target("/websockets")
            .request(MediaType.APPLICATION_JSON_TYPE)
            .header("Authorization", "Bearer TOKEN")
            .post(Entity.json(
                String.format("%s_%d_a-z1.9#*", session.getId(), Objects.hash(authString))
            ));
    assertFalse(subSession.isAuthenticated());
    assertNotNull(response);
    assertEquals(400, response.getStatus());

    // test invalid session identifier authentication failure
    response =
        RULE.target("/websockets")
            .request(MediaType.APPLICATION_JSON_TYPE)
            .header("Authorization", "Bearer TOKEN")
            .post(Entity.json(
                String.format(".%s_%d.", "1" + session.getId(), Objects.hash(authString))
            ));
    assertFalse(subSession.isAuthenticated());
    assertNotNull(response);
    assertEquals(403, response.getStatus());

    // test invalid authentication code failure
    WebSocketResource.getClients().put(session.getId(), subSession);
    response =
        RULE.target("/websockets")
            .request(MediaType.APPLICATION_JSON_TYPE)
            .header("Authorization", "Bearer TOKEN")
            .post(Entity.json(
                String.format("\"%s_%d\"", session.getId(), Objects.hash(authString) + 1)
            ));
    assertFalse(subSession.isAuthenticated());
    assertNotNull(response);
    assertEquals(403, response.getStatus());

    // test correct authentication
    response =
        RULE.target("/websockets")
            .request(MediaType.APPLICATION_JSON_TYPE)
            .header("Authorization", "Bearer TOKEN")
            .post(Entity.json(String.format(
                "\"%s_%d\"", session.getId(), Objects.hash(session.getId(), authString)
            )));
    WebSocketResource.getClients().remove(session.getId());

    assertTrue(subSession.isAuthenticated());
    assertNotNull(response);
    assertEquals(204, response.getStatus());
  }
}
