package org.jlawrence.ft.model.util;

import java.io.IOException;
import java.text.ParseException;
import java.util.Date;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;


public class JacksonDateDeserializer extends JsonDeserializer<Date> implements Serializer {
  @Override
  public Date deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
    try {
      return dateFormat.parse(jp.getText());
    }
    catch (ParseException e) {
      throw new IOException(e);
    }
  }
}
