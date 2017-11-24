package net.rh.massages.auth;

import java.security.Principal;

public class TestUser implements Principal {

	@Override
	public String getName() {
		return "good-guy";
	}

}
