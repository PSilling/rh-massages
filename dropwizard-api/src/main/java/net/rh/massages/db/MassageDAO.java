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
package net.rh.massages.db;

import java.util.Date;
import java.util.List;

import org.hibernate.SessionFactory;

import io.dropwizard.hibernate.AbstractDAO;
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
	 * Parameterized MassageDAO constructor
	 *
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
	 * Creates a new Session that finds a Massage in the database based on its id
	 *
	 * @param id id to be found
	 * @return the found Massage
	 */
	public Massage findById(Long id) {
		return get(id);
	}

	/**
	 * Creates a new Session that finds a Massage in the database based on its Date
	 *
	 * @param date Date to be found
	 * @return the found Massage
	 */
	public Massage findByDate(Date date) {
		return uniqueResult(namedQuery("Massage.findByDate").setParameter("date", date));
	}

	/**
	 * Creates a new Session that finds all massages in the database based on their
	 * masseuse
	 *
	 * @param masseuse masseuse of the massages that are to be found
	 * @return list of all found massages
	 */
	public List<Massage> findAllByMasseuse(String masseuse) {
		return list(namedQuery("Massage.findAllByMasseuse").setParameter("masseuse", masseuse));
	}

	/**
	 * Creates a new Session that finds a Massage in the database based on their
	 * User
	 *
	 * @param client client ID of the massages the are to be found
	 * @return list of all found massages
	 */
	public List<Massage> findAllByClient(String client) {
		return list(namedQuery("Massage.findAllByClient").setParameter("client", client));
	}

	/**
	 * Creates a new Session that finds a Massage in the database based on their
	 * Facility
	 *
	 * @param facility Facility of the massages the are to be found
	 * @return list of all found massages
	 */
	public List<Massage> findAllByFacility(Facility facility) {
		return list(namedQuery("Massage.findAllByFacility").setParameter("facility", facility));
	}

	/**
	 * Creates a new Session that finds all massages in the database
	 *
	 * @return list of all massages
	 */
	public List<Massage> findAll() {
		return list(namedQuery("Massage.findAll"));
	}

	/**
	 * Removes a given Massage from the current Session
	 *
	 * @param massage Massage to be removed
	 */
	public void delete(Massage massage) {
		currentSession().delete(massage);
	}
}
