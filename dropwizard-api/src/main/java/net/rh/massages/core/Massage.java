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

import java.util.Date;
import java.util.Objects;

import javax.annotation.Nullable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * Massage Massage representation class
 *
 * @author psilling
 * @since 1.0.0
 */

@Entity
@Table(name = "Massages")
@NamedQueries({ @NamedQuery(name = "Massage.findAll", query = "SELECT massage FROM Massage massage"),
		@NamedQuery(name = "Massage.findByDate", query = "SELECT massage FROM Massage massage WHERE massage.date = :date"),
		@NamedQuery(name = "Massage.findAllByMasseuse", query = "SELECT massage FROM Massage massage WHERE massage.masseuse = :masseuse"),
		@NamedQuery(name = "Massage.findAllByClient", query = "SELECT massage FROM Massage massage WHERE massage.client = :client"),
		@NamedQuery(name = "Massage.findAllByFacility", query = "SELECT massage FROM Massage massage WHERE massage.facility = :facility") })
public class Massage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@NotNull
	private long id; // id of the massage

	@NotNull
	private Date date; // date of the massage

	@NotEmpty
	private String masseuse; // masseuse that does the massage

	@Nullable
	private String client; // ID of the client taking the massage

	@ManyToOne
	@NotNull
	@OnDelete(action = OnDeleteAction.CASCADE)
	private Facility facility; // facility where the massage will be

	/**
	 * Massage constructor
	 */
	public Massage() {
	}

	/**
	 * Massage parameterized constructor
	 *
	 * @param date new Massage date
	 * @param masseuse new Massage masseuse
	 * @param client new Massage client
	 * @param facility new Massage facility
	 */
	public Massage(Date date, String masseuse, String client, Facility facility) {
		this.date = date;
		this.masseuse = masseuse;
		this.client = client;
		this.facility = facility;
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
	 * Date getter
	 *
	 * @return current date
	 */
	public Date getDate() {
		return date;
	}

	/**
	 * Date setter
	 *
	 * @param date new date
	 */
	public void setDate(Date date) {
		this.date = date;
	}

	/**
	 * Masseuse getter
	 *
	 * @return current masseuse
	 */
	public String getMasseuse() {
		return masseuse;
	}

	/**
	 * Masseuse setter
	 *
	 * @param masseuse
	 */
	public void setMasseuse(String masseuse) {
		this.masseuse = masseuse;
	}

	/**
	 * Client getter
	 *
	 * @return current client
	 */
	public String getClient() {
		return client;
	}

	/**
	 * Client setter
	 *
	 * @param client new client
	 */
	public void setUser(String client) {
		this.client = client;
	}

	/**
	 * Facility getter
	 *
	 * @return current facility
	 */
	public Facility getFacility() {
		return facility;
	}

	/**
	 * Facility setter
	 *
	 * @param facility new facility
	 */
	public void setFacility(Facility facility) {
		this.facility = facility;
	}

	/**
	 * Hashing method
	 */
	@Override
	public int hashCode() {
		return Objects.hash(id, date, masseuse, facility.toString());
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
		return String.format("Task[id=%s, date=%s, masseuse=%s, facility=%s]", id, date, masseuse, facility.toString());
	}
}
