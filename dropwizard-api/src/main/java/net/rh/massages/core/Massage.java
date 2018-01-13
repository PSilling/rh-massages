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
		@NamedQuery(name = "Massage.findAllOld", query = "SELECT massage FROM Massage massage WHERE (massage.date < CURRENT_TIMESTAMP() AND massage.ending >= :from AND massage.date <= :to) AND (massage.client IS NULL OR :free = false) ORDER BY massage.date DESC"),
		@NamedQuery(name = "Massage.findAllByMasseuse", query = "SELECT massage FROM Massage massage WHERE massage.masseuse = :masseuse"),
		@NamedQuery(name = "Massage.findAllByClient", query = "SELECT massage FROM Massage massage WHERE massage.client = :client AND massage.ending > CURRENT_TIMESTAMP() ORDER BY massage.date ASC"),
		@NamedQuery(name = "Massage.findNewByFacility", query = "SELECT massage FROM Massage massage WHERE massage.facility = :facility AND (massage.ending > CURRENT_TIMESTAMP() AND massage.ending >= :from AND massage.date <= :to) AND (massage.client IS NULL OR :free = false) ORDER BY massage.date ASC") })
public class Massage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@NotNull
	private long id; // id of the massage

	@NotNull
	private Date date; // date of the massage

	@NotNull
	private Date ending; // ending of the massage

	@NotEmpty
	private String masseuse; // masseuse that does the massage

	@Nullable
	private String client; // ID of the client taking the massage

	@Nullable
	private String contact; // contact info of the client taking the massage

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
	 * @param ending new Massage ending
	 * @param masseuse new Massage masseuse
	 * @param client new Massage client
	 * @param contact new Massage contact
	 * @param facility new Massage facility
	 */
	public Massage(Date date, Date ending, String masseuse, String client, String contact, Facility facility) {
		this.date = date;
		this.ending = ending;
		this.masseuse = masseuse;
		this.client = client;
		this.contact = contact;
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
	 * Ending getter
	 *
	 * @return current ending
	 */
	public Date getEnding() {
		return ending;
	}

	/**
	 * Ending setter
	 *
	 * @param ending new ending
	 */
	public void setEnding(Date ending) {
		this.ending = ending;
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
	public void setClient(String client) {
		this.client = client;
	}

	/**
	 * Contact getter
	 *
	 * @return current contact
	 */
	public String getContact() {
		return contact;
	}

	/**
	 * Contact setter
	 *
	 * @param contact new contact
	 */
	public void setContact(String contact) {
		this.contact = contact;
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
	 * Returns the time difference between Massage ending and date
	 *
	 * @return the difference in milliseconds
	 */
	public long calculateDuration() {
		return ending.getTime() - date.getTime();
	}

	/**
	 * Checks and possibly swaps date with ending if ending date is before date
	 */
	public void checkDates() {
		if (date.after(ending)) {
			Date dateHolder = date;
			date = ending;
			ending = dateHolder;
		}
	}

	/**
	 * Compares date and ending with another Massage and checks if they collide with
	 * each other
	 *
	 * @param massage Massage to compare dates with
	 * @return true if collides, false otherwise
	 */
	public boolean datesCollide(Massage massage) {
		if (date.compareTo(massage.getEnding()) <= 0 && ending.compareTo(massage.getDate()) >= 0) {
			return true;
		}
		return false;
	}

	/**
	 * Hashing method
	 */
	@Override
	public int hashCode() {
		return Objects.hash(id, date, ending, masseuse, facility.toString());
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
		return String.format("Task[id=%s, date=%s, endDate=%s, masseuse=%s, contact=%s, facility=%s]", id, date, ending,
				masseuse, contact, facility.toString());
	}
}
