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
import java.util.Date;
import java.util.List;
import java.util.Map;
import net.rh.massages.core.Client;
import net.rh.massages.core.Facility;
import net.rh.massages.core.Massage;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;

/**
 * Massage Data Access Object JUnit test class.
 *
 * @author psilling
 * @since 1.0.0
 */
public class MassageDaoTest {

  @Rule
  public DAOTestRule daoTestRule =
      DAOTestRule.newBuilder()
          .addEntityClass(Facility.class)
          .addEntityClass(Massage.class)
          .addEntityClass(Client.class)
          .build(); // database mock

  private FacilityDao facilityDao; // Facility data access object
  private MassageDao massageDao; // Massage data access object

  /**
   * Creates {@link MassageDao} with current database session.
   */
  @Before
  public void setUp() {
    facilityDao = new FacilityDao(daoTestRule.getSessionFactory());
    massageDao = new MassageDao(daoTestRule.getSessionFactory());
  }

  /**
   * Tests whether {@link Massage} creation works as intended.
   */
  @Test
  public void testCreate() {
    final Facility facility =
        daoTestRule.inTransaction(
            () -> {
              facilityDao.create(new Facility("Big Facility"));
              return facilityDao.findById((long) 1);
            });
    final Massage massage = new Massage(new Date(0), new Date(1), "Great Masseuse", null, facility);
    final Massage createdMassage =
        daoTestRule.inTransaction(
            () -> massageDao.create(massage));

    assertEquals(massage, createdMassage);
  }

  /**
   * Tests whether {@link Massage} updating works as intended.
   */
  @Test
  public void testUpdate() {
    final Facility facility1 =
        daoTestRule.inTransaction(
            () -> {
              facilityDao.create(new Facility("First Facility"));
              return facilityDao.findById((long) 1);
            });
    final Facility facility2 =
        daoTestRule.inTransaction(
            () -> {
              facilityDao.create(new Facility("Second Facility"));
              return facilityDao.findById((long) 2);
            });
    Massage massage = new Massage(new Date(0), new Date(1), "Great Masseuse", null, facility1);
    final Massage updatedMassage =
        daoTestRule.inTransaction(
            () -> {
              massageDao.create(massage);
              massage.setDate(new Date(1001));
              massage.setEnding(new Date(1000));
              massage.setMasseuse("Updated Masseuse");
              massage.setFacility(facility2);
              return massageDao.update(massage);
            });
    updatedMassage.checkDates();

    assertEquals(1, updatedMassage.getId());
    assertEquals(new Date(1000), updatedMassage.getDate());
    assertEquals(new Date(1001), updatedMassage.getEnding());
    assertEquals("Updated Masseuse", updatedMassage.getMasseuse());
    assertEquals(facility2, updatedMassage.getFacility());
    assertEquals(massage, updatedMassage);
  }

  /**
   * Tests whether {@link Massage} removal works as intended.
   */
  @Test
  public void testDelete() {
    final Facility facility =
        daoTestRule.inTransaction(
            () -> {
              facilityDao.create(new Facility("Big Facility"));
              return facilityDao.findById((long) 1);
            });
    final Massage massage = new Massage(new Date(0), new Date(1), "Great Masseuse", null, facility);
    Massage removedMassage =
        daoTestRule.inTransaction(
            () -> {
              Massage deletedMassage = massageDao.create(massage);
              massageDao.delete(massage);
              return deletedMassage;
            });

    List<Massage> massages = massageDao.findAll();

    assertNotNull(removedMassage);
    assertFalse(massages.contains(massage));
  }

  /**
   * Tests whether all {@link MassageDao} finding methods are working as intended.
   */
  @Test
  public void testFind() {
    final Facility facility =
        daoTestRule.inTransaction(
            () -> {
              facilityDao.create(new Facility("Big Facility"));
              return facilityDao.findById((long) 1);
            });
    final Massage massage1 =
        new Massage(new Date(0), new Date(1), "First Masseuse", null, facility);
    final Massage massage2 =
        new Massage(new Date(1000), new Date(1001), "Second Masseuse", null, facility);
    daoTestRule.inTransaction(
        () -> {
          massageDao.create(massage1);
          massageDao.create(massage2);
        });

    final Massage massageById = massageDao.findById((long) 1);
    final Map<String, Object> oldMassages = massageDao.searchOld("Masseuse", false,
        null, null, 1, 2);
    final List<Massage> massagesByMasseuse = massageDao.findAllByMasseuse("First Masseuse");
    final List<Massage> futureMassagesByClient =
        massageDao.findAllByClient(
            new Client("subject", "email@example.com", "Name", "Surname", false));
    final Map<String, Object> futureMassagesByFacility =
        massageDao.searchNewByFacility(facility, "Masseuse", false, null, null, 0, 2);
    final List<Massage> massages = massageDao.findAll();

    assertEquals(massage1, massageById);
    assertEquals(2, oldMassages.get("totalCount"));
    assertEquals(1, massagesByMasseuse.size());
    assertEquals(0, futureMassagesByClient.size());
    assertEquals(0, futureMassagesByFacility.get("totalCount"));
    assertEquals(2, massages.size());
  }
}
