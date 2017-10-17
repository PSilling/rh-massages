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

import io.dropwizard.hibernate.AbstractDAO;

import java.util.List;

import net.rh.massages.core.User;

import org.hibernate.SessionFactory;

/**
 * UserDAO User Data Access Object
 * 
 * @author psilling
 * @since 1.0.0
 *
 */

public class UserDAO extends AbstractDAO<User> {

	/**
	 * Parameterized UserDAO constructor
	 * 
	 * @param sessionFactory new UserDAO SessionFactory
	 */
	public UserDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}

	/**
	 * Creates a new Session and adds a given User to the database
	 * 
	 * @param user User to be created
	 * @return the created User
	 */
	public User create(User user) {
		return persist(user);
	}

	/**
	 * Clears the current Session and then updates a given User with a new Session
	 * 
	 * @param user updated User
	 * @return the updated User
	 */
	public User update(User user) {
		currentSession().clear();
		return persist(user);
	}

	/**
	 * Creates a new Session that finds a User in the database based on id
	 * 
	 * @param id id to be found
	 * @return the found User
	 */
	public User findById(Long id) {
		return get(id);
	}

	/**
	 * Creates a new Session that finds a User in the database based on name
	 * 
	 * @param name name to be found
	 * @return the found User
	 */
	public User findByName(String name) {
		return uniqueResult(namedQuery("User.findByName").setParameter("name", name));
	}

	/**
	 * Creates a new Session that finds a User in the database based on its email
	 * 
	 * @param email email to be found
	 * @return the found User
	 */
	public User findByEmail(String email) {
		return uniqueResult(namedQuery("User.findByEmail").setParameter("email", email));
	}

	/**
	 * Creates a new Session that finds all users in the database based on administrator rights
	 * 
	 * @param admin administrator rights to be checked and found
	 * @return list of all users with given value of administrator rights
	 */
	public List<User> findAllByAdmin(boolean admin) {
		return list(namedQuery("User.findByAdmin").setParameter("admin", admin));
	}

	/**
	 * Creates a new Session that finds all users in the database
	 * 
	 * @return list of all users
	 */
	public List<User> findAll() {
		return list(namedQuery("User.findAll"));
	}

	/**
	 * Removes a given User from the current Session
	 * 
	 * @param user User to be removed
	 */
	public void delete(User user) {
		currentSession().delete(user);
	}
}
