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
package net.rh.massages.health;

import javax.inject.Inject;

import com.codahale.metrics.health.HealthCheck;

import io.dropwizard.hibernate.UnitOfWork;
import net.rh.massages.db.FacilityDAO;
import net.rh.massages.db.UserDAO;

/**
 * MassagesHealthCheck Health check of the application.
 *
 * @author psilling
 * @since 1.0.0
 */

public class MassagesHealthCheck extends HealthCheck {

	@Inject
	private FacilityDAO facilityDAO; // facility data access object

	@Inject
	private UserDAO userDAO; // user data access object

	/**
	 * Checks whether the application is healthy by checking database connection and
	 * by checking if there is at least one User and one Facility.
	 */
	@UnitOfWork
	@Override
	protected Result check() throws Exception {
		if (facilityDAO.findAll().isEmpty()) {
			return Result.unhealthy("The application is unhealthy as there is no existing Facility.");
		}
		if (userDAO.findAll().isEmpty()) {
			return Result.unhealthy("The application is unhealthy as there is no existing User.");
		}
		return Result.healthy("The application is healthy.");
	}
}
