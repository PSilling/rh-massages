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

/**
 * MassagesConfiguration configuration class of the project
 *
 * @author psilling
 * @since 1.0.0
 */

public class MassagesConfiguration extends Configuration {

	@Valid
	@NotNull
	private DataSourceFactory database = new DataSourceFactory(); // application's database

	@Valid
	@NotNull
	private KeycloakConfiguration keycloakConfiguration = new KeycloakConfiguration(); // application's Keycloak
																						// configuration

	/**
	 * DataSourceFactory setter
	 *
	 * @param factory DataSourceFactory factory to be set
	 */
	@JsonProperty("database")
	public void setDataSourceFactory(DataSourceFactory factory) {
		database = factory;
	}

	/**
	 * DataSourceFactory getter
	 *
	 * @return current DataSourceFactory
	 */
	@JsonProperty("database")
	public DataSourceFactory getDataSourceFactory() {
		return database;
	}

	/**
	 * KeycloakConfiguration setter
	 *
	 * @param keycloakConfiguration new keycloakConfiguration value
	 */
	@JsonProperty("keycloakConfiguration")
	public void setKeycloakConfiguration(KeycloakConfiguration keycloakConfiguration) {
		this.keycloakConfiguration = keycloakConfiguration;
	}

	/**
	 * KeycloakConfiguration getter
	 *
	 * @return current keycloakConfiguration
	 */
	@JsonProperty("keycloakConfiguration")
	public AdapterConfig getKeycloakConfiguration() {
		return keycloakConfiguration;
	}
}
