package org.jlawrence.ft.model.json;

import java.util.Date;

public class FeedSummary {
  private Date date;
  private double percentByMouth;

  public FeedSummary() {
  }

  public FeedSummary(Date date, double percentByMouth) {
    this.date = date;
    this.percentByMouth = percentByMouth;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public double getPercentByMouth() {
    return percentByMouth;
  }

  public void setPercentByMouth(double percentByMouth) {
    this.percentByMouth = percentByMouth;
  }
}
