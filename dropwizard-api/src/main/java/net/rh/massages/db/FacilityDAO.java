package net.rh.massages.db;

import io.dropwizard.hibernate.AbstractDAO;

import java.util.List;

import net.rh.massages.core.Facility;
import net.rh.massages.core.User;

import org.hibernate.SessionFactory;

public class FacilityDAO extends AbstractDAO<Facility> {

  public FacilityDAO(SessionFactory sessionFactory) {
    super(sessionFactory);
  }

  public Facility create(Facility facility) {
    return persist(facility);
  }
  
  public Facility update(Facility facility) {
    currentSession().clear();
    return persist(facility);
  }

  public Facility findById(Long id) {
    return get(id);
  }

  public Facility findByName(String name) {
    return uniqueResult(namedQuery("Facility.findByName").setParameter("name", name));
  }

  public List<Facility> findAll() {
    return list(namedQuery("Facility.findAll"));
  }

  public void delete(Facility facility) {
    currentSession().delete(facility);
  }
}
