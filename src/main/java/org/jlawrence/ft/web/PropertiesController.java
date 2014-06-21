package org.jlawrence.ft.web;

import java.io.IOException;

import org.apache.log4j.Logger;
import org.jlawrence.ft.service.PropertiesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller()
@RequestMapping(value = "/app/properties")
public class PropertiesController {

  private static final Logger logger = Logger.getLogger(PropertiesController.class);

  private PropertiesService propService;

  @Autowired
  public PropertiesController(PropertiesService service) {
    this.propService = service;
  }

  @RequestMapping(method = RequestMethod.GET)
  public ResponseEntity<String> getProperty(@RequestParam(value = "key", required = true) String key) {
    String value = propService.getProperty(key);
    return new ResponseEntity<>(value, HttpStatus.OK);
  }

  @RequestMapping(method = RequestMethod.POST)
  public ResponseEntity setProperty(
    @RequestParam(value = "key", required = true) String key,
    @RequestParam(value = "value", required = true) String value
  ) {
    try {
      propService.setProperty(key, value);
      return new ResponseEntity(HttpStatus.OK);
    }
    catch (IOException e) {
      logger.error("Error saving the properties", e);
      return new ResponseEntity(HttpStatus.NOT_MODIFIED);
    }
  }
}
