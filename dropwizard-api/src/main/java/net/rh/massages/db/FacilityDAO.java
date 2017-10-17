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

import io.dropwizard.hibernate.AbstractDAO;

import java.util.List;

import net.rh.massages.core.Facility;

import org.hibernate.SessionFactory;

/**
 * FacilityDAO Facility Data Access Object
 * 
 * @author psilling
 * @since 1.0.0
 *
 */

public class FacilityDAO extends AbstractDAO<Facility> {

	/**
	 * Parameterized FacilityDAO constructor
	 * 
	 * @param sessionFactory new FacilityDAO SessionFactory
	 */
	public FacilityDAO(SessionFactory sessionFactory) {
		super(sessionFactory);
	}

	/**
	 * Creates a new Session and adds a given Facility to the database
	 * 
	 * @param facility Facility to be created
	 * @return the created Facility
	 */
	public Facility create(Facility facility) {
		return persist(facility);
	}

	/**
	 * Clears the current Session and then updates a given Facility with a new Session
	 * 
	 * @param facility updated Facility
	 * @return the updated Facility
	 */
	public Facility update(Facility facility) {
		currentSession().clear();
		return persist(facility);
	}

	/**
	 * Creates a new Session that finds a Facility in the database based on its id
	 * 
	 * @param id id to be found
	 * @return the found Facility
	 */
	public Facility findById(Long id) {
		return get(id);
	}

	/**
	 * Creates a new Session that finds a Facility in the database based on its name
	 * 
	 * @param name name to be found
	 * @return the found Facility
	 */
	public Facility findByName(String name) {
		return uniqueResult(namedQuery("Facility.findByName").setParameter("name", name));
	}

	/**
	 * Creates a new Session that finds all facilities in the database
	 * 
	 * @return list of all facilities
	 */
	public List<Facility> findAll() {
		return list(namedQuery("Facility.findAll"));
	}

	/**
	 * Removes a given Facility from the current Session
	 * 
	 * @param facility Facility to be removed
	 */
	public void delete(Facility facility) {
		currentSession().delete(facility);
	}
}
