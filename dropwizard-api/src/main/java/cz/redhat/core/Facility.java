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
 * Facility representation class.
 *
 * @author psilling
 * @since 1.0.0
 */
@Entity
@Table(name = "Facilities")
@NamedQueries({
    @NamedQuery(
        name = "Facility.findAll",
        query = "SELECT facility FROM Facility facility ORDER BY facility.name ASC"),
    @NamedQuery(
        name = "Facility.findByName",
        query = "SELECT facility FROM Facility facility WHERE facility.name = :name")
})
public class Facility {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @NotNull
  private long id; // ID of the Facility

  @Column(name = "name", unique = true, length = 64)
  @NotEmpty
  private String name; // name of the Facility

  /**
   * Constructor.
   */
  public Facility() {
  }

  /**
   * Constructor.
   *
   * @param name name of the Facility
   */
  public Facility(String name) {
    this.name = name;
  }

  /**
   * @return current value of {@link Facility} ID
   */
  public long getId() {
    return id;
  }

  /**
   * @param id new {@link Facility} ID to be set
   */
  public void setId(long id) {
    this.id = id;
  }

  /**
   * @return current value of {@link Facility} name
   */
  public String getName() {
    return name;
  }

  /**
   * @param name new {@link Facility} name to be set
   */
  public void setName(String name) {
    this.name = name;
  }

  /**
   * Hashes the {@link Facility} based on ID and name.
   */
  @Override
  public int hashCode() {
    return Objects.hash(id, name);
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
   * @return {@link Facility} converted to a String with format Facility[id=%s, name=%s]
   */
  @Override
  public String toString() {
    return String.format("Facility[id=%s, name=%s]", id, name);
  }
}
