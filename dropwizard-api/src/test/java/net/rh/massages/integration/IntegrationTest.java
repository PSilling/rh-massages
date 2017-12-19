/*******************************************************************************
 * Copyright (C) 2017 Petr Silling
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 *******************************************************************************/
package net.rh.massages.integration;

import static org.junit.Assert.assertEquals;

import java.util.Date;
import java.util.List;

import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;

import io.dropwizard.testing.ResourceHelpers;
import io.dropwizard.testing.junit.DropwizardAppRule;
import net.rh.massages.MassagesApplication;
import net.rh.massages.MassagesConfiguration;
import net.rh.massages.core.Facility;
import net.rh.massages.core.Massage;

/**
 * IntegrationTest JUnit integration test that also checks whether authorization
 * is applied
 *
 * @author psilling
 * @since 1.0.0
 *
 */

public class IntegrationTest {

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

	/**
	 * Tests whether endpoints using Auth annotation require authentication.
	 */
	@Test(expected = NotAuthorizedException.class)
	public void testAuth() {
		final Facility facility = new Facility("Facility"); // test Facility
		final Massage massage = new Massage(new Date(0), new Date(1), "Great Masseuse", null, null, facility); // test
																												// Massage

		Response respone = RULE.client().target("http://localhost:" + RULE.getLocalPort() + "/api/massages/1")
				.request(MediaType.APPLICATION_JSON).put(Entity.json(massage));

		assertEquals(401, respone.getStatus());

		List<Massage> massages = RULE.client()
				.target("http://localhost:" + RULE.getLocalPort() + "/api/massages/client")
				.request(MediaType.APPLICATION_JSON).get(new GenericType<List<Massage>>() {
				});
	}
}