package net.rh.massages.core;

import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Table(name = "Facilities")
@NamedQueries({ @NamedQuery(name = "Facility.findAll", query = "SELECT facility FROM Facility facility"),
	@NamedQuery(name = "Facility.findByName", query = "SELECT facility FROM Facility facility WHERE facility.name = :name") })
public class Facility {
	  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @NotNull
  private long id;
  
  @Column(name = "name", unique = true)
  @NotEmpty
  private String name;

  public Facility() {
  }

  public Facility(long id, String name) {
    this.id = id;
	this.name = name;
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

  @Override
  public int hashCode() {
    return Objects.hash(name);
  }

  @Override
  public String toString() {
    return String.format("Facility[name=%s]", name);
  }
}
