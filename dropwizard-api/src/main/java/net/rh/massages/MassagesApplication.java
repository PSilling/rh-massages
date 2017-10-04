package net.rh.massages;

import net.rh.massages.core.Facility;
import net.rh.massages.core.Massage;
import net.rh.massages.core.User;
import net.rh.massages.db.FacilityDAO;
import net.rh.massages.db.MassageDAO;
import net.rh.massages.db.UserDAO;
import net.rh.massages.resources.FacilityResource;
import net.rh.massages.resources.MassageResource;
import net.rh.massages.resources.UserResource;
import io.dropwizard.Application;
import io.dropwizard.db.DataSourceFactory;
import io.dropwizard.hibernate.HibernateBundle;
import io.dropwizard.migrations.MigrationsBundle;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

public class MassagesApplication extends Application<MassagesConfiguration> {
	 
	// current portal name
	 public static final String NAME = "Red Hat Massages";
	  
    public static void main(final String[] args) throws Exception {
        new MassagesApplication().run(args);
    }

    @Override
    public String getName() {
        return NAME;
    }
    
    private final HibernateBundle<MassagesConfiguration> hibernate = new HibernateBundle<MassagesConfiguration>(
    		Facility.class, Massage.class, User.class) {
        public DataSourceFactory getDataSourceFactory(MassagesConfiguration configuration) {
            return configuration.getDataSourceFactory();
        }
    };

    @Override
    public void initialize(final Bootstrap<MassagesConfiguration> bootstrap) {
        bootstrap.addBundle(hibernate);
        bootstrap.addBundle(new MigrationsBundle<MassagesConfiguration>() {
            public DataSourceFactory getDataSourceFactory(MassagesConfiguration configuration) {
                return configuration.getDataSourceFactory();
            }
        });
    }

    @Override
    public void run(final MassagesConfiguration configuration,
                    final Environment environment) {
        final FacilityDAO facilityDao = new FacilityDAO(hibernate.getSessionFactory());
        final MassageDAO massageDao = new MassageDAO(hibernate.getSessionFactory());
        final UserDAO userDao = new UserDAO(hibernate.getSessionFactory());
        
        environment.jersey().register(new FacilityResource(facilityDao, massageDao));
        environment.jersey().register(new MassageResource(massageDao));
        environment.jersey().register(new UserResource(massageDao, userDao));
    }
}