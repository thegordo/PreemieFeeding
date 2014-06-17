package org.jlawrence.ft.service;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

@Component
public class PropertiesService {
  private static final Logger logger = Logger.getLogger(PropertiesService.class);
  private static final String fileName = "FT.properties";
  private Properties properties;

  public PropertiesService() {
    properties = new Properties();
    try {
      properties.load(new FileInputStream(fileName));
    }
    catch (IOException e) {
      logger.error("Failed to load the properties file", e);
    }
  }

  public String getProperty(String key) {
    return properties.getProperty(key);
  }

  public void setProperty(String key, String value) throws IOException {
    properties.setProperty(key, value);
    storeProperties();
  }

  public void storeProperties() throws IOException{
    properties.store(new FileOutputStream(fileName), "");
  }
}
