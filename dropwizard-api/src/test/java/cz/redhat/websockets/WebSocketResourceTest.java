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

package cz.redhat.websockets;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

import javax.websocket.CloseReason;
import javax.websocket.Session;
import org.junit.Test;

/**
 * {@link WebSocketResource} JUnit resource test for /websockets endpoint. Tests functionality of
 * the WebSocket implementation itself.
 *
 * @author psilling
 * @since 1.7.0
 */
public class WebSocketResourceTest {

  private final String authString = "01234567899876543210"; // test authorization number string
  private final Session session = new TestSession(); // mocked session instance
  private final SubscriptionSession subSession
      = new SubscriptionSession(session, authString); // test subscription session
  private final WebSocketResource webSocketResource = new WebSocketResource(); // test resource

  /**
   * Tests whether {@link Session} registration works as intended. Note that the ping-pong delay is
   * not a part of this registration and therefore is not tested here.
   */
  @Test
  public void testAddSession() {
    assertEquals(0, WebSocketResource.getClients().size());
    webSocketResource.addSession(session);

    assertEquals(1, WebSocketResource.getClients().size());
    assertEquals(
        subSession.getSession(), WebSocketResource.getClients().get(session.getId()).getSession()
    );

    webSocketResource.removeSession(
        session, new CloseReason(CloseReason.CloseCodes.NORMAL_CLOSURE, "Cleanup")
    );
  }

  /**
   * Tests whether operation handler messages are correctly updating the WebSocket subscriptions.
   * Tries the scenario both with and without valid authentication.
   */
  @Test
  public void testProcessMessage() {
    webSocketResource.addSession(session);
    assertEquals(0, subSession.getSubscriptions().size());

    final SubscriptionSession subSession = WebSocketResource.getClients().get(session.getId());
    final String authString = TestSession.sentMessage.split("_")[1];

    webSocketResource.processMessage(session, "ADD_Facility");
    assertEquals(0, subSession.getSubscriptions().size());

    webSocketResource.processMessage(session, "?");
    assertEquals(0, subSession.getSubscriptions().size());

    subSession.authenticate(authString);

    webSocketResource.processMessage(new TestSession("010"), "ADD_Client");
    assertEquals(0, subSession.getSubscriptions().size());

    webSocketResource.processMessage(session, "ADD_Facility");
    assertEquals(1, subSession.getSubscriptions().size());

    webSocketResource.processMessage(session, "ADD_Facility");
    assertEquals(1, subSession.getSubscriptions().size());

    webSocketResource.processMessage(session, "ADD_Client");
    assertEquals(2, subSession.getSubscriptions().size());

    webSocketResource.processMessage(session, "Test_Something");
    assertEquals(2, subSession.getSubscriptions().size());

    webSocketResource.processMessage(session, "");
    assertEquals(2, subSession.getSubscriptions().size());

    webSocketResource.processMessage(new TestSession("*"), "test");
    assertEquals(2, subSession.getSubscriptions().size());

    webSocketResource.processMessage(session, "REMOVE_Client");
    assertEquals(1, subSession.getSubscriptions().size());

    webSocketResource.processMessage(session, "TEST_Facility");
    assertEquals(1, subSession.getSubscriptions().size());

    webSocketResource.processMessage(session, "REMOVE_Client");
    assertEquals(1, subSession.getSubscriptions().size());

    webSocketResource.processMessage(session, "REMOVE_Facility");
    assertEquals(0, subSession.getSubscriptions().size());

    webSocketResource.processMessage(session, "ADD_Massage");
    assertEquals(1, subSession.getSubscriptions().size());

    webSocketResource.removeSession(
        session, new CloseReason(CloseReason.CloseCodes.NORMAL_CLOSURE, "Cleanup")
    );
  }

  /**
   * Tests whether pongs are handled properly.
   */
  @Test
  public void testProcessPong() {
    webSocketResource.addSession(session);
    WebSocketResource.getClients().get(session.getId()).setAwaitsPong(true);

    webSocketResource.processPong(new TestSession("1"), () -> null);
    assertTrue(WebSocketResource.getClients().get(session.getId()).awaitsPong());
    webSocketResource.processPong(session, () -> null);
    assertFalse(WebSocketResource.getClients().get(session.getId()).awaitsPong());

    webSocketResource.removeSession(
        session, new CloseReason(CloseReason.CloseCodes.NORMAL_CLOSURE, "Cleanup")
    );
  }

  /**
   * Tests whether {@link Session} removal works as intended.
   */
  @Test
  public void testRemoveSession() {
    webSocketResource.addSession(session);
    assertEquals(1, WebSocketResource.getClients().size());

    webSocketResource.removeSession(
        new TestSession("10"),
        new CloseReason(CloseReason.CloseCodes.CLOSED_ABNORMALLY, "Fail to remove")
    );
    assertEquals(1, WebSocketResource.getClients().size());

    webSocketResource.removeSession(
        session, new CloseReason(CloseReason.CloseCodes.NORMAL_CLOSURE, "Handle remove")
    );
    assertEquals(0, WebSocketResource.getClients().size());

    webSocketResource.removeSession(
        session, new CloseReason(CloseReason.CloseCodes.GOING_AWAY, "Fail to remove")
    );
    assertEquals(0, WebSocketResource.getClients().size());
  }
}
