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

import cz.redhat.core.Facility;
import io.dropwizard.hibernate.AbstractDAO;
import java.text.Normalizer;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import cz.redhat.core.Client;
import cz.redhat.core.Massage;
import org.hibernate.SessionFactory;

/**
 * Massage database access class.
 *
 * @author psilling
 * @since 1.0.0
 */
public class MassageDao extends AbstractDAO<Massage> {

  /**
   * Constructor.
   *
   * @param sessionFactory {@link SessionFactory} to work with
   */
  public MassageDao(SessionFactory sessionFactory) {
    super(sessionFactory);
  }

  /**
   * Creates a new session and adds a given {@link Massage} to the database.
   *
   * @param massage {@link Massage} to be created
   * @return the created {@link Massage}
   */
  public Massage create(Massage massage) {
    return persist(massage);
  }

  /**
   * Clears the current session and then updates a given {@link Massage} with a new session.
   *
   * @param massage updated {@link Massage}
   * @return the updated {@link Massage}
   */
  public Massage update(Massage massage) {
    currentSession().clear();
    return persist(massage);
  }

  /**
   * Creates a new session that finds a {@link Massage} in the database based on its ID.
   *
   * @param id ID to be found
   * @return the found {@link Massage}
   */
  public Massage findById(Long id) {
    return get(id);
  }

  /**
   * Creates a new session that finds all {@link Massage}s in the database
   *
   * @return {@link List} of all {@link Massage}s
   */
  @SuppressWarnings("unchecked")
  public List<Massage> findAll() {
    return list(namedQuery("Massage.findAll"));
  }

  /**
   * Creates a new session that finds all {@link Massage}s in the database that have already passed.
   * The list is searched with the included search pattern and ordered by date and doesn't include
   * any upcoming {@link Massage}s. Search is accent and case insensitive.
   *
   * @param search  value of the search pattern
   * @param free    true if only unassigned {@link Massage}s should be returned
   * @param from    limits results to be after the given {@link Date}
   * @param to      limits results to be before the given {@link Date}
   * @param page    current page number; for pages lower than 1 doesn't use pagination and returns
   *                all results
   * @param perPage number of {@link Massage}s to return per each page
   * @return {@link Map} with {@link List} of all found {@link Massage}s and their total count
   *     without limitations
   */
  @SuppressWarnings("unchecked")
  public Map<String, Object> searchOld(
      String search, boolean free, Date from, Date to, int page, int perPage) {
    List<Massage> massages;

    // Correct possible null from and to values.
    if (from == null) {
      from = new Date(0);
    }
    if (to == null) {
      to = new Date();
    }

    // Get all fitting Massages from database without applying the search pattern.
    massages =
        list(
            namedQuery("Massage.findAllOld")
                .setParameter("free", free)
                .setParameter("from", from)
                .setParameter("to", to));

    // Search in the results given by the query (enables case and accent insensitive
    // comparison not supported by Hibernate).
    if (search != null && !search.equals("")) {
      search = convertToCiAi(search);
      String searchString;
      for (int i = 0; i < massages.size(); i++) {
        // Compare with the value of masseuse, Facility name and generated contact.
        searchString = massages.get(i).getMasseuse() + massages.get(i).getFacility().getName();

        Client client = massages.get(i).getClient();
        if (client != null) {
          searchString += client.createContact();
        }

        // Remove from the List if the search pattern isn't contained in the comparison
        // String.
        if (!convertToCiAi(searchString).contains(search)) {
          massages.remove(massages.get(i));
          i--;
        }
      }
    }

    Map<String, Object> response = new HashMap<>(); // the result Map

    // Add the total number of found Massages to the response Map for paging
    // coordination.
    response.put("totalCount", massages.size());

    // Remove Massages that aren't on the given page number based on the number of
    // Massages per page.
    if (page > 0) {
      if ((perPage * (page - 1)) >= massages.size()) {
        page = (int) Math.ceil(massages.size() / ((double) perPage));
        if (page < 1) {
          page = 1;
        }
      }
      massages.subList(0, (perPage * (page - 1))).clear();
      if (perPage < massages.size()) {
        massages.subList(perPage, massages.size()).clear();
      }
    }

    // Add resulting Massages to the response Map.
    response.put("massages", massages);

    return response;
  }

  /**
   * Creates a new session that finds all {@link Massage}s in the database based on their masseuse.
   *
   * @param masseuse masseuse of the {@link Massage}s that are to be found
   * @return {@link List} of all found {@link Massage}s
   */
  @SuppressWarnings("unchecked")
  public List<Massage> findAllByMasseuse(String masseuse) {
    return list(namedQuery("Massage.findAllByMasseuse").setParameter("masseuse", masseuse));
  }

  /**
   * Creates a new session that finds a {@link Massage} in the database based on their {@link
   * Client}. The {@link List} is ordered by date and doesn't include old {@link Massage}s.
   *
   * @param client {@link Client} of the {@link Massage}s the are to be found
   * @return {@link List} of all found {@link Massage}s
   */
  @SuppressWarnings("unchecked")
  public List<Massage> findAllByClient(Client client) {
    return list(namedQuery("Massage.findAllByClient").setParameter("client", client));
  }

  /**
   * Creates a new session that finds a {@link Massage} in the database based on their {@link
   * Facility}. The {@link List} is searched with the included search pattern and ordered by date
   * and doesn't include old {@link Massage}s. Search is accent and case insensitive.
   *
   * @param facility {@link Facility} of the {@link Massage}s the are to be found
   * @param search   value of the search pattern; for -1 all results are returned
   * @param free     true if only unassigned {@link Massage}s should be found
   * @param from     limits results to be after the given {@link Date}
   * @param to       limits results to be before the given {@link Date}
   * @param page     current page number; for pages lower than 1 doesn't use pagination and returns
   *                 all results
   * @param perPage  number of {@link Massage}s to return per each page
   * @return {@link Map} with {@link List} of all found Massages and their total count without
   *     limitations
   */
  @SuppressWarnings("unchecked")
  public Map<String, Object> searchNewByFacility(
      Facility facility, String search, boolean free, Date from, Date to, int page, int perPage) {
    List<Massage> massages;

    // Correct possible null from and to values.
    if (from == null) {
      from = new Date();
    }
    if (to == null) {
      to = new Date(from.getTime() + 86400000); // one day later
    }

    // Get all fitting Massages from database without applying the search pattern.
    massages =
        list(
            namedQuery("Massage.findNewByFacility")
                .setParameter("facility", facility)
                .setParameter("free", free)
                .setParameter("from", from)
                .setParameter("to", to));

    // Search in the results given by the query (enables case and accent insensitive
    // comparison not supported by Hibernate).
    if (search != null && !search.equals("")) {
      search = convertToCiAi(search);
      String searchString;
      for (int i = 0; i < massages.size(); i++) {
        // Compare with the value of masseuse and generated contact.
        searchString = massages.get(i).getMasseuse();

        Client client = massages.get(i).getClient();
        if (client != null) {
          searchString += client.createContact();
        }

        // Remove from the List if the search pattern isn't contained in the comparison
        // String.
        if (!convertToCiAi(searchString).contains(search)) {
          massages.remove(massages.get(i));
          i--;
        }
      }
    }

    Map<String, Object> response = new HashMap<>(); // the result Map

    // Add the total number of found Massages to the response Map for paging
    // coordination.
    response.put("totalCount", massages.size());

    // Remove Massages that aren't on the given page number based on the number of
    // Massages per page.
    if (page > 0) {
      if ((perPage * (page - 1)) >= massages.size()) {
        page = (int) Math.ceil(massages.size() / ((double) perPage));
        if (page < 1) {
          page = 1;
        }
      }
      massages.subList(0, (perPage * (page - 1))).clear();
      if (perPage < massages.size()) {
        massages.subList(perPage, massages.size()).clear();
      }
    }

    // Add resulting Massages to the response Map.
    response.put("massages", massages);

    return response;
  }

  /**
   * Removes a given {@link Massage} from the current session.
   *
   * @param massage {@link Massage} to be removed
   */
  public void delete(Massage massage) {
    currentSession().delete(massage);
  }

  /**
   * Makes a {@link String} case and accent insensitive using {@link Normalizer}.
   *
   * @param string {@link String} to be converted
   * @return the {@link String} converted to be CI and AI
   */
  private String convertToCiAi(String string) {
    return Normalizer.normalize(string, Normalizer.Form.NFD)
        .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
        .toLowerCase();
  }
}
