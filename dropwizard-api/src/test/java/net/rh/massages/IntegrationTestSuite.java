/*******************************************************************************
 *     Copyright (C) 2017  Petr Silling
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *******************************************************************************/
package net.rh.massages;

import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

import io.dropwizard.testing.ResourceHelpers;
import io.dropwizard.testing.junit.DropwizardAppRule;
import net.rh.massages.integration.FacilityResourceTest;
import net.rh.massages.integration.MassageResourceTest;
import net.rh.massages.integration.UserResourceTest;

/**
 * IntegrationTestSuite JUnit test suite that runs integration resource tests
 *
 * @author psilling
 * @since 1.0.0
 *
 */

@RunWith(Suite.class)
@SuiteClasses({ FacilityResourceTest.class, MassageResourceTest.class, UserResourceTest.class })
public class IntegrationTestSuite {

	/*
	 * Creates a new static DropwizardAppRule that starts the whole application in
	 * the test environment.
	 */
	@ClassRule
	public static final DropwizardAppRule<MassagesConfiguration> RULE = new DropwizardAppRule<>(
			MassagesApplication.class, ResourceHelpers.resourceFilePath("config-test.yml"));

	/**
	 * Prepares our testing database by migrating the configuration file.
	 *
	 * @throws Exception
	 */
	@BeforeClass
	public static void migrateDb() throws Exception {
		RULE.getApplication().run("db", "migrate", ResourceHelpers.resourceFilePath("config-test.yml"));
	}
}