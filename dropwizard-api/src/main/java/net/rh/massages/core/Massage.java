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
	private long id; // id of the Massage

	@NotNull
	private Date date; // date of the Massage

	@NotNull
	private Date ending; // ending of the Massage

	@NotEmpty
	private String masseuse; // masseuse that does the Massage

	@ManyToOne
	@Nullable
	private Client client; // the Client taking the Massage

	@ManyToOne
	@NotNull
	@OnDelete(action = OnDeleteAction.CASCADE)
	private Facility facility; // Facility where the Massage will be stationed

	public Massage() {
	}

	/**
	 * @param date new Massage date
	 * @param ending new Massage ending
	 * @param masseuse new Massage masseuse
	 * @param client new Massage client
	 * @param facility new Massage facility
	 */
	public Massage(Date date, Date ending, String masseuse, Client client, Facility facility) {
		this.date = date;
		this.ending = ending;
		this.masseuse = masseuse;
		this.client = client;
		this.facility = facility;
	}

	/**
	 * @return current value of Massage id
	 */
	public long getId() {
		return id;
	}

	/**
	 * @param id new Massage ID to be set
	 */
	public void setId(long id) {
		this.id = id;
	}

	/**
	 * @return current value of Massage date
	 */
	public Date getDate() {
		return date;
	}

	/**
	 * @param date new Massage Date to be set
	 */
	public void setDate(Date date) {
		this.date = date;
	}

	/**
	 * @return current value of Massage ending
	 */
	public Date getEnding() {
		return ending;
	}

	/**
	 * @param ending new Massage ending to be set
	 */
	public void setEnding(Date ending) {
		this.ending = ending;
	}

	/**
	 * @return current value of Massage masseuse
	 */
	public String getMasseuse() {
		return masseuse;
	}

	/**
	 * @param masseuse new Massage masseuse to be set
	 */
	public void setMasseuse(String masseuse) {
		this.masseuse = masseuse;
	}

	/**
	 * @return current value of Massage client
	 */
	public Client getClient() {
		return client;
	}

	/**
	 * @param client new Massage Client to be set
	 */
	public void setClient(Client client) {
		this.client = client;
	}

	/**
	 * @return current value of Massage facility
	 */
	public Facility getFacility() {
		return facility;
	}

	/**
	 * @param facility new Massage Facility to be set
	 */
	public void setFacility(Facility facility) {
		this.facility = facility;
	}

	/**
	 * Calculates the time difference between Massage ending and date
	 *
	 * @return the difference in milliseconds
	 */
	public long calculateDuration() {
		return ending.getTime() - date.getTime();
	}

	/**
	 * Checks (and possibly also swaps) date with ending if ending date is before
	 * date
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
	 * Hashes the Massage based on id, date, ending, masseuse and facility
	 */
	@Override
	public int hashCode() {
		return Objects.hash(id, date, ending, masseuse, facility.toString());
	}

	/**
	 * @return true if hashCode comparison matches both this and the given object
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
	 * @return Client converted to a String with format Massage[id, date, ending,
	 *         masseuse, clientSub, facility]
	 */
	@Override
	public String toString() {
		return String.format("Massage[id=%s, date=%s, ending=%s, masseuse=%s, clientSub=%s, facility=%s]", id, date,
				ending, masseuse, client.getSub(), facility.toString());
	}
}
