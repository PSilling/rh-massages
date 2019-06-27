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
import static org.junit.Assert.assertFalse;

import java.util.Objects;
import javax.websocket.Session;
import org.junit.Before;
import org.junit.Test;

/**
 * {@link SubscriptionSession} JUnit test class.
 *
 * @author psilling
 * @since 1.7.0
 */
public class SubscriptionSessionTest {

  private final String authString = "?#AbcdEFGHz01234567890-!"; // test authorization string
  private final Session session = new TestSession(); // mocked session instance
  private SubscriptionSession subSession; // test subscription session

  /**
   * Resets subSession mock before each test to clear all authentication results.
   */
  @Before
  public void setup() {
    subSession = new SubscriptionSession(session, authString);
  }

  /**
   * Tests whether authentication works as intended when the correct key is supplied.
   */
  @Test
  public void testAuth() {
    assertFalse(subSession.isAuthenticated());
    assertTrue(subSession.authenticate(String.valueOf(Objects.hash(session.getId(), authString))));
    assertTrue(subSession.isAuthenticated());
  }

  /**
   * Tests whether authentication correctly fails if invalid codes are supplied.
   */
  @Test
  public void testAuthFail() {
    assertFalse(subSession.isAuthenticated());
    assertFalse(subSession.authenticate(authString));
    assertFalse(subSession.isAuthenticated());
    assertFalse(subSession.authenticate(authString + "9"));
    assertFalse(subSession.isAuthenticated());
    assertFalse(subSession.authenticate("a" + authString));
    assertFalse(subSession.isAuthenticated());
    assertFalse(subSession.authenticate(String.valueOf(Objects.hash(session.getId()))));
    assertFalse(subSession.isAuthenticated());
    assertFalse(subSession.authenticate(String.valueOf(Objects.hash(authString))));
    assertFalse(subSession.isAuthenticated());
  }
}
