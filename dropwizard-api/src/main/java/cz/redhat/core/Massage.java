/*
  Copyright (C) 2017 Petr Silling

  <p>This program is free software: you can redistribute it and/or modify it under the terms of the
  GNU General Public License as published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.

  <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
  without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  <p>You should have received a copy of the GNU General Public License along with this program. If
  not, see <http://www.gnu.org/licenses/>.
*/

package cz.redhat.core;

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

/**
 * Massage representation class.
 *
 * @author psilling
 * @since 1.0.0
 */
@Entity
@Table(name = "Massages")
@NamedQueries({
    @NamedQuery(name = "Massage.findAll", query = "SELECT massage FROM Massage massage"),
    @NamedQuery(
        name = "Massage.findAllOld",
        query =
            "SELECT massage FROM Massage massage WHERE (massage.date < CURRENT_TIMESTAMP() AND "
                + "massage.ending >= :from AND massage.date <= :to) AND (massage.client IS NULL OR "
                + ":free = false) ORDER BY massage.date DESC"),
    @NamedQuery(
        name = "Massage.findAllByMasseuse",
        query = "SELECT massage FROM Massage massage WHERE massage.masseuse = :masseuse"),
    @NamedQuery(
        name = "Massage.findNewByMasseuse",
        query =
            "SELECT massage FROM Massage massage WHERE massage.masseuse = :masseuse AND "
                + "massage.ending > CURRENT_TIMESTAMP() ORDER BY massage.date ASC"),
    @NamedQuery(
        name = "Massage.findAllByClient",
        query =
            "SELECT massage FROM Massage massage WHERE massage.client = :client AND "
                + "massage.ending > CURRENT_TIMESTAMP() ORDER BY massage.date ASC"),
    @NamedQuery(
        name = "Massage.findAllNewByFacility",
        query =
            "SELECT massage FROM Massage massage WHERE massage.facility = :facility AND "
                + "massage.ending > CURRENT_TIMESTAMP() AND "
                + "(massage.client IS NULL OR :free = false) "
                + "ORDER BY massage.date ASC"),
    @NamedQuery(
        name = "Massage.findNewByFacility",
        query =
            "SELECT massage FROM Massage massage WHERE massage.facility = :facility AND "
                + "(massage.ending > CURRENT_TIMESTAMP() AND massage.ending >= :from AND "
                + "massage.date <= :to) AND (massage.client IS NULL OR :free = false) "
                + "ORDER BY massage.date ASC")
})
public class Massage {

  @SuppressWarnings("unused")
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @NotNull
  private long id; // ID of the Massage

  @NotNull
  private Date date; // start date of the Massage

  @NotNull
  private Date ending; // ending date of the Massage

  @ManyToOne
  @NotNull
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Client masseuse; // masseur or masseuse that does the Massage

  @ManyToOne
  @Nullable
  private Client client; // the Client taking the Massage

  @ManyToOne
  @NotNull
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Facility facility; // Facility where the Massage is stationed

  /**
   * Constructor.
   */
  public Massage() {
  }

  /**
   * Constructor.
   *
   * @param date     start date of the Massage
   * @param ending   ending date of the Massage
   * @param masseuse masseur or masseuse that does the Massage
   * @param client   the {@link Client} taking the Massage
   * @param facility {@link Facility} where the Massage is stationed
   */
  public Massage(Date date, Date ending, Client masseuse, @Nullable Client client,
                 Facility facility) {
    this.date = date;
    this.ending = ending;
    this.masseuse = masseuse;
    this.client = client;
    this.facility = facility;
  }

  /**
   * @return current value of {@link Massage} ID
   */
  public long getId() {
    return id;
  }

  /**
   * @return current value of {@link Massage} date
   */
  public Date getDate() {
    return date;
  }

  /**
   * @param date new {@link Massage} date to be set
   */
  public void setDate(Date date) {
    this.date = date;
  }

  /**
   * @return current value of {@link Massage} ending
   */
  public Date getEnding() {
    return ending;
  }

  /**
   * @param ending new {@link Massage} ending to be set
   */
  public void setEnding(Date ending) {
    this.ending = ending;
  }

  /**
   * @return current value of {@link Massage} masseuse
   */
  public Client getMasseuse() {
    return masseuse;
  }

  /**
   * @param masseuse new {@link Massage} masseuse to be set
   */
  public void setMasseuse(Client masseuse) {
    this.masseuse = masseuse;
  }

  /**
   * @return current value of {@link Massage} {@link Client}
   */
  @Nullable
  public Client getClient() {
    return client;
  }

  /**
   * @return current value of {@link Massage} {@link Facility}
   */
  public Facility getFacility() {
    return facility;
  }

  /**
   * @param facility new {@link Massage} {@link Facility} to be set
   */
  public void setFacility(Facility facility) {
    this.facility = facility;
  }

  /**
   * Calculates the time difference between Massage ending and date.
   *
   * @return the difference in milliseconds
   */
  public long calculateDuration() {
    return ending.getTime() - date.getTime();
  }

  /**
   * Checks (and possibly also swaps) date with ending if ending date is before date.
   */
  public void checkDates() {
    if (date.after(ending)) {
      Date dateHolder = date;
      date = ending;
      ending = dateHolder;
    }
  }

  /**
   * Compares date and ending with another {@link Massage} and checks whether they collide with each
   * other.
   *
   * @param massage {@link Massage} to compare dates with
   * @return true if collides, false otherwise
   */
  public boolean datesCollide(Massage massage) {
    return date.compareTo(massage.getEnding()) <= 0 && ending.compareTo(massage.getDate()) >= 0;
  }

  /**
   * Hashes the {@link Massage} based on ID, date, ending, masseuse and {@link Facility}
   */
  @Override
  public int hashCode() {
    return Objects.hash(id, date, ending, masseuse.toString(), facility.toString());
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
   * @return {@link Massage} converted to a String with format Massage[id, date, ending, masseuse,
   *     clientSub, facility]
   */
  @Override
  public String toString() {
    return String.format(
        "Massage[id=%s, date=%s, ending=%s, masseuse=%s, clientSub=%s, facility=%s]", id, date,
        ending, masseuse.toString(), client != null ? client.getSub() : null, facility.toString());
  }
}
