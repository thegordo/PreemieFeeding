 package org.jlawrence.ft.web;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.URISyntaxException;
import java.net.URL;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Scanner;


import org.jlawrence.ft.model.db.Feed;
import org.jlawrence.ft.model.repo.FeedRepo;
import org.jlawrence.ft.model.util.Serializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class FeedController {

  final FeedRepo repo;

  @Autowired
  public FeedController(FeedRepo repo) {
    this.repo = repo;
  }

  @RequestMapping(value = "/feed/{date}", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<Feed>> getFeedByDate(@PathVariable("date") String date) {
    try {
      Date parsed = Serializer.dateFormat.parse(date);

      List<Feed> feeds = repo.findByDate(parsed);
      return new ResponseEntity<>(feeds, HttpStatus.OK);
    }
    catch (ParseException e) {
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
  }

  @RequestMapping(value = "/feed", method = RequestMethod.POST)
  public ResponseEntity<String> saveFeeding(@RequestBody Feed feed) {
    try {
      repo.save(feed);
      return new ResponseEntity<>("ok", HttpStatus.OK);
    }
    catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

