package net.rh.massages.core;

import java.security.Principal;
import java.util.Objects;
import java.util.Set;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Table(name = "Users")
@NamedQueries({ @NamedQuery(name = "User.findAll", query = "SELECT user FROM User user"),
	@NamedQuery(name = "User.findByName", query = "SELECT user FROM User user WHERE user.name = :name"),
	@NamedQuery(name = "User.findByEmail", query = "SELECT user FROM User user WHERE user.email = :email"),
	@NamedQuery(name = "User.findByAdmin", query = "SELECT user FROM User user WHERE user.admin = :admin")})
public class User implements Principal {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @NotNull
  private long id;
	
  @NotEmpty
  private String name;
  
  @NotEmpty
  private String email;
  
  @NotNull
  private boolean admin;
  
  public User() {
  }

  public User(long id, String name, String email, boolean admin) {
    this.id = id;
	this.name = name;
    this.email = email;
    this.admin = admin;
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public boolean getAdmin() {
    return admin;
  }

  public void setAdmin(boolean isAdmin) {
    this.admin = isAdmin;
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, email);
  }

  @Override
  public String toString() {
    return String.format("User[id=%s, name=%s, email=%s]", id, name, email);
  }
}