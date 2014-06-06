 package org.jlawrence.ft.web;

import java.text.ParseException;
import java.util.Date;
import java.util.List;


import org.jlawrence.ft.model.db.Feed;
import org.jlawrence.ft.model.repo.FeedRepo;
import org.jlawrence.ft.model.util.Serializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
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
  public HttpEntity<List<Feed>> getFeedByDate(@PathVariable("date") String date) {
    try {
      System.out.println("Date received: " + date);
      Date parsed = Serializer.dateFormat.parse(date);

      List<Feed> feeds = repo.findByDate(parsed);
      return new ResponseEntity<>(feeds, HttpStatus.OK);
    }
    catch (ParseException e) {
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
  }

  @RequestMapping(value = "/feed", method = RequestMethod.POST, consumes = "application/json")
  public HttpEntity saveFeeding(@RequestBody Feed feed) {
    System.out.println("Saving feed:" + feed);
    repo.save(feed);
    return new ResponseEntity(HttpStatus.OK);
  }
}

