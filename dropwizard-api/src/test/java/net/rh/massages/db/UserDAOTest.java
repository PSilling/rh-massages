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
package net.rh.massages.db;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;

import io.dropwizard.testing.junit.DAOTestRule;
import net.rh.massages.core.User;

/**
 * UserDAOTest User Data Access Object JUnit test class
 *
 * @author psilling
 * @since 1.0.0
 *
 */

public class UserDAOTest {

	@Rule
	public DAOTestRule daoTestRule = DAOTestRule.newBuilder().addEntityClass(User.class).build(); // database mock

	private UserDAO userDAO; // user data access object

	/**
	 * Creates UserDAO with current database Session
	 *
	 * @throws Exception
	 */
	@Before
	public void setUp() throws Exception {
		userDAO = new UserDAO(daoTestRule.getSessionFactory());
	}

	/**
	 * Tests whether User creation works as intended.
	 */
	@Test
	public void testCreate() {
		final User user = new User("Normal User", "example@email.com", false);
		final User createdUser = daoTestRule.inTransaction(() -> userDAO.create(user));

		assertEquals(user, createdUser);
	}

	/**
	 * Tests whether User updating works as intended.
	 */
	@Test
	public void testUpdate() {
		User user = new User("Normal User", "example@email.com", false);
		final User updatedUser = daoTestRule.inTransaction(() -> {
			userDAO.create(user);
			user.setName("Admin User");
			user.setEmail("example@email.cz");
			user.setAdmin(true);
			return userDAO.update(user);
		});

		assertEquals(1, updatedUser.getId());
		assertEquals("Admin User", updatedUser.getName());
		assertEquals("example@email.cz", updatedUser.getEmail());
		assertTrue(updatedUser.getAdmin());
		assertEquals(user, updatedUser);
	}

	/**
	 * Tests whether User removal works as intended.
	 */
	@Test
	public void testDelete() {
		final User user = new User("Normal User", "example@email.com", false);
		User removedUser = daoTestRule.inTransaction(() -> {
			User deletedUser = userDAO.create(user);
			userDAO.delete(user);
			return deletedUser;
		});

		List<User> users = userDAO.findAll();

		assertNotNull(removedUser);
		assertFalse(users.contains(user));
	}

	/**
	 * Tests whether all UserDAO finding methods are working as intended.
	 */
	@Test
	public void testFind() {
		final User user1 = new User("Normal User", "example@email.com", false);
		final User user2 = new User("Admin User", "example@email.cz", true);
		daoTestRule.inTransaction(() -> {
			userDAO.create(user1);
			userDAO.create(user2);
		});

		User userById = userDAO.findById((long) 1);
		User userByName = userDAO.findByName("Admin User");
		User userByEmail = userDAO.findByEmail("example@email.com");
		List<User> usersByAdmin = userDAO.findAllByAdmin(true);
		List<User> users = userDAO.findAll();

		assertEquals(user1, userById);
		assertEquals(user2, userByName);
		assertEquals(user1, userByEmail);
		assertEquals(1, usersByAdmin.size());
		assertEquals(2, users.size());
	}
}