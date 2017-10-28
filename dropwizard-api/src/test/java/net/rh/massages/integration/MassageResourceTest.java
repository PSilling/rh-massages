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

import org.junit.Test;

import net.minidev.json.JSONObject;
import net.rh.massages.IntegrationTestSuite;
import net.rh.massages.core.Facility;
import net.rh.massages.core.Massage;

/**
 * MassageResourceTest MassageResource JUnit integration test Doesn't use setup
 * class because this test works with a Massage created by FacilityResource
 * test.
 *
 * @author psilling
 * @since 1.0.0
 *
 */

public class MassageResourceTest {

	/**
	 * Fetches all Massages
	 *
	 * @return list of all current Massages
	 */
	private List<Massage> fetchAll() {
		return IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/massages").request()
				.get(new GenericType<List<Massage>>() {
				});
	}

	/**
	 * Tests whether fetch request for all Massages works as intended
	 */
	@Test
	public void fetchTest() {
		List<Massage> massages = fetchAll();

		assertNotNull(massages);
		assertEquals(1, massages.size());
	}

	/**
	 * Tests whether creation and follow up removal of a new Massage work as
	 * intended
	 */
	@Test
	public void createDeleteTest() {
		// Tests the creation
		Facility facility = IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/facilities/1").request()
				.get(Facility.class);
		JSONObject massage = new JSONObject();
		massage.put("date", new Date(1000).getTime());
		massage.put("masseuse", "New Masseuse");
		massage.put("facility", facility);

		Response response = IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/massages")
				.request(MediaType.APPLICATION_JSON).post(Entity.json(massage.toJSONString()));
		List<Massage> massages = fetchAll();

		assertNotNull(response);
		assertEquals(201, response.getStatus());
		assertEquals(2, massages.size());

		// Tests the removal
		response = IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/massages/2").request()
				.delete();
		massages = fetchAll();

		assertNotNull(response);
		assertEquals(204, response.getStatus());
		assertEquals(1, massages.size());
	}

	/**
	 * Tests whether fetch request for a given Massage works as intended
	 */
	@Test
	public void getByIdTest() {
		Massage massage = IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/massages/1").request()
				.get(Massage.class);

		assertNotNull(massage);
		assertEquals(1, massage.getId());
		assertEquals(new Date(0), massage.getDate());
		assertTrue(massage.getMasseuse().equals("Great Masseuse") || massage.getMasseuse().equals("Updated Masseuse"));
		assertEquals(null, massage.getUser());
		assertEquals(1, massage.getFacility().getId());
	}

	/**
	 * Tests whether update request for a given Massage works as intended
	 */
	@Test
	public void updateTest() {
		Facility facility = IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/facilities/1").request()
				.get(Facility.class);
		JSONObject massage = new JSONObject();
		massage.put("date", new Date(0).getTime());
		massage.put("masseuse", "Updated Masseuse");
		massage.put("facility", facility);

		Response response = IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/massages/1")
				.request(MediaType.APPLICATION_JSON).put(Entity.json(massage.toJSONString()));
		Massage updatedMassage = response.readEntity(Massage.class);

		assertNotNull(response);
		assertNotNull(updatedMassage);
		assertEquals(200, response.getStatus());
		assertEquals(1, updatedMassage.getId());
		assertEquals(new Date(0), updatedMassage.getDate());
		assertEquals("Updated Masseuse", updatedMassage.getMasseuse());
		assertEquals(null, updatedMassage.getUser());
		assertEquals(facility, updatedMassage.getFacility());
	}
}