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
  private String authString; // authentication string generated before creation
  private boolean authenticated = false; // whether the connected client completed the handshake
  private boolean awaitsPong; // whether the server awaits a pong reply from the client
  private boolean failedPong; // whether the last sent ping was unanswered

  SubscriptionSession(Session session, String authString) {
    this.session = session;
    this.authString = authString;
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

  boolean isAuthenticated() {
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
    String hashedAuthString = String.valueOf(Objects.hash(session.getId(), authString));

    if (hashedAuthString.equals(key)) {
      this.authenticated = true;
      return true;
    }

    return false;
  }
}
