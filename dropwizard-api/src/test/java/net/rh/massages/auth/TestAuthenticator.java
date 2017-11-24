package net.rh.massages.auth;

import java.security.Principal;
import java.util.Optional;

import io.dropwizard.auth.AuthenticationException;
import io.dropwizard.auth.Authenticator;

public class TestAuthenticator<P extends Principal> implements Authenticator<String, TestUser> {

	@Override
	public Optional<TestUser> authenticate(String credentials) throws AuthenticationException {
		if (credentials != null) {
			return Optional.ofNullable(new TestUser());
		} else {
			return Optional.empty();
		}
	}
}
