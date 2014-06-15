package org.jlawrence.ft.model.db;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.jlawrence.ft.model.util.JacksonDateDeserializer;
import org.jlawrence.ft.model.util.JacksonDateSerializer;

@Entity
public class Feed {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column
  private Long cavagedAmount;

  @Column
  private Long totalAmount;

  @Column
  private Integer number;

  @Column
  @Temporal(TemporalType.DATE)
  @JsonSerialize(using = JacksonDateSerializer.class)
  @JsonDeserialize(using = JacksonDateDeserializer.class)
  private Date date;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getCavagedAmount() {
    return cavagedAmount;
  }

  public void setCavagedAmount(Long cavagedAmount) {
    this.cavagedAmount = cavagedAmount;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public Long getTotalAmount() {
    return totalAmount;
  }

  public void setTotalAmount(Long totalAmount) {
    this.totalAmount = totalAmount;
  }

  public Integer getNumber() {
    return number;
  }

  public void setNumber(Integer number) {
    this.number = number;
  }

  @Override
  public String toString() {
    return "Feed{" +
      "id=" + id +
      ", cavagedAmount=" + cavagedAmount +
      ", date=" + date +
      ", number=" + number +
      '}';
  }
}
