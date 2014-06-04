package org.jlawrence.ft.model.util;

import java.io.IOException;
import java.util.Date;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class JacksonDateSerializer extends JsonSerializer<Date> implements  Serializer {


  @Override
  public void serialize(Date date, JsonGenerator gen, SerializerProvider provider) throws IOException {
    String formattedDate = dateFormat.format(date);
    gen.writeString(formattedDate);
  }
}
