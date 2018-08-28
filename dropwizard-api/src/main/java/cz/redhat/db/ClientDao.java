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

package cz.redhat.db;

import io.dropwizard.hibernate.AbstractDAO;
import java.util.List;
import cz.redhat.core.Client;
import org.hibernate.SessionFactory;

/**
 * Client database access class.
 *
 * @author psilling
 * @since 1.2.1
 */
public class ClientDao extends AbstractDAO<Client> {

  /**
   * Constructor.
   *
   * @param sessionFactory {@link SessionFactory} to work with
   */
  public ClientDao(SessionFactory sessionFactory) {
    super(sessionFactory);
  }

  /**
   * Creates a new session and adds a given {@link Client} to the database.
   *
   * @param client {@link Client} to be created
   * @return the created {@link Client}
   */
  public Client create(Client client) {
    return persist(client);
  }

  /**
   * Clears the current session and then updates a given {@link Client} using a new session.
   *
   * @param client updated {@link Client}
   * @return the updated {@link Client}
   */
  public Client update(Client client) {
    currentSession().clear();
    return persist(client);
  }

  /**
   * Creates a new session that finds a {@link Client} in the database based on its subject.
   *
   * @param sub subject to be found
   * @return the found {@link Client}
   */
  public Client findBySub(String sub) {
    return get(sub);
  }

  /**
   * Creates a new session that finds all {@link Client}s in the database.
   *
   * @return {@link List} of all found {@link Client}s
   */
  @SuppressWarnings("unchecked")
  public List<Client> findAll() {
    return list(namedQuery("Client.findAll"));
  }

  /**
   * Creates a new session that finds all subscribed {@link Client}s in the database.
   *
   * @return {@link List} of all found {@link Client}s
   */
  @SuppressWarnings("unchecked")
  public List<Client> findAllSubscribed() {
    return list(namedQuery("Client.findAllSubscribed"));
  }

  /**
   * Removes a given {@link Client} from the current session.
   *
   * @param client {@link Client} to be removed
   */
  public void delete(Client client) {
    currentSession().delete(client);
  }
}
