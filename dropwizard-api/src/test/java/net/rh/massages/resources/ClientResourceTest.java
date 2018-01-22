package net.rh.massages.resources;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.core.GenericType;

import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.glassfish.jersey.test.grizzly.GrizzlyWebTestContainerFactory;
import org.junit.After;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;

import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.oauth.OAuthCredentialAuthFilter;
import io.dropwizard.testing.junit.ResourceTestRule;
import net.rh.massages.auth.TestAuthenticator;
import net.rh.massages.auth.TestAuthorizer;
import net.rh.massages.auth.TestUser;
import net.rh.massages.auth.User;
import net.rh.massages.core.Client;
import net.rh.massages.db.ClientDAO;

/**
 * {@link ClientResource} JUnit resource test for /clients endpoint.
 *
 * @author psilling
 * @since 1.2.2
 */
public class ClientResourceTest {

	private static final ClientDAO clientDao = mock(ClientDAO.class); // mock of ClientDAO

	private final Client client = new Client("Subject", "example@email.com", "FName", "SName", true); // test Client

	/**
	 * Creates a new static {@link ResourceTestRule} that tests a given resource.
	 * Uses {@link GrizzlyWebTestContainerFactory} to deal with resource
	 * authentication.
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@ClassRule
	public static final ResourceTestRule RULE = ResourceTestRule.builder()
			.setTestContainerFactory(new GrizzlyWebTestContainerFactory())
			.addProvider(new AuthDynamicFeature(new OAuthCredentialAuthFilter.Builder<TestUser>()
					.setAuthenticator(new TestAuthenticator()).setAuthorizer(new TestAuthorizer()).setRealm("SECRET")
					.setPrefix("Bearer").buildAuthFilter()))
			.addProvider(RolesAllowedDynamicFeature.class)
			.addProvider(new AuthValueFactoryProvider.Binder<>(User.class)).addResource(new ClientResource(clientDao))
			.build();

	/**
	 * Configures mocks before each test.
	 */
	@Before
	public void setup() {
		List<Client> clients = new ArrayList<>();
		clients.add(client);

		when(clientDao.findAll()).thenReturn(clients);
	}

	/**
	 * Resets mocks after each test.
	 */
	@After
	public void tearDown() {
		reset(clientDao);
	}

	/**
	 * Tests whether fetch request for all {@link Client}s works as intended.
	 */
	@Test
	public void fetchTest() {
		List<Client> clients = RULE.target("/clients").request().header("Authorization", "Bearer TOKEN")
				.get(new GenericType<List<Client>>() {
				});

		assertNotNull(clients);
		assertEquals(1, clients.size());
	}
}