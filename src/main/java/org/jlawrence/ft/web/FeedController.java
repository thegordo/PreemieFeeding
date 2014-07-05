 package org.jlawrence.ft.web;

import java.text.ParseException;
import java.util.Date;
import java.util.List;


import org.apache.log4j.Logger;
import org.jlawrence.ft.model.db.Feed;
import org.jlawrence.ft.model.json.FeedSummary;
import org.jlawrence.ft.model.repo.FeedRepo;
import org.jlawrence.ft.model.util.Serializer;
import org.jlawrence.ft.service.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/app/feed")
public class FeedController {

  private final FeedRepo repo;
  private final FeedService feedService;

  @Autowired
  public FeedController(FeedRepo repo, FeedService service) {
    this.repo = repo;
    this.feedService = service;
  }

  @RequestMapping(value = "{date}", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<List<Feed>> getFeedByDate(@PathVariable("date") String date) {
    try {
      Date parsed = Serializer.dateFormat.parse(date);

      List<Feed> feeds = repo.findByDateOrderByNumberAsc(parsed);
      return new ResponseEntity<>(feeds, HttpStatus.OK);
    }
    catch (ParseException e) {
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
  }

  @RequestMapping(method = RequestMethod.POST)
  public ResponseEntity<String> saveFeeding(@RequestBody Feed feed) {
    try {
      repo.save(feed);
      return new ResponseEntity<>("ok", HttpStatus.OK);
    }
    catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(method = RequestMethod.DELETE)
  public ResponseEntity<String> removeFeed(@RequestParam(value = "id", required = true) long id) {
    try {
      repo.delete(id);
      return new ResponseEntity<>("ok", HttpStatus.OK);
    }
    catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(value = "/batch", method=RequestMethod.POST)
  public ResponseEntity<String> addFeedForAllDay(@RequestBody List<Feed> feeds) {
    try {
      for (Feed feed : feeds) {
        repo.save(feed);
      }
      return new ResponseEntity<>("ok", HttpStatus.OK);
    }
    catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RequestMapping(value = "/fiveDay", method=RequestMethod.GET)
  public ResponseEntity<List<FeedSummary>> get5DaySummary() {
    try {
      List<FeedSummary> feedSummaryList = feedService.getFiveDaySummary();

      return new ResponseEntity<>(feedSummaryList, HttpStatus.OK);
    }
    catch (Exception e) {
      Logger.getInstance(getClass()).error("couldn't get five day", e);
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

