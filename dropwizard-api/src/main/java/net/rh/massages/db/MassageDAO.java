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
package net.rh.massages.db;

import java.text.Normalizer;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.SessionFactory;

import io.dropwizard.hibernate.AbstractDAO;
import net.rh.massages.core.Client;
import net.rh.massages.core.Facility;
import net.rh.massages.core.Massage;

/**
 * MassageDAO Massage Data Access Object
 *
 * @author psilling
 * @since 1.0.0
 *
 */

public class MassageDAO extends AbstractDAO<Massage> {

	/**
	 * @param sessionFactory new MassageDAO SessionFactory
	 */
	public MassageDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}

	/**
	 * Creates a new Session and adds a given Massage to the database
	 *
	 * @param massage Massage to be created
	 * @return the created Massage
	 */
	public Massage create(Massage massage) {
		return persist(massage);
	}

	/**
	 * Clears the current Session and then updates a given Massage with a new
	 * Session
	 *
	 * @param massage updated Massage
	 * @return the updated Massage
	 */
	public Massage update(Massage massage) {
		currentSession().clear();
		return persist(massage);
	}

	/**
	 * Creates a new Session that finds a Massage in the database based on its ID
	 *
	 * @param id ID to be found
	 * @return the found Massage
	 */
	public Massage findById(Long id) {
		return get(id);
	}

	/**
	 * Creates a new Session that finds all Massages in the database
	 *
	 * @return list of all Massages
	 */
	@SuppressWarnings("unchecked")
	public List<Massage> findAll() {
		return list(namedQuery("Massage.findAll"));
	}

	/**
	 * Creates a new Session that finds all Massages in the database that have
	 * already passed. The list is searched with the included search pattern and
	 * ordered by date and doesn't include upcoming Massages. Search is accent and
	 * case insensitive.
	 *
	 * @param search value of the search pattern
	 * @param free true if only unassigned Massages should be found
	 * @param from limits results to be after the given Date
	 * @param to limits results to be before the given Date
	 * @param page current page number; for pages lower than 1 doesn't use
	 *            pagination
	 * @param perPage number of Massages to return per each page
	 * @return map with list of all found Massages and their total count without
	 *         limit
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> searchOld(String search, boolean free, Date from, Date to, int page, int perPage) {
		Map<String, Object> response = new HashMap<>();
		List<Massage> massages;
		if (from == null) {
			from = new Date(0);
		}
		if (to == null) {
			to = new Date();
		}

		massages = list(namedQuery("Massage.findAllOld").setParameter("free", free).setParameter("from", from)
				.setParameter("to", to));

		// search in the results given by the query (enables case and accent insensitive
		// comparison)
		if (search != null && search != "") {
			search = convertToCIAI(search);
			String searchString;
			for (int i = 0; i < massages.size(); i++) {
				searchString = massages.get(i).getMasseuse() + massages.get(i).getFacility().getName();
				if (massages.get(i).getClient() != null) {
					searchString += massages.get(i).getClient().createContact();
				}
				if (!convertToCIAI(searchString).contains(search)) {
					massages.remove(massages.get(i));
					i--;
				}
			}
		}

		response.put("totalCount", massages.size());
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
		response.put("massages", massages);

		return response;
	}

	/**
	 * Creates a new Session that finds all Massages in the database based on their
	 * masseuse
	 *
	 * @param masseuse masseuse of the Massages that are to be found
	 * @return list of all found Massages
	 */
	@SuppressWarnings("unchecked")
	public List<Massage> findAllByMasseuse(String masseuse) {
		return list(namedQuery("Massage.findAllByMasseuse").setParameter("masseuse", masseuse));
	}

	/**
	 * Creates a new Session that finds a Massage in the database based on their
	 * Client user. The list is ordered by date and doesn't include old Massages.
	 *
	 * @param client Client of the Massages the are to be found
	 * @return list of all found Massages
	 */
	@SuppressWarnings("unchecked")
	public List<Massage> findAllByClient(Client client) {
		return list(namedQuery("Massage.findAllByClient").setParameter("client", client));
	}

	/**
	 * Creates a new Session that finds a Massage in the database based on their
	 * Facility. The list is searched with the included search pattern and ordered
	 * by date and doesn't include old Massages. Search is accent and case
	 * insensitive.
	 *
	 * @param facility Facility of the Massages the are to be found
	 * @param search value of the search pattern; for -1 all results are returned
	 * @param free true if only unassigned Massages should be found
	 * @param from limits results to be after the given Date
	 * @param to limits results to be before the given Date
	 * @param page current page number; for pages lower than 1 doesn't use
	 *            pagination
	 * @param perPage number of Massages to return per each page
	 * @return map with list of all found Massages and their total count without
	 *         limit
	 */
	@SuppressWarnings("unchecked")
	public Map<String, Object> searchNewByFacility(Facility facility, String search, boolean free, Date from, Date to,
			int page, int perPage) {
		Map<String, Object> response = new HashMap<>();
		List<Massage> massages;
		if (from == null) {
			from = new Date();
		}
		if (to == null) {
			to = new Date(from.getTime() + 86400000); // a day later
		}

		massages = list(namedQuery("Massage.findNewByFacility").setParameter("facility", facility)
				.setParameter("free", free).setParameter("from", from).setParameter("to", to));

		// search in the results given by the query (enables case and accent insensitive
		// comparison)
		if (search != null && search != "") {
			search = convertToCIAI(search);
			String searchString;
			for (int i = 0; i < massages.size(); i++) {
				searchString = massages.get(i).getMasseuse();
				if (massages.get(i).getClient() != null) {
					searchString += massages.get(i).getClient().createContact();
				}
				if (!convertToCIAI(searchString).contains(search)) {
					massages.remove(massages.get(i));
					i--;
				}
			}
		}

		response.put("totalCount", massages.size());
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
		response.put("massages", massages);

		return response;
	}

	/**
	 * Removes a given Massage from the current Session
	 *
	 * @param massage Massage to be removed
	 */
	public void delete(Massage massage) {
		currentSession().delete(massage);
	}

	/**
	 * Makes a string case and accent insensitive
	 *
	 * @param string string to be converted
	 * @return the string converted to be CI and AI
	 */
	public String convertToCIAI(String string) {
		return Normalizer.normalize(string, Normalizer.Form.NFD).replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
				.toLowerCase();
	}
}
