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
package net.rh.massages.core;

import java.security.Principal;
import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * User user representation class
 * 
 * @author psilling
 * @since 1.0.0
 */

@Entity
@Table(name = "Users")
@NamedQueries({ @NamedQuery(name = "User.findAll", query = "SELECT user FROM User user"),
	@NamedQuery(name = "User.findByName", query = "SELECT user FROM User user WHERE user.name = :name"),
	@NamedQuery(name = "User.findByEmail", query = "SELECT user FROM User user WHERE user.email = :email"),
	@NamedQuery(name = "User.findByAdmin", query = "SELECT user FROM User user WHERE user.admin = :admin")})
public class User implements Principal {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@NotNull
	private long id; // id of the user

	@NotEmpty
	private String name; // name of the user

	@NotEmpty
	@Email
	private String email; // email of the user

	@NotNull
	private boolean admin; // whether the user is an administrator

	/**
	 * User constructor
	 */
	public User() {
	}

	/**
	 * User parameterized constructor
	 * 
	 * @param name new User name
	 * @param email new User email
	 * @param admin new User admin
	 */
	public User(String name, String email, boolean admin) {
		this.name = name;
		this.email = email;
		this.admin = admin;
	}

	/**
	 * Id getter
	 * 
	 * @return current id
	 */
	public long getId() {
		return id;
	}

	/**
	 * Id setter
	 * 
	 * @param id new id
	 */
	public void setId(long id) {
		this.id = id;
	}

	/**
	 * Name getter
	 * 
	 * @return current name
	 */
	public String getName() {
		return name;
	}

	/**
	 * Name setter
	 * 
	 * @param name new name
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * E-mail getter
	 * 
	 * @return current email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * E-mail setter
	 * 
	 * @param email new email
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * Admin getter
	 * 
	 * @return current admin
	 */
	public boolean getAdmin() {
		return admin;
	}

	/**
	 * Admin setter
	 * 
	 * @param admin new admin
	 */
	public void setAdmin(boolean admin) {
		this.admin = admin;
	}

	/**
	 * Hashing method
	 */
	@Override
	public int hashCode() {
		return Objects.hash(id, name, email);
	}

	/**
	 * Equalization method
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if ((obj == null) || (getClass() != obj.getClass())) {
			return false;
		}

		return Integer.compare(hashCode(), obj.hashCode()) == 0;
	}

	/**
	 * String conversion method
	 */
	@Override
	public String toString() {
		return String.format("User[id=%s, name=%s, email=%s]", id, name, email);
	}
}