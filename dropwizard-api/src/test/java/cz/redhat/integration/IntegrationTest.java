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

package cz.redhat.integration;

import cz.redhat.MassagesApplication;
import cz.redhat.MassagesConfiguration;
import io.dropwizard.testing.ResourceHelpers;
import io.dropwizard.testing.junit.DropwizardAppRule;
import org.junit.ClassRule;

/**
 * JUnit integration test.
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
}
