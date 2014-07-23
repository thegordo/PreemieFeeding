package org.jlawrence.ft.model.repo;

import java.util.Date;
import java.util.List;

import org.jlawrence.ft.model.db.Feed;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface FeedRepo extends PagingAndSortingRepository<Feed, Long> {
  List<Feed> findByDateOrderByNumberAsc(@Param("date") Date date);

  @Query(value = "Select c from Feed c where c.date >= ?1 and c.date <= ?2 order by c.date")
  List<Feed> getFeedsForDates(Date past, Date today);
}
