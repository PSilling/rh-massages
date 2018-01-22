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
package net.rh.massages;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.keycloak.representations.adapters.config.AdapterConfig;

import com.fasterxml.jackson.annotation.JsonProperty;

import de.ahus1.keycloak.dropwizard.KeycloakConfiguration;
import io.dropwizard.Configuration;
import io.dropwizard.db.DataSourceFactory;
import net.rh.massages.configuration.SmtpConfiguration;

/**
 * Main configuration class of the application.
 *
 * @author psilling
 * @since 1.0.0
 */
public class MassagesConfiguration extends Configuration {

	@Valid
	@NotNull
	private DataSourceFactory database = new DataSourceFactory(); // database factory

	@Valid
	@NotNull
	private KeycloakConfiguration keycloakConfiguration = new KeycloakConfiguration(); // Keycloak configuration

	@Valid
	@NotNull
	private SmtpConfiguration smtpConfiguration = new SmtpConfiguration(); // STMP client configuration

	/**
	 * @param factory new database factory value to be set
	 */
	@JsonProperty("database")
	public void setDataSourceFactory(DataSourceFactory factory) {
		database = factory;
	}

	/**
	 * @return current value of database
	 */
	@JsonProperty("database")
	public DataSourceFactory getDataSourceFactory() {
		return database;
	}

	/**
	 * @param keycloakConfiguration new keycloakConfiguration value to be set
	 */
	@JsonProperty("keycloakConfiguration")
	public void setKeycloakConfiguration(KeycloakConfiguration keycloakConfiguration) {
		this.keycloakConfiguration = keycloakConfiguration;
	}

	/**
	 * @return current value of keycloakConfiguration
	 */
	@JsonProperty("keycloakConfiguration")
	public AdapterConfig getKeycloakConfiguration() {
		return keycloakConfiguration;
	}

	/**
	 * @param smtpConfiguration new smtpConfiguration value to be set
	 */
	@JsonProperty("smtpConfiguration")
	public void setSmtpConfiguration(SmtpConfiguration smtpConfiguration) {
		this.smtpConfiguration = smtpConfiguration;
	}

	/**
	 * @return current value of smtpConfiguration
	 */
	@JsonProperty("smtpConfiguration")
	public SmtpConfiguration getSmtpConfiguration() {
		return smtpConfiguration;
	}
}
