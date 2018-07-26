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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

import io.dropwizard.testing.junit.DAOTestRule;
import java.util.List;
import net.rh.massages.core.Facility;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;

/**
 * Facility Data Access Object JUnit test class.
 *
 * @author psilling
 * @since 1.0.0
 */
public class FacilityDaoTest {

  @Rule
  public DAOTestRule daoTestRule =
      DAOTestRule.newBuilder().addEntityClass(Facility.class).build(); // database mock

  private FacilityDao facilityDao; // Facility data access object

  /**
   * Creates {@link FacilityDao} with current database session.
   */
  @Before
  public void setUp() {
    facilityDao = new FacilityDao(daoTestRule.getSessionFactory());
  }

  /**
   * Tests whether {@link Facility} creation works as intended.
   */
  @Test
  public void testCreate() {
    final Facility facility = new Facility("Big Facility");
    final Facility createdFacility = daoTestRule.inTransaction(() -> facilityDao.create(facility));

    assertEquals(facility, createdFacility);
  }

  /**
   * Tests whether {@link Facility} updating works as intended.
   */
  @Test
  public void testUpdate() {
    Facility facility = new Facility("Big Facility");
    final Facility updatedFacility =
        daoTestRule.inTransaction(
            () -> {
              facilityDao.create(facility);
              facility.setName("Updated Facility");
              return facilityDao.update(facility);
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
    Facility removedFacility =
        daoTestRule.inTransaction(
            () -> {
              Facility deletedFacility = facilityDao.create(facility);
              facilityDao.delete(facility);
              return deletedFacility;
            });

    List<Facility> facilities = facilityDao.findAll();

    assertNotNull(removedFacility);
    assertFalse(facilities.contains(facility));
  }

  /**
   * Tests whether all {@link FacilityDao} finding methods are working as intended.
   */
  @Test
  public void testFind() {
    final Facility facility1 = new Facility("First Facility");
    final Facility facility2 = new Facility("Second Facility");
    daoTestRule.inTransaction(
        () -> {
          facilityDao.create(facility1);
          facilityDao.create(facility2);
        });

    Facility facilityById = facilityDao.findById((long) 1);
    Facility facilityByName = facilityDao.findByName("Second Facility");
    List<Facility> facilities = facilityDao.findAll();

    assertEquals(facility1, facilityById);
    assertEquals(facility2, facilityByName);
    assertEquals(2, facilities.size());
  }
}
