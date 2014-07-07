package org.jlawrence.ft.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jlawrence.ft.model.db.Feed;
import org.jlawrence.ft.model.json.FeedSummary;
import org.jlawrence.ft.model.repo.FeedRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FeedService {

  private final FeedRepo repo;

  @Autowired
  public FeedService(FeedRepo repo) {
    this.repo = repo;
  }

  public List<FeedSummary> getFiveDaySummary() {
    Calendar today = Calendar.getInstance();
    Calendar past = Calendar.getInstance();
    past.add(Calendar.DAY_OF_MONTH, -5);

    List<Feed> feedList = repo.findFiveDaysFeed(today.getTime(), past.getTime());

    Map<Date, List<Feed>> feedMap = new HashMap<>();

    for (Feed feed : feedList) {
      if(feedMap.get(feed.getDate())== null) {
        feedMap.put(feed.getDate(), new ArrayList<Feed>());
      }
      feedMap.get(feed.getDate()).add(feed);
    }

    List<FeedSummary> list = new ArrayList<>();
    for (List<Feed> feeds : feedMap.values()) {
      int totalTubeFed = 0;
      int totalGiven = 0;
      for (Feed feed : feeds) {
        totalTubeFed += feed.getTubeFedAmount();
        totalGiven += feed.getTotalAmount();
      }
      double dailyPercent = Math.round(100-(((totalTubeFed + 0.0)/(totalGiven + 0.0))*100));
      list.add(new FeedSummary(feeds.get(0).getDate(), dailyPercent));
    }
    Collections.sort(list, new Comparator<FeedSummary>() {
      @Override
      public int compare(FeedSummary o1, FeedSummary o2) {
        return o1.getDate().compareTo(o2.getDate());
      }
    });
    return list;
  }
}
