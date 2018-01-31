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
package net.rh.massages.auth;

import io.dropwizard.auth.Authorizer;

/**
 * Test authorizer substitute class.
 *
 * @author psilling
 * @since 1.0.0
 */
public class TestAuthorizer implements Authorizer<TestUser> {

    /**
     * Authorize a {@link TestUser} based on name.
     *
     * @param user the {@link TestUser} to be authorized
     * @param role the role that is required for the authorization (has no meaning
     *            for the test)
     * @return true if the {@link TestUser} is authorized, false otherwise
     */
    @Override
    public boolean authorize(TestUser user, String role) {
        if (user.getName().equals("good-guy")) {
            return true;
        } else {
            return false;
        }
    }
}
