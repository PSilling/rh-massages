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
package net.rh.massages.core;

import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Email;

/**
 * Client representation class.
 *
 * @author psilling
 * @since 1.2.1
 */
@Entity
@Table(name = "Clients")
@NamedQueries({
        @NamedQuery(name = "Client.findAll", query = "SELECT client FROM Client client ORDER BY client.surname ASC"),
        @NamedQuery(name = "Client.findAllSubscribed", query = "SELECT client FROM Client client WHERE client.subscribed = true") })
public class Client {

    @Id
    @Column(name = "sub", unique = true, length = 64)
    @NotNull
    private String sub; // subject of the Client

    @Email
    @Column(length = 64)
    @NotNull
    private String email; // email of the Client

    @Column(length = 64)
    @NotNull
    private String name; // name of the Client

    @Column(length = 64)
    @NotNull
    private String surname; // surname of the Client

    @NotNull
    private boolean subscribed; // whether the Client is subscribed to server messaging

    /**
     * Constructor.
     */
    public Client() {
    }

    /**
     * Constructor.
     *
     * @param sub subject of the Client
     * @param email email of the Client
     * @param name name of the Client
     * @param surname surname of the Client
     * @param subscribed whether the Client is subscribed to server messaging
     */
    public Client(String sub, String email, String name, String surname, boolean subscribed) {
        this.sub = sub;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.subscribed = subscribed;
    }

    /**
     * @return current value of {@link Client} subject
     */
    public String getSub() {
        return sub;
    }

    /**
     * @param sub new {@link Client} subject to be set
     */
    public void setSub(String sub) {
        this.sub = sub;
    }

    /**
     * @return current value of {@link Client} email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email new {@link Client} email to be set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return current value of {@link Client} name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name new {@link Client} name to be set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return current value of {@link Client} surname
     */
    public String getSurname() {
        return surname;
    }

    /**
     * @param surname new {@link Client} surname to be set
     */
    public void setSurname(String surname) {
        this.surname = surname;
    }

    /**
     * @return current value of {@link Client} subscription
     */
    public boolean isSubscribed() {
        return subscribed;
    }

    /**
     * @param subscribed new {@link Client} subscribed value to be set
     */
    public void setSubscribed(boolean subscribed) {
        this.subscribed = subscribed;
    }

    /**
     * Creates a new contact info String from name, surname and email.
     *
     * @return {@link Client} contact information
     */
    public String createContact() {
        return (name + " " + surname + " (" + email + ")");
    }

    /**
     * Hashes the {@link Client} based on sub, email, name, surname and
     * subscription.
     */
    @Override
    public int hashCode() {
        return Objects.hash(sub, email, name, surname, subscribed);
    }

    /**
     * @return true if hashCode comparison matches both this and the given object
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if ((obj == null) || (getClass() != obj.getClass())) {
            return false;
        }

        return Integer.compare(hashCode(), obj.hashCode()) == 0;
    }

    /**
     * @return {@link Client} converted to a String with format Client[subject,
     *         name, surname, email, subscribed]
     */
    @Override
    public String toString() {
        return String.format("Client[subject=%s, name=%s, surname=%s, email=%s, subscribed=%s]", sub, name, surname,
                email, subscribed);
    }
}
