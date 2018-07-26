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

package net.rh.massages;

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
import io.dropwizard.hibernate.UnitOfWorkAwareProxyFactory;
import io.dropwizard.migrations.MigrationsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import java.security.Principal;
import java.util.EnumSet;
import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;
import net.rh.massages.auth.KeycloakAuthenticator;
import net.rh.massages.auth.User;
import net.rh.massages.auth.UserAuthorizer;
import net.rh.massages.configuration.MailClient;
import net.rh.massages.core.Client;
import net.rh.massages.core.Facility;
import net.rh.massages.core.Massage;
import net.rh.massages.db.ClientDao;
import net.rh.massages.db.FacilityDao;
import net.rh.massages.db.MassageDao;
import net.rh.massages.health.MassagesHealthCheck;
import net.rh.massages.resources.ClientResource;
import net.rh.massages.resources.FacilityResource;
import net.rh.massages.resources.LogoutResource;
import net.rh.massages.resources.MassageResource;
import org.eclipse.jetty.servlet.ErrorPageErrorHandler;
import org.eclipse.jetty.servlets.CrossOriginFilter;

/**
 * The main class of the Dropwizard application. For more information visit Dropwizard
 * documentation.
 *
 * @author psilling
 * @since 1.0.0
 */
public class MassagesApplication extends Application<MassagesConfiguration> {

  private static final String NAME = "Red Hat Massages"; // current application name
  /**
   * Hibernate bundle used by the application.
   */
  private final HibernateBundle<MassagesConfiguration> hibernate =
      new HibernateBundle<MassagesConfiguration>(
          // Add our representation classes
          Facility.class, Massage.class, Client.class) {

        @Override
        public DataSourceFactory getDataSourceFactory(MassagesConfiguration configuration) {
          return configuration.getDataSourceFactory();
        }
      };

  /**
   * Main method of the application.
   *
   * @param args application arguments
   * @throws Exception generic exception
   */
  public static void main(final String[] args) throws Exception {
    new MassagesApplication().run(args);
  }

  /**
   * @return the name given to the application
   */
  @Override
  public String getName() {
    return NAME;
  }

  /**
   * Initializes the Bootstrap bundle.
   *
   * @param bootstrap Bootstrap bundle with application configuration
   */
  @Override
  public void initialize(final Bootstrap<MassagesConfiguration> bootstrap) {
    // Add Hibernate
    bootstrap.addBundle(hibernate);

    // Add client asset files
    bootstrap.addBundle(new AssetsBundle("/assets", "/", "index.html"));

    // Enable environmental variables
    bootstrap.setConfigurationSourceProvider(
        new SubstitutingSourceProvider(
            bootstrap.getConfigurationSourceProvider(), new EnvironmentVariableSubstitutor(false)));

    // Add Migrations bundle
    bootstrap.addBundle(
        new MigrationsBundle<MassagesConfiguration>() {

          @Override
          public DataSourceFactory getDataSourceFactory(MassagesConfiguration configuration) {
            return configuration.getDataSourceFactory();
          }
        });

    // Add Keycloak implementation
    bootstrap.addBundle(
        new KeycloakBundle<MassagesConfiguration>() {

          @Override
          protected KeycloakConfiguration getKeycloakConfiguration(
              MassagesConfiguration configuration) {
            return (KeycloakConfiguration) configuration.getKeycloakConfiguration();
          }

          @Override
          protected Class<? extends Principal> getUserClass() {
            return User.class;
          }

          @SuppressWarnings("rawtypes")
          @Override
          protected Authorizer createAuthorizer() {
            return new UserAuthorizer();
          }

          @SuppressWarnings("rawtypes")
          @Override
          protected Authenticator createAuthenticator(KeycloakConfiguration configuration) {
            return new KeycloakAuthenticator(configuration);
          }
        });
  }

  /**
   * The application's run method.
   *
   * @param configuration configuration of the application
   * @param environment   Jersey environment of the application
   */
  @Override
  public void run(final MassagesConfiguration configuration, final Environment environment) {
    // Create a MailClient instance based on SmtpConfiguration
    final MailClient mailClient = new MailClient(configuration.getSmtpConfiguration());

    // Register resources with their DAOs
    final FacilityDao facilityDao = new FacilityDao(hibernate.getSessionFactory());
    final MassageDao massageDao = new MassageDao(hibernate.getSessionFactory());
    final ClientDao clientDao = new ClientDao(hibernate.getSessionFactory());

    environment.jersey().register(new FacilityResource(facilityDao, massageDao, clientDao));
    environment.jersey().register(new MassageResource(massageDao, clientDao, mailClient));
    environment.jersey().register(new ClientResource(clientDao));
    environment.jersey().register(new LogoutResource());

    // Register ErrorPageErrorHandler so that the server routing is connected to
    // React routing
    final ErrorPageErrorHandler epeh = new ErrorPageErrorHandler();
    epeh.addErrorPage(404, "/index.html");
    environment.getApplicationContext().setErrorHandler(epeh);

    // Register health check
    MassagesHealthCheck health =
        new UnitOfWorkAwareProxyFactory(hibernate)
            .create(MassagesHealthCheck.class, FacilityDao.class, facilityDao);
    environment.healthChecks().register("massages", health);

    // Register CORS filter
    final FilterRegistration.Dynamic cors =
        environment.servlets().addFilter("CORS", CrossOriginFilter.class);

    // Configure CORS parameters
    cors.setInitParameter("allowedOrigins", "*");
    cors.setInitParameter(
        "allowedHeaders", "X-Requested-With,Content-Type,Accept,Origin,Authorization");
    cors.setInitParameter("allowedMethods", "OPTIONS,GET,PUT,POST,DELETE,HEAD");

    // Add URL mapping
    cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, "/*");
  }
}
