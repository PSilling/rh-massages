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
package net.rh.massages;

import java.security.Principal;
import java.util.EnumSet;

import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;

import org.eclipse.jetty.servlets.CrossOriginFilter;

import de.ahus1.keycloak.dropwizard.KeycloakBundle;
import de.ahus1.keycloak.dropwizard.KeycloakConfiguration;
import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.auth.Authenticator;
import io.dropwizard.auth.Authorizer;
import io.dropwizard.configuration.EnvironmentVariableSubstitutor;
import io.dropwizard.configuration.SubstitutingSourceProvider;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.hibernate.HibernateBundle;
import io.dropwizard.migrations.MigrationsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import net.rh.massages.auth.KeycloakAuthenticator;
import net.rh.massages.auth.User;
import net.rh.massages.auth.UserAuthorizer;
import net.rh.massages.core.Facility;
import net.rh.massages.core.Massage;
import net.rh.massages.db.FacilityDAO;
import net.rh.massages.db.MassageDAO;
import net.rh.massages.resources.FacilityResource;
import net.rh.massages.resources.LogoutResource;
import net.rh.massages.resources.MassageAuthResource;
import net.rh.massages.resources.MassageResource;

/**
 * MassagesApplication main class of the project
 *
 * @author psilling
 * @since 1.0.0
 */

public class MassagesApplication extends Application<MassagesConfiguration> {

	public static final String NAME = "Red Hat Massages"; // current application name

	/**
	 * Main method of the application
	 *
	 * @param args
	 * @throws Exception
	 */
	public static void main(final String[] args) throws Exception {
		new MassagesApplication().run(args);
	}

	/**
	 * Returns the application name
	 *
	 * @return current application name
	 */
	@Override
	public String getName() {
		return NAME;
	}

	/**
	 * Hibernate bundle used by the application
	 */
	private final HibernateBundle<MassagesConfiguration> HIBERNATE = new HibernateBundle<MassagesConfiguration>(
			Facility.class, Massage.class) {

		@Override
		public DataSourceFactory getDataSourceFactory(MassagesConfiguration configuration) {
			return configuration.getDataSourceFactory();
		}
	};

	/**
	 * Inicializes the Boostrap bundle
	 *
	 * @param bootsrap the bundle
	 */
	@Override
	public void initialize(final Bootstrap<MassagesConfiguration> bootstrap) {
		bootstrap.addBundle(HIBERNATE);
		bootstrap.addBundle(new AssetsBundle("/assets", "/"));

		bootstrap.setConfigurationSourceProvider(new SubstitutingSourceProvider(
				bootstrap.getConfigurationSourceProvider(), new EnvironmentVariableSubstitutor(false)));

		bootstrap.addBundle(new MigrationsBundle<MassagesConfiguration>() {

			@Override
			public DataSourceFactory getDataSourceFactory(MassagesConfiguration configuration) {
				return configuration.getDataSourceFactory();
			}
		});

		bootstrap.addBundle(new KeycloakBundle<MassagesConfiguration>() {

			@Override
			protected KeycloakConfiguration getKeycloakConfiguration(MassagesConfiguration configuration) {
				return (KeycloakConfiguration) configuration.getKeycloakConfiguration();
			}

			@Override
			protected Class<? extends Principal> getUserClass() {
				return User.class;
			}

			@Override
			protected Authorizer createAuthorizer() {
				return new UserAuthorizer();
			}

			@Override
			protected Authenticator createAuthenticator(KeycloakConfiguration configuration) {
				return new KeycloakAuthenticator(configuration);
			}
		});
	}

	/**
	 * The application's run method
	 *
	 * @param configuration configuration of the application
	 * @param enviroment jersey environment of the application
	 */
	@Override
	public void run(final MassagesConfiguration configuration, final Environment environment) {
		// Register resources with their DAOs
		final FacilityDAO facilityDao = new FacilityDAO(HIBERNATE.getSessionFactory());
		final MassageDAO massageDao = new MassageDAO(HIBERNATE.getSessionFactory());

		environment.jersey().register(new FacilityResource(facilityDao, massageDao));
		environment.jersey().register(new MassageResource(massageDao));
		environment.jersey().register(new MassageAuthResource(massageDao));
		environment.jersey().register(new LogoutResource());

		final FilterRegistration.Dynamic cors = environment.servlets().addFilter("CORS", CrossOriginFilter.class);

		// Configure CORS parameters
		cors.setInitParameter("allowedOrigins", "*");
		cors.setInitParameter("allowedHeaders", "X-Requested-With,Content-Type,Accept,Origin,Authorization");
		cors.setInitParameter("allowedMethods", "OPTIONS,GET,PUT,POST,DELETE,HEAD");

		// Add URL mapping
		cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, "/*");
	}
}