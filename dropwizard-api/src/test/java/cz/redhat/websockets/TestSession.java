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

import java.io.IOException;
import java.net.URI;
import java.nio.ByteBuffer;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Future;
import javax.websocket.CloseReason;
import javax.websocket.Extension;
import javax.websocket.MessageHandler;
import javax.websocket.RemoteEndpoint;
import javax.websocket.SendHandler;
import javax.websocket.Session;
import javax.websocket.WebSocketContainer;

/**
 * Mocked version of {@link Session}.
 *
 * @author psilling
 * @since 1.7.0
 */
public class TestSession implements Session {
  private String id;
  static String sentMessage;

  public TestSession() {
    this.id = "0";
  }

  TestSession(String id) {
    this.id = id;
  }

  @Override
  public WebSocketContainer getContainer() {
    return null;
  }

  @Override
  public void addMessageHandler(MessageHandler messageHandler) {
  }

  @Override
  public Set<MessageHandler> getMessageHandlers() {
    return null;
  }

  @Override
  public void removeMessageHandler(MessageHandler messageHandler) {
  }

  @Override
  public String getProtocolVersion() {
    return null;
  }

  @Override
  public String getNegotiatedSubprotocol() {
    return null;
  }

  @Override
  public List<Extension> getNegotiatedExtensions() {
    return null;
  }

  @Override
  public boolean isSecure() {
    return false;
  }

  @Override
  public boolean isOpen() {
    return true;
  }

  @Override
  public long getMaxIdleTimeout() {
    return 0;
  }

  @Override
  public void setMaxIdleTimeout(long l) {
  }

  @Override
  public void setMaxBinaryMessageBufferSize(int i) {
  }

  @Override
  public int getMaxBinaryMessageBufferSize() {
    return 0;
  }

  @Override
  public void setMaxTextMessageBufferSize(int i) {
  }

  @Override
  public int getMaxTextMessageBufferSize() {
    return 0;
  }

  @Override
  public RemoteEndpoint.Async getAsyncRemote() {
    return new RemoteEndpoint.Async() {
      @Override
      public long getSendTimeout() {
        return 0;
      }

      @Override
      public void setSendTimeout(long l) {
      }

      @Override
      public void sendText(String s, SendHandler sendHandler) {
        TestSession.sentMessage = s;
      }

      @Override
      public Future<Void> sendText(String s) {
        TestSession.sentMessage = s;
        return null;
      }

      @Override
      public Future<Void> sendBinary(ByteBuffer byteBuffer) {
        return null;
      }

      @Override
      public void sendBinary(ByteBuffer byteBuffer, SendHandler sendHandler) {
      }

      @Override
      public Future<Void> sendObject(Object o) {
        return null;
      }

      @Override
      public void sendObject(Object o, SendHandler sendHandler) {
      }

      @Override
      public void setBatchingAllowed(boolean b) throws IOException {
      }

      @Override
      public boolean getBatchingAllowed() {
        return false;
      }

      @Override
      public void flushBatch() throws IOException {
      }

      @Override
      public void sendPing(ByteBuffer byteBuffer) throws IOException, IllegalArgumentException {
      }

      @Override
      public void sendPong(ByteBuffer byteBuffer) throws IOException, IllegalArgumentException {
      }
    };
  }

  @Override
  public RemoteEndpoint.Basic getBasicRemote() {
    return null;
  }

  @Override
  public String getId() {
    return id;
  }

  @Override
  public void close() {
  }

  @Override
  public void close(CloseReason closeReason) {
  }

  @Override
  public URI getRequestURI() {
    return null;
  }

  @Override
  public Map<String, List<String>> getRequestParameterMap() {
    return null;
  }

  @Override
  public String getQueryString() {
    return null;
  }

  @Override
  public Map<String, String> getPathParameters() {
    return null;
  }

  @Override
  public Map<String, Object> getUserProperties() {
    return null;
  }

  @Override
  public Principal getUserPrincipal() {
    return null;
  }

  @Override
  public Set<Session> getOpenSessions() {
    return null;
  }
}
