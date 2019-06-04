package cz.redhat.websockets;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.websocket.Session;

/**
 * Representation class for resource subscriptions necessary in sockets.
 *
 * @author psilling
 * @since 1.7.0
 */
class SubscriptionSession {
  private Session session; // session the client used for subscribing
  private Set<String> subscriptions = Collections.synchronizedSet(new HashSet<>()); // the sub. list
  private boolean awaitsPong; // whether the server awaits a pong reply from the client
  private boolean failedPong; // whether the last sent ping was unanswered

  SubscriptionSession(Session session) {
    this.session = session;
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
}
