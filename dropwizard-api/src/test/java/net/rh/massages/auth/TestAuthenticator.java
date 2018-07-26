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

package net.rh.massages.auth;

import io.dropwizard.auth.Authenticator;
import java.security.Principal;
import java.util.Optional;

/**
 * Test authenticator substitute class.
 *
 * @author psilling
 * @since 1.0.0
 */
public class TestAuthenticator<P extends Principal> implements Authenticator<String, TestUser> {

  /**
   * Authenticate a {@link TestUser} based on credentials.
   *
   * @param credentials user credentials
   * @return {@link Optional} value of {@link TestUser}
   */
  @Override
  public Optional<TestUser> authenticate(String credentials) {
    if (credentials != null) {
      return Optional.of(new TestUser());
    } else {
      return Optional.empty();
    }
  }
}
