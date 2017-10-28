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
package net.rh.massages.integration;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.Date;
import java.util.List;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.junit.BeforeClass;
import org.junit.Test;

import net.minidev.json.JSONObject;
import net.rh.massages.IntegrationTestSuite;
import net.rh.massages.core.Facility;
import net.rh.massages.core.Massage;

/**
 * FacilityResourceTest FacilityResource JUnit integration test
 *
 * @author psilling
 * @since 1.0.0
 *
 */

public class FacilityResourceTest {

	/**
	 * Creates a new Facility on the server to test on.
	 */
	@BeforeClass
	public static void setup() {
		JSONObject facility = new JSONObject();
		facility.put("name", "Big Facility");

		IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/facilities")
				.request(MediaType.APPLICATION_JSON).post(Entity.json(facility.toJSONString()));
	}

	/**
	 * Fetches all Facilities
	 *
	 * @return list of all current Facilities
	 */
	private List<Facility> fetchAll() {
		return IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/facilities").request()
				.get(new GenericType<List<Facility>>() {
				});
	}

	/**
	 * Fetches a given Facility
	 *
	 * @param id id of the Facility
	 * @return fetched Facility
	 */
	private Facility fetchFacility(long id) {
		return IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/facilities/" + id).request()
				.get(Facility.class);
	}

	/**
	 * Tests whether fetch request for all Facilities works as intended
	 */
	@Test
	public void fetchTest() {
		List<Facility> facilities = fetchAll();

		assertNotNull(facilities);
		assertEquals(1, facilities.size());
	}

	/**
	 * Tests whether creation and follow up removal of a new Facility work as
	 * intended
	 */
	@Test
	public void createDeleteTest() {
		// Tests the creation
		JSONObject facility = new JSONObject();
		facility.put("name", "Created Facility");

		Response response = IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/facilities")
				.request(MediaType.APPLICATION_JSON).post(Entity.json(facility.toJSONString()));
		List<Facility> facilities = fetchAll();

		assertNotNull(response);
		assertEquals(201, response.getStatus());
		assertEquals(2, facilities.size());

		// Tests the removal
		response = IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/facilities/2").request()
				.delete();
		facilities = fetchAll();

		assertNotNull(response);
		assertEquals(204, response.getStatus());
		assertEquals(1, facilities.size());
	}

	/**
	 * Tests whether fetch request for a given Facility works as intended
	 */
	@Test
	public void getByIdTest() {
		Facility facility = fetchFacility(1);

		assertNotNull(facility);
		assertEquals(1, facility.getId());
		assertTrue(facility.getName().equals("Big Facility") || facility.getName().equals("Updated Facility"));
	}

	/**
	 * Tests whether update request for a given Facility works as intended
	 */
	@Test
	public void updateTest() {
		JSONObject facility = new JSONObject();
		facility.put("id", 1);
		facility.put("name", "Updated Facility");

		Response response = IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/facilities/1")
				.request(MediaType.APPLICATION_JSON).put(Entity.json(facility.toJSONString()));
		Facility updatedFacility = response.readEntity(Facility.class);

		assertNotNull(response);
		assertNotNull(updatedFacility);
		assertEquals(200, response.getStatus());
		assertEquals(1, updatedFacility.getId());
		assertEquals("Updated Facility", updatedFacility.getName());
	}

	/**
	 * Creates a new Massage (used also in follow up MassageResource testing) and
	 * tests whether fetch request for all Massages of a given Facility works as
	 * intended
	 */
	@Test
	public void getMassagesTest() {
		Facility facility = fetchFacility(1);

		JSONObject massage = new JSONObject();
		massage.put("date", new Date(0).getTime());
		massage.put("masseuse", "Great Masseuse");
		massage.put("facility", facility);

		IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/massages")
				.request(MediaType.APPLICATION_JSON).post(Entity.json(massage.toJSONString()));

		List<Massage> massages = IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/facilities/1/massages")
				.request().get(new GenericType<List<Massage>>() {
				});

		assertNotNull(massages);
		assertEquals(1, massages.size());
	}
}
