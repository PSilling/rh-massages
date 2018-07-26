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

package net.rh.massages.db;

import io.dropwizard.hibernate.AbstractDAO;
import java.util.List;
import net.rh.massages.core.Facility;
import org.hibernate.SessionFactory;

/**
 * Facility database access class.
 *
 * @author psilling
 * @since 1.0.0
 */
public class FacilityDao extends AbstractDAO<Facility> {

  /**
   * Constructor.
   *
   * @param sessionFactory {@link SessionFactory} to work with
   */
  public FacilityDao(SessionFactory sessionFactory) {
    super(sessionFactory);
  }

  /**
   * Creates a new session and adds a given {@link Facility} to the database.
   *
   * @param facility {@link Facility} to be created
   * @return the created {@link Facility}
   */
  public Facility create(Facility facility) {
    return persist(facility);
  }

  /**
   * Clears the current session and then updates a given {@link Facility} using a new session.
   *
   * @param facility updated {@link Facility}
   * @return the updated {@link Facility}
   */
  public Facility update(Facility facility) {
    currentSession().clear();
    return persist(facility);
  }

  /**
   * Creates a new session that finds a {@link Facility} in the database based on its ID.
   *
   * @param id ID to be found
   * @return the found {@link Facility}
   */
  public Facility findById(Long id) {
    return get(id);
  }

  /**
   * Creates a new session that finds all {@link Facility}s in the database.
   *
   * @return {@link List} of all found {@link Facility}s
   */
  @SuppressWarnings("unchecked")
  public List<Facility> findAll() {
    return list(namedQuery("Facility.findAll"));
  }

  /**
   * Creates a new session that finds a {@link Facility} in the database based on its name.
   *
   * @param name name to be found
   * @return the found {@link Facility}
   */
  @SuppressWarnings("unchecked")
  public Facility findByName(String name) {
    return uniqueResult(namedQuery("Facility.findByName").setParameter("name", name));
  }

  /**
   * Removes a given {@link Facility} from the current session.
   *
   * @param facility {@link Facility} to be removed
   */
  public void delete(Facility facility) {
    currentSession().delete(facility);
  }
}
