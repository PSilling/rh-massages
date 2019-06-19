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

package cz.redhat.websockets;

import com.codahale.metrics.annotation.ExceptionMetered;
import com.codahale.metrics.annotation.Metered;
import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;
import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.PongMessage;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Web socket resource class. Handles all resource update subscription traffic.
 *
 * @author psilling
 * @since 1.7.0
 */
@Metered
@Timed
@ExceptionMetered
@ServerEndpoint("/api/websockets")
public class WebSocketResource {

  private static final ObjectMapper mapper = new ObjectMapper();
  private static final Map<String, SubscriptionSession> clients =
      Collections.synchronizedMap(new HashMap<>());
  private static final Logger logger = LoggerFactory.getLogger(WebSocketResource.class);
  private static final Timer timer = new Timer();

  /**
   * Adds a given {@link Session} inside the list and logs current state. Sessions are also pinged
   * at regular intervals. After two heartbeat failures in a row the session gets closed. All new
   * connections have to be first authenticated using the dedicated WebSocket resource endpoint.
   * Simple hashing based on a generated number code and the session ID is used.
   *
   * @param session the {@link Session} that is currently opening
   */
  @OnOpen
  public void addSession(Session session) {
    String authString = generateAuthString();
    clients.put(session.getId(), new SubscriptionSession(session, authString));
    session.getAsyncRemote().sendText(
        session.getId() + "_" + String.valueOf(Objects.hash(session.getId(), authString))
    );
    logger.info("Opened a new WebSocket. ID: {}.", session.getId());

    timer.scheduleAtFixedRate(new TimerTask() {
      @Override
      public void run() {
        SubscriptionSession subSession = clients.get(session.getId());
        if (subSession == null) {
          this.cancel();
          return;
        }

        try {
          session.getAsyncRemote().sendPing(ByteBuffer.wrap(session.getId().getBytes()));
          subSession.setAwaitsPong(true);

          timer.schedule(new TimerTask() {
            @Override
            public void run() {
              if (!subSession.awaitsPong()) {
                subSession.setFailedPong(false);
                return;
              }

              if (subSession.hasFailedPong()) {
                try {
                  session.close();
                } catch (IOException e) {
                  logger.error("Failed to close a WebSocket after ping timeout. "
                          + "Session ID: {}. Cause: {}. Message: {}. Stack trace: {}.",
                      session.getId(), e.getCause(), e.getMessage(), e.getStackTrace()
                  );
                }
              } else {
                subSession.setAwaitsPong(false);
                subSession.setFailedPong(true);
              }
            }
          }, 5000);
        } catch (IOException e) {
          logger.error(
              "Ping error detected. Session ID: {}. Cause: {}. Message: {}. Stack trace: {}.",
              session.getId(), e.getCause(), e.getMessage(), e.getStackTrace()
          );
        }
      }
    }, 30000, 120000);
  }

  /**
   * Processes a message that should contain a subscription operation using the following format:
   * ADD_SubscriptionType to create a subscription or REMOVE_SubscriptionType to remove one. Sends
   * a return message containing OK or FAIL and the attempted operation (format: Operation_Status).
   * Operation is skipped if the connection isn't authenticated.
   *
   * @param session the {@link Session} associated with the client
   * @param message the message received from the client
   */
  @OnMessage
  public void processMessage(Session session, String message) {
    String[] splitMessage = message.split("_");
    SubscriptionSession subSession = clients.get(session.getId());
    Set<String> subscriptions;

    if (!subSession.isAuthenticated()) {
      session.getAsyncRemote().sendText("403");
      return;
    }

    synchronized ((subscriptions = subSession.getSubscriptions())) {
      if (splitMessage[0].equalsIgnoreCase("ADD")) {
        if (subscriptions.add(splitMessage[1])) {
          session.getAsyncRemote().sendText("ADD_OK");
          return;
        }
      } else if (splitMessage[0].equalsIgnoreCase("REMOVE")) {
        if (subscriptions.remove(splitMessage[1])) {
          session.getAsyncRemote().sendText("REMOVE_OK");
          return;
        }
      }
    }

    session.getAsyncRemote().sendText(splitMessage[0] + "_FAIL");
  }

  /**
   * Processes a pong message by resetting awaiting pong boolean value.
   *
   * @param pongMessage pong received from the client
   */
  @OnMessage
  public void processPong(Session session, PongMessage pongMessage) {
    clients.get(session.getId()).setAwaitsPong(false);
  }

  /**
   * Removes a to-be-closed {@link Session} from the list and logs current state.
   *
   * @param session the {@link Session} that is currently closing
   * @param reason  reason for the closure
   */
  @OnClose
  public void removeSession(Session session, CloseReason reason) {
    if (clients.remove(session.getId()) == null) {
      logger.error("Failed to close a WebSocket. Session ID: {}. Reason: {} (code {}).",
          session.getId(), reason.getReasonPhrase(), reason.getCloseCode());
      return;
    }

    logger.info("Closed a WebSocket. Session ID: {}. Reason: {} (code {}).", session.getId(),
        reason.getReasonPhrase(), reason.getCloseCode());
  }

  /**
   * Handles (logs) all socket throws that are not caught by default operation handlers.
   *
   * @param session the {@link Session} that is currently closing
   * @param th      the uncaught {@link Throwable} to process
   */
  @OnError
  public void handleError(Session session, Throwable th) {
    logger.error(
        "WebSocket error detected. Session ID: {}. Cause: {}. Message: {}. Stack trace: {}.",
        session.getId(), th.getCause(), th.getMessage(), th.getStackTrace()
    );
  }

  /**
   * Sends a given message to all clients subscribed to a given subscription.
   *
   * @param subscription subscription to search for
   * @param operation    what {@link OperationType} operation triggered the change
   * @param data         data object to be sent to all subscribed clients as a JSON message
   */
  public static void informSubscribed(String subscription, OperationType operation, Object data) {
    synchronized (clients) {
      SubscriptionSession subscriptionSession;
      for (Map.Entry<String, SubscriptionSession> entry : clients.entrySet()) {
        subscriptionSession = entry.getValue();
        if (subscriptionSession.getSubscriptions().contains(subscription)) {
          try {
            subscriptionSession.getSession().getAsyncRemote().sendText(
                operation.name() + "_" + subscription + "_" + mapper.writeValueAsString(data)
            );
          } catch (JsonProcessingException e) {
            logger.error("JSON transformation error detected. Message:" + e.getMessage());
          }
        }
      }
    }
  }

  /**
   * Generates a new WebSocket authentication string using randomized numbers.
   *
   * @return the generated string
   */
  private String generateAuthString() {
    final int count = 64;
    StringBuilder builder = new StringBuilder();

    for (int i = 0; i < count; i++) {
      builder.append((int) (Math.random() * 9));
    }

    return builder.toString();
  }

  public static Map<String, SubscriptionSession> getClients() {
    return clients;
  }
}
