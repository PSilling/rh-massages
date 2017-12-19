package net.rh.massages.resources;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.glassfish.jersey.test.grizzly.GrizzlyWebTestContainerFactory;
import org.junit.After;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;

import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.oauth.OAuthCredentialAuthFilter;
import io.dropwizard.testing.junit.ResourceTestRule;
import net.rh.massages.auth.TestAuthenticator;
import net.rh.massages.auth.TestAuthorizer;
import net.rh.massages.auth.TestUser;
import net.rh.massages.core.Facility;
import net.rh.massages.core.Massage;
import net.rh.massages.db.FacilityDAO;
import net.rh.massages.db.MassageDAO;

/**
 * FacilityResourceTest FacilityResource JUnit resource test for facilities
 * endpoint
 *
 * @author psilling
 * @since 1.0.0
 *
 */

public class FacilityResourceTest {

	private static final FacilityDAO facilityDao = mock(FacilityDAO.class); // mock of FacilityDAO
	private static final MassageDAO massageDao = mock(MassageDAO.class); // mock of MassageDAO

	private final Facility facility = new Facility("Facility"); // test Facility
	private final Facility newFacility = new Facility("New Facility"); // test Facility for creation and update
	private final Massage massage = new Massage(new Date(0), new Date(1), "Great Masseuse", null, null, facility); // test
																													// Massage

	/*
	 * Creates a new static ResourceTestRule that tests a given resource. Uses
	 * GrizzlyWebTestContainerFactory to deal with resource authentication.
	 */
	@ClassRule
	public static final ResourceTestRule RULE = ResourceTestRule.builder()
			.setTestContainerFactory(new GrizzlyWebTestContainerFactory())
			.addProvider(new AuthDynamicFeature(new OAuthCredentialAuthFilter.Builder<TestUser>()
					.setAuthenticator(new TestAuthenticator()).setAuthorizer(new TestAuthorizer()).setRealm("SECRET")
					.setPrefix("Bearer").buildAuthFilter()))
			.addProvider(RolesAllowedDynamicFeature.class)
			.addProvider(new AuthValueFactoryProvider.Binder<>(TestUser.class))
			.addResource(new FacilityResource(facilityDao, massageDao)).build();

	/**
	 * Configures mocks before each test.
	 */
	@Before
	public void setup() {
		List<Facility> facilities = new ArrayList<>();
		facilities.add(facility);

		when(facilityDao.findAll()).thenReturn(facilities);
		when(facilityDao.findById((long) 1)).thenReturn(facility);
		when(facilityDao.findById((long) 2)).thenReturn(newFacility);
		when(facilityDao.findByName(newFacility.getName())).thenReturn(newFacility);

		doAnswer(new Answer<Facility>() {

			@Override
			public Facility answer(final InvocationOnMock invocation) throws Throwable {
				facilities.add(newFacility);
				return newFacility;
			}
		}).when(facilityDao).create(newFacility);

		doAnswer(new Answer<Void>() {

			@Override
			public Void answer(final InvocationOnMock invocation) throws Throwable {
				facilities.remove(newFacility);
				return null;
			}
		}).when(facilityDao).delete(newFacility);

		doAnswer(new Answer<Facility>() {

			@Override
			public Facility answer(final InvocationOnMock invocation) throws Throwable {
				facilities.remove(facility);
				facilities.add(newFacility);
				return newFacility;
			}
		}).when(facilityDao).update(newFacility);

		List<Massage> massages = new ArrayList<>();
		massages.add(massage);

		when(massageDao.findAllByFacility(facility)).thenReturn(massages);
	}

	/**
	 * Resets mocks after each test.
	 */
	@After
	public void tearDown() {
		reset(facilityDao);
		reset(massageDao);
	}

	/**
	 * Fetches all Facilities
	 *
	 * @return list of all current Facilities
	 */
	private List<Facility> fetchAll() {
		return RULE.target("/facilities").request().header("Authorization", "Bearer TOKEN")
				.get(new GenericType<List<Facility>>() {
				});
	}

	/**
	 * Tests whether fetch request for all Facilities works as intended
	 */
	@Test
	public void fetchTest() {
		List<Facility> facilities = fetchAll();

		assertNotNull(facilities);
		assertEquals(1, facilities.size());
	}

	/**
	 * Tests whether creation and follow up removal of a new Facility work as
	 * intended
	 */
	@Test
	public void createDeleteTest() {
		// Tests the creation
		Response response = RULE.target("/facilities").request(MediaType.APPLICATION_JSON_TYPE)
				.header("Authorization", "Bearer TOKEN").post(Entity.json(newFacility));
		List<Facility> facilities = fetchAll();

		assertNotNull(response);
		assertEquals(201, response.getStatus());
		assertEquals(2, facilities.size());
		assertEquals(facility, facilities.get(0));
		assertEquals(newFacility, facilities.get(1));

		// Tests the removal
		response = RULE.target("/facilities/2").request().header("Authorization", "Bearer TOKEN").delete();
		facilities = fetchAll();

		assertNotNull(response);
		assertEquals(204, response.getStatus());
		assertEquals(1, facilities.size());
		assertEquals(facility, facilities.get(0));
	}

	/**
	 * Tests whether fetch request for a given Facility works as intended
	 */
	@Test
	public void getByIdTest() {
		Facility facility = RULE.target("/facilities/1").request().header("Authorization", "Bearer TOKEN")
				.get(Facility.class);
		;

		assertNotNull(facility);
		assertEquals(this.facility, facility);
	}

	/**
	 * Tests whether update request for a given Facility works as intended
	 */
	@Test
	public void updateTest() {
		Response response = RULE.target("/facilities/1").request(MediaType.APPLICATION_JSON_TYPE)
				.header("Authorization", "Bearer TOKEN").put(Entity.json(newFacility));
		Facility updatedFacility = response.readEntity(Facility.class);

		assertNotNull(response);
		assertNotNull(updatedFacility);
		assertEquals(200, response.getStatus());
		assertEquals(1, updatedFacility.getId());
		assertEquals(newFacility.getName(), updatedFacility.getName());
	}

	/**
	 * Creates a new Massage (used also in follow up MassageResource testing) and
	 * tests whether fetch request for all Massages of a given Facility works as
	 * intended
	 */
	@Test
	public void getMassagesTest() {
		List<Massage> massages = RULE.target("/facilities/1/massages").request().header("Authorization", "Bearer TOKEN")
				.get(new GenericType<List<Massage>>() {
				});

		assertNotNull(massages);
		assertEquals(1, massages.size());
		assertEquals(massage, massages.get(0));
	}
}