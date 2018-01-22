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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

import java.util.List;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;

import io.dropwizard.testing.junit.DAOTestRule;
import net.rh.massages.core.Facility;

/**
 * Facility Data Access Object JUnit test class.
 *
 * @author psilling
 * @since 1.0.0
 */
public class FacilityDAOTest {

	@Rule
	public DAOTestRule daoTestRule = DAOTestRule.newBuilder().addEntityClass(Facility.class).build(); // database mock

	private FacilityDAO facilityDAO; // Facility data access object

	/**
	 * Creates {@link FacilityDAO} with current database session.
	 */
	@Before
	public void setUp() {
		facilityDAO = new FacilityDAO(daoTestRule.getSessionFactory());
	}

	/**
	 * Tests whether {@link Facility} creation works as intended.
	 */
	@Test
	public void testCreate() {
		final Facility facility = new Facility("Big Facility");
		final Facility createdFacility = daoTestRule.inTransaction(() -> facilityDAO.create(facility));

		assertEquals(facility, createdFacility);
	}

	/**
	 * Tests whether {@link Facility} updating works as intended.
	 */
	@Test
	public void testUpdate() {
		Facility facility = new Facility("Big Facility");
		final Facility updatedFacility = daoTestRule.inTransaction(() -> {
			facilityDAO.create(facility);
			facility.setName("Updated Facility");
			return facilityDAO.update(facility);
		});

		assertEquals(1, updatedFacility.getId());
		assertEquals("Updated Facility", updatedFacility.getName());
		assertEquals(facility, updatedFacility);
	}

	/**
	 * Tests whether {@link Facility} removal works as intended.
	 */
	@Test
	public void testDelete() {
		final Facility facility = new Facility("Big Facility");
		Facility removedFacility = daoTestRule.inTransaction(() -> {
			Facility deletedFacility = facilityDAO.create(facility);
			facilityDAO.delete(facility);
			return deletedFacility;
		});

		List<Facility> facilities = facilityDAO.findAll();

		assertNotNull(removedFacility);
		assertFalse(facilities.contains(facility));
	}

	/**
	 * Tests whether all {@link FacilityDAO} finding methods are working as
	 * intended.
	 */
	@Test
	public void testFind() {
		final Facility facility1 = new Facility("First Facility");
		final Facility facility2 = new Facility("Second Facility");
		daoTestRule.inTransaction(() -> {
			facilityDAO.create(facility1);
			facilityDAO.create(facility2);
		});

		Facility facilityById = facilityDAO.findById((long) 1);
		Facility facilityByName = facilityDAO.findByName("Second Facility");
		List<Facility> facilities = facilityDAO.findAll();

		assertEquals(facility1, facilityById);
		assertEquals(facility2, facilityByName);
		assertEquals(2, facilities.size());
	}
}