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
package net.rh.massages.core;

import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * Facility facility representation class
 *
 * @author psilling
 * @since 1.0.0
 */

@Entity
@Table(name = "Facilities")
@NamedQueries({
		@NamedQuery(name = "Facility.findAll", query = "SELECT facility FROM Facility facility ORDER BY facility.name ASC"),
		@NamedQuery(name = "Facility.findByName", query = "SELECT facility FROM Facility facility WHERE facility.name = :name") })
public class Facility {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@NotNull
	private long id; // id of the facility

	@Column(name = "name", unique = true)
	@NotEmpty
	private String name; // name of the massage

	/**
	 * Facility constructor
	 */
	public Facility() {
	}

	/**
	 * Parameterized Facility constructor
	 *
	 * @param name new Facility name
	 */
	public Facility(String name) {
		this.name = name;
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
	 * Hashing method
	 */
	@Override
	public int hashCode() {
		return Objects.hash(id, name);
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
		return String.format("Facility[id=%s, name=%s]", id, name);
	}
}
