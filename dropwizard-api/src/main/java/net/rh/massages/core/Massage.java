package net.rh.massages.core;

import java.util.Date;
import java.util.Objects;

import javax.annotation.Nullable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Table(name = "Massages")
@NamedQueries({ @NamedQuery(name = "Massage.findAll", query = "SELECT massage FROM Massage massage"),
    @NamedQuery(name = "Massage.findByDate", query = "SELECT massage FROM Massage massage WHERE massage.date = :date"),
    @NamedQuery(name = "Massage.findByMasseuse", query = "SELECT massage FROM Massage massage WHERE massage.masseuse = :masseuse"),
    @NamedQuery(name = "Massage.findByUser", query = "SELECT massage FROM Massage massage WHERE massage.user = :user"),
    @NamedQuery(name = "Massage.findByFacility", query = "SELECT massage FROM Massage massage WHERE massage.facility = :facility") })
public class Massage {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @NotNull
  private long id;

  @NotNull
  private Date date;
  
  @NotEmpty
  private String masseuse;

  @ManyToOne
  @Nullable
  private User user;

  @ManyToOne
  @NotNull
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Facility facility;

  public Massage() {
  }

  public Massage(long id, Date date, String masseuse, User user, Facility facility) {
    this.id = id;
	this.date = date;
    this.masseuse = masseuse;
    this.user = user;
    this.facility = facility;
  }

  public long getId() {
	return id;
  }

  public void setId(long id) {
	this.id = id;
  }

  public Date getDate() {
	return date;
  }

  public void setDate(Date date) {
	  this.date = date;
  }

  public String getMasseuse() {
	  return masseuse;
  }

  public void setMasseuse(String masseuse) {
	  this.masseuse = masseuse;
  }

  public User getUser() {
	  return user;
  }

  public void setUser(User user) {
	  this.user = user;
  }

  public Facility getFacility() {
  	  return facility;
  }

  public void setFacility(Facility facility) {
	  this.facility = facility;
  }
	
  @Override
  public int hashCode() {
    return Objects.hash(id, date, masseuse);
  }

  @Override
  public String toString() {
    return String.format("Task[id=%s, masseuse=%s]", id, masseuse);
  }
}
