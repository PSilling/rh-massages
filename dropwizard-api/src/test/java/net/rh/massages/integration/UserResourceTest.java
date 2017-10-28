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
import static org.junit.Assert.assertFalse;
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
import net.rh.massages.core.User;

/**
 * UserResourceTest UserResource JUnit integration test
 *
 * @author psilling
 * @since 1.0.0
 *
 */

public class UserResourceTest {

	/**
	 * Creates a new User on the server to test on.
	 */
	@BeforeClass
	public static void setup() {
		JSONObject user = new JSONObject();
		user.put("name", "Normal User");
		user.put("email", "email@example.com");
		user.put("admin", false);

		IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/users")
				.request(MediaType.APPLICATION_JSON).post(Entity.json(user.toJSONString()));
	}

	/**
	 * Fetches all Users
	 *
	 * @return list of all current Users
	 */
	private List<User> fetchAll() {
		return IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/users").request()
				.get(new GenericType<List<User>>() {
				});
	}

	/**
	 * Fetches a given User
	 *
	 * @param id id of the User
	 * @return fetched User
	 */
	private User fetchUser(long id) {
		return IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/users/" + id).request()
				.get(User.class);
	}

	/**
	 * Tests whether fetch request for all Users works as intended
	 */
	@Test
	public void fetchTest() {
		List<User> users = fetchAll();

		assertNotNull(users);
		assertEquals(1, users.size());
	}

	/**
	 * Tests whether creation and follow up removal of a new User work as intended
	 */
	@Test
	public void createDeleteTest() {
		// Tests the creation
		JSONObject user = new JSONObject();
		user.put("name", "Admin User");
		user.put("email", "email@example.cz");
		user.put("admin", true);

		Response response = IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/users")
				.request(MediaType.APPLICATION_JSON).post(Entity.json(user.toJSONString()));
		List<User> users = fetchAll();

		assertNotNull(response);
		assertEquals(201, response.getStatus());
		assertEquals(2, users.size());

		// Tests the removal
		response = IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/users/2").request().delete();
		users = fetchAll();

		assertNotNull(response);
		assertEquals(204, response.getStatus());
		assertEquals(1, users.size());
	}

	/**
	 * Tests whether fetch request for a given User works as intended
	 */
	@Test
	public void getByIdTest() {
		User user = fetchUser(1);

		assertNotNull(user);
		assertEquals(1, user.getId());
		assertTrue(user.getName().equals("Normal User") || user.getName().equals("Updated User"));
		assertEquals("email@example.com", user.getEmail());
		assertFalse(user.getAdmin());
	}

	/**
	 * Tests whether update request for a given User works as intended
	 */
	@Test
	public void updateTest() {
		JSONObject user = new JSONObject();
		user.put("id", 1);
		user.put("name", "Updated User");
		user.put("email", "email@example.com");
		user.put("admin", false);

		Response response = IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/users/1")
				.request(MediaType.APPLICATION_JSON).put(Entity.json(user.toJSONString()));
		User updatedUser = response.readEntity(User.class);

		assertNotNull(response);
		assertNotNull(updatedUser);
		assertEquals(200, response.getStatus());
		assertEquals(1, updatedUser.getId());
		assertEquals("Updated User", updatedUser.getName());
		assertEquals("email@example.com", updatedUser.getEmail());
		assertFalse(updatedUser.getAdmin());
	}

	/**
	 * Creates a new Massage and tests whether fetch request for all Massages of a
	 * given User works as intended
	 */
	@Test
	public void fetchMassagesTest() {
		Facility facility = IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/facilities/1").request()
				.get(Facility.class);
		User user = fetchUser(1);

		JSONObject massage = new JSONObject();
		massage.put("date", new Date().getTime());
		massage.put("masseuse", "Great Masseuse");
		massage.put("user", user);
		massage.put("facility", facility);

		IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/massages")
				.request(MediaType.APPLICATION_JSON).post(Entity.json(massage.toJSONString()));

		List<Massage> massages = IntegrationTestSuite.RULE.client()
				.target("http://localhost:" + IntegrationTestSuite.RULE.getLocalPort() + "/users/1/massages").request()
				.get(new GenericType<List<Massage>>() {
				});

		assertNotNull(massages);
		assertEquals(1, massages.size());
	}
}
