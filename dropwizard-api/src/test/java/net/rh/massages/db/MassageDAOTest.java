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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

import java.util.Date;
import java.util.List;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;

import io.dropwizard.testing.junit.DAOTestRule;
import net.rh.massages.core.Facility;
import net.rh.massages.core.Massage;

/**
 * MassageDAOTest Massage Data Access Object JUnit test class
 *
 * @author psilling
 * @since 1.0.0
 *
 */

public class MassageDAOTest {

	@Rule
	public DAOTestRule daoTestRule = DAOTestRule.newBuilder().addEntityClass(Facility.class)
			.addEntityClass(Massage.class).build(); // database mock

	private FacilityDAO facilityDAO; // facility data access object
	private MassageDAO massageDAO; // massage data access object

	/**
	 * Creates MassageDAO with current database Session
	 *
	 * @throws Exception
	 */
	@Before
	public void setUp() throws Exception {
		facilityDAO = new FacilityDAO(daoTestRule.getSessionFactory());
		massageDAO = new MassageDAO(daoTestRule.getSessionFactory());
	}

	/**
	 * Tests whether Massage creation works as intended.
	 */
	@Test
	public void testCreate() {
		final Facility facility = daoTestRule.inTransaction(() -> {
			facilityDAO.create(new Facility("Big Facility"));
			return facilityDAO.findById((long) 1);
		});
		final Massage massage = new Massage(new Date(0), "Great Masseuse", null, facility);
		final Massage createdMassage = daoTestRule.inTransaction(() -> {
			return massageDAO.create(massage);
		});

		assertEquals(massage, createdMassage);
	}

	/**
	 * Tests whether Massage updating works as intended.
	 */
	@Test
	public void testUpdate() {
		final Facility facility1 = daoTestRule.inTransaction(() -> {
			facilityDAO.create(new Facility("First Facility"));
			return facilityDAO.findById((long) 1);
		});
		final Facility facility2 = daoTestRule.inTransaction(() -> {
			facilityDAO.create(new Facility("Second Facility"));
			return facilityDAO.findById((long) 2);
		});
		Massage massage = new Massage(new Date(0), "Great Masseuse", null, facility1);
		final Massage updatedMassage = daoTestRule.inTransaction(() -> {
			massageDAO.create(massage);
			massage.setDate(new Date(1000));
			massage.setMasseuse("Updated Masseuse");
			massage.setClient("Client");
			massage.setFacility(facility2);
			return massageDAO.update(massage);
		});

		assertEquals(1, updatedMassage.getId());
		assertEquals(new Date(1000), updatedMassage.getDate());
		assertEquals("Updated Masseuse", updatedMassage.getMasseuse());
		assertEquals("Client", updatedMassage.getClient());
		assertEquals(facility2, updatedMassage.getFacility());
		assertEquals(massage, updatedMassage);
	}

	/**
	 * Tests whether Massage removal works as intended.
	 */
	@Test
	public void testDelete() {
		final Facility facility = daoTestRule.inTransaction(() -> {
			facilityDAO.create(new Facility("Big Facility"));
			return facilityDAO.findById((long) 1);
		});
		final Massage massage = new Massage(new Date(0), "Great Masseuse", null, facility);
		Massage removedMassage = daoTestRule.inTransaction(() -> {
			Massage deletedMassage = massageDAO.create(massage);
			massageDAO.delete(massage);
			return deletedMassage;
		});

		List<Massage> massages = massageDAO.findAll();

		assertNotNull(removedMassage);
		assertFalse(massages.contains(massage));
	}

	/**
	 * Tests whether all MassageDAO finding methods are working as intended.
	 */
	@Test
	public void testFind() {
		final Facility facility = daoTestRule.inTransaction(() -> {
			facilityDAO.create(new Facility("Big Facility"));
			return facilityDAO.findById((long) 1);
		});
		final Massage massage1 = new Massage(new Date(0), "First Masseuse", null, facility);
		final Massage massage2 = new Massage(new Date(1000), "Second Masseuse", "Client", facility);
		daoTestRule.inTransaction(() -> {
			massageDAO.create(massage1);
			massageDAO.create(massage2);
		});

		Massage massageById = massageDAO.findById((long) 1);
		Massage massageByDate = massageDAO.findByDate((new Date(1000)));
		List<Massage> massagesByMasseuse = massageDAO.findAllByMasseuse("First Masseuse");
		List<Massage> massagesByUser = massageDAO.findAllByClient("Client");
		List<Massage> massagesByFacility = massageDAO.findAllByFacility(facility);
		List<Massage> massages = massageDAO.findAll();

		assertEquals(massage1, massageById);
		assertEquals(massage2, massageByDate);
		assertEquals(1, massagesByMasseuse.size());
		assertEquals(1, massagesByUser.size());
		assertEquals(2, massagesByFacility.size());
		assertEquals(2, massages.size());
	}
}