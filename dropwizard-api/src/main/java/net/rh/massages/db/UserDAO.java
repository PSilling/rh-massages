package net.rh.massages.db;

import io.dropwizard.hibernate.AbstractDAO;

import java.util.List;

import net.rh.massages.core.User;

import org.hibernate.SessionFactory;

public class UserDAO extends AbstractDAO<User> {

  public UserDAO(SessionFactory sessionFactory) {
    super(sessionFactory);
  }

  public User create(User user) {
    return persist(user);
  }
  
  public User update(User user) {
    currentSession().clear();
    return persist(user);
  }

  public User findById(Long id) {
    return get(id);
  }

  public User findByName(String name) {
    return uniqueResult(namedQuery("User.findByName").setParameter("name", name));
  }
  
  public User findByEmail(String email) {
    return uniqueResult(namedQuery("User.findByEmail").setParameter("email", email));
  }
  
  public User findByAdmin(boolean admin) {
    return uniqueResult(namedQuery("User.findByAdmin").setParameter("admin", admin));
  }

  public List<User> findAll() {
    return list(namedQuery("User.findAll"));
  }

  public void delete(User user) {
    currentSession().delete(user);
  }
}
