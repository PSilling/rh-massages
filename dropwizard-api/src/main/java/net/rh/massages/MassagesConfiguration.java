package net.rh.massages;

import io.dropwizard.Configuration;
import io.dropwizard.db.DataSourceFactory;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.URL;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MassagesConfiguration extends Configuration {

	@NotNull
  	@URL
  	private String domain;
	  
	@Valid
	@NotNull
	private DataSourceFactory database = new DataSourceFactory();
	
	@JsonProperty("database")
	public void setDataSourceFactory(DataSourceFactory factory) {
	    this.database = factory;
	}
	
	@JsonProperty("database")
	public DataSourceFactory getDataSourceFactory() {
	    return database;
	}
	
	public String getDomain() {
	  return domain;
  	}

  	public void setDomain(String domain) {
	  this.domain = domain;
  	}
}
