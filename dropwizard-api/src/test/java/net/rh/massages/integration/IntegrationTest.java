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

package net.rh.massages.integration;

import io.dropwizard.testing.ResourceHelpers;
import io.dropwizard.testing.junit.DropwizardAppRule;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.core.GenericType;
import net.rh.massages.MassagesApplication;
import net.rh.massages.MassagesConfiguration;
import net.rh.massages.resources.LogoutResource;
import org.junit.ClassRule;
import org.junit.Test;

/**
 * JUnit integration test that also checks whether authorization is applied to {@link
 * LogoutResource}.
 *
 * @author psilling
 * @since 1.0.0
 */
public class IntegrationTest {

  /**
   * Creates a new static {@link DropwizardAppRule} that starts the whole application in the test
   * environment.
   */
  @ClassRule
  public static final DropwizardAppRule<MassagesConfiguration> RULE =
      new DropwizardAppRule<>(
          MassagesApplication.class, ResourceHelpers.resourceFilePath("config-test.yml"));

  /**
   * Tests whether {@link LogoutResource} endpoint requires authentication.
   */
  @Test(expected = NotAuthorizedException.class)
  public void testLogoutAuth() {
    RULE.client()
        .target("http://localhost:" + RULE.getLocalPort() + "/api/logout")
        .request()
        .get(new GenericType<String>() {
        });
  }
}
