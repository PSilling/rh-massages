package net.rh.massages.auth;

import io.dropwizard.auth.Authorizer;

public class TestAuthorizer implements Authorizer<TestUser> {

	@Override
	public boolean authorize(TestUser user, String role) {
		if (user.getName().equals("good-guy")) {
			return true;
		} else {
			return false;
		}
	}
}
