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

package net.rh.massages.configuration;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.text.StrSubstitutor;
import org.simplejavamail.email.Email;
import org.simplejavamail.email.EmailBuilder;
import org.simplejavamail.mailer.Mailer;
import org.simplejavamail.mailer.config.TransportStrategy;

/**
 * A SMTP mailing client class.
 *
 * @author psilling
 * @since 1.2.1
 */
public class MailClient {

  private static final Logger LOGGER = Logger.getLogger(MailClient.class.getName()); // class logger
  private final Mailer mailer; // SMTP mailer client
  private final SmtpConfiguration smtpConfiguration; // SMTP configuration

  /**
   * Constructor.
   *
   * @param smtpConfiguration the SMTP client {@link SmtpConfiguration}
   */
  public MailClient(SmtpConfiguration smtpConfiguration) {
    this.smtpConfiguration = smtpConfiguration;
    mailer =
        new Mailer(
            smtpConfiguration.getServer(),
            smtpConfiguration.getPort(),
            smtpConfiguration.getUsername(),
            smtpConfiguration.getPassword(),
            TransportStrategy.SMTP_TLS);
  }

  /**
   * Sends an email to a given recipients list.
   *
   * @param recipients recipients of the email message separated by a comma
   * @param subject    message subject
   * @param template   template file to be used
   * @param args       arguments for template substitutions
   */
  public void sendEmail(
      String recipients, String subject, String template, Map<String, ?> args) {
    // Inject arguments into the subject
    StrSubstitutor sub = new StrSubstitutor(args);
    subject = StringUtils.capitalize(sub.replace(subject));

    // Create the email itself and then send it
    Email email =
        new EmailBuilder()
            .from(smtpConfiguration.getFromName(), smtpConfiguration.getFromEmail())
            .to(recipients)
            .subject(subject)
            .textHTML(loadHtmlFromTemplate(template, subject, sub))
            .build();
    mailer.sendMail(email, smtpConfiguration.isAsync());
  }

  /**
   * Loads HTML template from the model template file and injects the given template with all given
   * arguments.
   *
   * @param templateFile template file to be used
   * @param title        message title
   * @param sub          message subject with template arguments
   * @return the created HTML String
   */
  private String loadHtmlFromTemplate(
      String templateFile, String title, StrSubstitutor sub) {
    String html = "";
    try {
      // Load the templates
      final String genericTemplate =
          IOUtils.toString(
              MailClient.class.getResourceAsStream("/templates/modelEmail.html"), "UTF-8");
      String template =
          IOUtils.toString(
              MailClient.class.getResourceAsStream("/templates/" + templateFile), "UTF-8");

      // Inject template arguments
      template = sub.replace(template);
      Map<String, String> arguments = new HashMap<>();
      arguments.put("title", title);
      arguments.put("body", template);

      StrSubstitutor modelSub = new StrSubstitutor(arguments);
      html = modelSub.replace(genericTemplate);
    } catch (IOException e) {
      LOGGER.log(Level.SEVERE, "Error occurred while processing the email template", e);
    }
    return html;
  }
}
