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
package net.rh.massages.configuration;

import javax.validation.constraints.NotNull;

/**
 * SmtpConfiguration configuration class for SMTP client
 *
 * @author psilling
 * @since 1.2.1
 *
 */

public class SmtpConfiguration {

	@NotNull
	private String server; // SMTP server address
	@NotNull
	private int port; // SMTP connection port
	private String username; // SMTP username
	private String password; // SMTP password
	private String fromEmail; // from which email address to send the emails
	private String fromName; // from who to send the emails
	private boolean async = true; // whether to send email asynchronously

	public SmtpConfiguration() {
	}

	/**
	 * @param server new SmtpConfiguration server
	 * @param port new SmtpConfiguration port
	 * @param username new SmtpConfiguration username
	 * @param password new SmtpConfiguration password
	 * @param fromEmail new SmtpConfiguration fromEmail
	 * @param fromName new SmtpConfiguration fromName
	 * @param async new SmtpConfiguration async
	 */
	public SmtpConfiguration(String server, int port, String username, String password, String fromEmail,
			String fromName, boolean async) {
		this.fromEmail = fromEmail;
		this.fromName = fromName;
		this.server = server;
		this.port = port;
		this.username = username;
		this.password = password;
		this.async = async;
	}

	/**
	 * @return current value of SMTP server
	 */
	public String getServer() {
		return server;
	}

	/**
	 * @param server new SMTP server to be set
	 */
	public void setServer(String server) {
		this.server = server;
	}

	/**
	 * @return current value of SMTP port
	 */
	public int getPort() {
		return port;
	}

	/**
	 * @param port new SMTP port to be set
	 */
	public void setPort(int port) {
		this.port = port;
	}

	/**
	 * @return current value of SMTP username
	 */
	public String getUsername() {
		return username;
	}

	/**
	 * @param username new SMTP username to be set
	 */
	public void setUsername(String username) {
		this.username = username;
	}

	/**
	 * @return current value of SMTP password
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * @param password new SMTP password to be set
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * @return current value of sender email
	 */
	public String getFromEmail() {
		return fromEmail;
	}

	/**
	 * @param fromEmail new sender email to be set
	 */
	public void setFromEmail(String fromEmail) {
		this.fromEmail = fromEmail;
	}

	/**
	 * @return current value of sender name
	 */
	public String getFromName() {
		return fromName;
	}

	/**
	 * @param fromName new sender name to be set
	 */
	public void setFromName(String fromName) {
		this.fromName = fromName;
	}

	/**
	 * @return true is the SMTP is set to send emails asynchronously, false
	 *         otherwise
	 */
	public boolean isAsync() {
		return async;
	}

	/**
	 * @param async new SMTR async mode to be set
	 */
	public void setAsync(boolean async) {
		this.async = async;
	}

}