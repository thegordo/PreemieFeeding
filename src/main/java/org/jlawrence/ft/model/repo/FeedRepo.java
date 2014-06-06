package org.jlawrence.ft.model.repo;

import java.util.Date;
import java.util.List;

import org.jlawrence.ft.model.db.Feed;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface FeedRepo extends PagingAndSortingRepository<Feed, Long> {

  List<Feed> findByDate(@Param("date") Date date);
}
