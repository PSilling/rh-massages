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

import java.util.Collections;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.websocket.Session;

/**
 * Representation class for resource subscriptions necessary in sockets.
 *
 * @author psilling
 * @since 1.7.0
 */
public class SubscriptionSession {
  private Session session; // session the client used for subscribing
  private Set<String> subscriptions = Collections.synchronizedSet(new HashSet<>()); // the sub. list
  private String authHash; // authentication string hashed with session ID
  private boolean authenticated = false; // whether the connected client completed the handshake
  private boolean awaitsPong; // whether the server awaits a pong reply from the client
  private boolean failedPong; // whether the last sent ping was unanswered

  public SubscriptionSession(Session session, String authString) {
    this.session = session;
    this.authHash = generateAuthHash(session, authString);
  }

  Session getSession() {
    return session;
  }

  void setSession(Session session) {
    this.session = session;
  }

  Set<String> getSubscriptions() {
    return subscriptions;
  }

  public boolean isAuthenticated() {
    return authenticated;
  }

  boolean awaitsPong() {
    return awaitsPong;
  }

  void setAwaitsPong(boolean awaitsPong) {
    this.awaitsPong = awaitsPong;
  }

  boolean hasFailedPong() {
    return failedPong;
  }

  void setFailedPong(boolean failedPong) {
    this.failedPong = failedPong;
  }

  /**
   * Tries to authenticate the WebSocket.
   *
   * @param key hashed authentication code
   * @return true if the authentication was successful
   */
  public boolean authenticate(String key) {
    if (authHash.equals(key)) {
      this.authenticated = true;
      return true;
    }

    return false;
  }

  /**
   * Generates a hash for authentication purposes.
   *
   * @param session    {@link Session} to get ID from
   * @param authString plaintext authentication string
   * @return the authentication string or null if session is null
   */
  static String generateAuthHash(Session session, String authString) {
    if (session == null) {
      return null;
    }

    return String.valueOf(Objects.hash(session.getId(), authString));
  }
}
