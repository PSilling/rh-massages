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
package net.rh.massages.resources;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedList;
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
import net.rh.massages.auth.User;
import net.rh.massages.core.Facility;
import net.rh.massages.core.Massage;
import net.rh.massages.db.MassageDAO;

/**
 * {@link MassageResource} JUnit resource test for /massages endpoint.
 *
 * @author psilling
 * @since 1.0.0
 */
public class MassageResourceTest {

    private static final MassageDAO massageDao = mock(MassageDAO.class); // mock of MassageDAO

    private final long MILLISECONDS = new Date().getTime(); // current time milliseconds
    private final Facility facility = new Facility("Facility"); // test Facility
    private final Massage massage = new Massage(new Date(0), new Date(1), "Great Masseuse", null, facility); // test
    // Massage
    private final Massage newMassage = new Massage(new Date(MILLISECONDS + 10000), new Date(MILLISECONDS + 10001),
            "Super Masseuse", null, facility); // test Massage for creation and updating

    /**
     * Creates a new static {@link ResourceTestRule} that tests a given resource.
     * Uses {@link GrizzlyWebTestContainerFactory} to deal with resource
     * authentication.
     */
    @SuppressWarnings({ "rawtypes", "unchecked" })
    @ClassRule
    public static final ResourceTestRule RULE = ResourceTestRule.builder()
            .setTestContainerFactory(new GrizzlyWebTestContainerFactory())
            .addProvider(new AuthDynamicFeature(new OAuthCredentialAuthFilter.Builder<TestUser>()
                    .setAuthenticator(new TestAuthenticator()).setAuthorizer(new TestAuthorizer()).setRealm("SECRET")
                    .setPrefix("Bearer").buildAuthFilter()))
            .addProvider(RolesAllowedDynamicFeature.class)
            .addProvider(new AuthValueFactoryProvider.Binder<>(User.class))
            .addResource(new MassageResource(massageDao, null, null)).build();

    /**
     * Configures mocks before each test.
     */
    @Before
    public void setup() {
        List<Massage> massages = new ArrayList<>();
        massages.add(massage);

        when(massageDao.findAll()).thenReturn(massages);
        when(massageDao.findById((long) 1)).thenReturn(massage);
        when(massageDao.findById((long) 0)).thenReturn(newMassage);
        when(massageDao.findById((long) 2)).thenReturn(newMassage);

        doAnswer(new Answer<Massage>() {

            @Override
            public Massage answer(final InvocationOnMock invocation) throws Throwable {
                massages.add(newMassage);
                return newMassage;
            }
        }).when(massageDao).create(newMassage);

        doAnswer(new Answer<Void>() {

            @Override
            public Void answer(final InvocationOnMock invocation) throws Throwable {
                massages.remove(newMassage);
                return null;
            }
        }).when(massageDao).delete(newMassage);
    }

    /**
     * Resets mocks after each test.
     */
    @After
    public void tearDown() {
        reset(massageDao);
    }

    /**
     * Fetches all {@link Massage}s.
     *
     * @return {@link List} of all current {@link Massage}s
     */
    private List<Massage> fetchAll() {
        return RULE.target("/massages").request().header("Authorization", "Bearer TOKEN")
                .get(new GenericType<List<Massage>>() {
                });
    }

    /**
     * Tests whether fetch request for all {@link Massage}s works as intended.
     */
    @Test
    public void fetchTest() {
        List<Massage> massages = fetchAll();

        assertNotNull(massages);
        assertEquals(1, massages.size());
        assertEquals(massage, massages.get(0));
    }

    /**
     * Tests whether creation and follow up removal of a new {@link Massage} work as
     * intended.
     */
    @Test
    public void createDeleteTest() {
        List<Massage> massages = new LinkedList<>();
        massages.add(newMassage);

        // Test the creation
        Response response = RULE.target("/massages").request(MediaType.APPLICATION_JSON_TYPE)
                .header("Authorization", "Bearer TOKEN").post(Entity.json(massages));
        massages = fetchAll();

        assertNotNull(response);
        assertEquals(200, response.getStatus());
        assertEquals(2, massages.size());
        assertEquals(massage, massages.get(0));
        assertEquals(newMassage, massages.get(1));

        // Test the removal
        response = RULE.target("/massages").queryParam("ids", 2).request().header("Authorization", "Bearer TOKEN")
                .delete();
        massages = fetchAll();

        assertNotNull(response);
        assertEquals(204, response.getStatus());
        assertEquals(1, massages.size());
        assertEquals(massage, massages.get(0));
    }

    /**
     * Test whether fetch request for a given {@link Massage} works as intended.
     */
    @Test
    public void getByIdTest() {
        Massage massage = RULE.target("/massages/1").request().header("Authorization", "Bearer TOKEN")
                .get(Massage.class);

        assertNotNull(massage);
        assertEquals(this.massage, massage);
    }
}