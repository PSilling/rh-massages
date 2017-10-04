package net.rh.massages.db;

import io.dropwizard.hibernate.AbstractDAO;

import java.util.Date;
import java.util.List;

import net.rh.massages.core.Facility;
import net.rh.massages.core.Massage;
import net.rh.massages.core.User;

import org.hibernate.SessionFactory;

public class MassageDAO extends AbstractDAO<Massage> {

  public MassageDAO(SessionFactory sessionFactory) {
    super(sessionFactory);
  }
  
  public Massage create(Massage massage) {
    return persist(massage);
  }

  public Massage update(Massage massage) {
    currentSession().clear();
    return persist(massage);
  }
  
  public Massage findById(Long id) {
    return get(id);
  }

  public Massage findByDate(Date date) {
    return uniqueResult(namedQuery("Massage.findByDate").setParameter("date", date));
  }

  public Massage findAllByMasseuse(String masseuse) {
    return uniqueResult(namedQuery("Massage.findAllByMasseuse").setParameter("name", masseuse));
  }

  public List<Massage> findByUser(User user) {
    return list(namedQuery("Massage.findByUser").setParameter("user", user));
  }

  public List<Massage> findByFacility(Facility facility) {
    return list(namedQuery("Massage.findByFacility").setParameter("facility", facility));
  }

  public List<Massage> findAll() {
    return list(namedQuery("Massage.findAll"));
  }

  public void delete(Massage massage) {
    currentSession().delete(massage);
  }
}
