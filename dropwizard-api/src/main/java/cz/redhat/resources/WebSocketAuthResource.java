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

import cz.redhat.websockets.SubscriptionSession;
import cz.redhat.websockets.WebSocketResource;
import javax.annotation.security.PermitAll;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Resource class for WebSocket authentication.
 *
 * @author psilling
 * @since 1.7.0
 */
@Path("/websockets")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class WebSocketAuthResource {

  public WebSocketAuthResource() {
  }

  /**
   * Accepts POST requests with WebSocket session ID and the hashed authentication code (separated
   * by '_', just like in the initial server message). If the hash matches hashed value of the saved
   * code, the WebSocket is automatically authenticated. First and last message characters (should
   * be JSON brackets) are ignored.
   *
   * @throws WebApplicationException if the WebSocket session could not be found or when the message
   *                                 is invalid
   */
  @POST
  @PermitAll
  public Response authenticateWebSocket(@NotNull String message) {
    String[] splitMessage = message.substring(1, message.length() - 1).split("_");

    if (splitMessage.length != 2) {
      throw new WebApplicationException(Response.Status.BAD_REQUEST);
    }

    SubscriptionSession subSession = WebSocketResource.getClients().get(splitMessage[0]);
    if (subSession != null && subSession.authenticate(splitMessage[1])) {
      return Response.noContent().build();
    }

    throw new WebApplicationException(Response.Status.FORBIDDEN);
  }
}
