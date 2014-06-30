function getPecentageClass(percentTaken) {
  if(percentTaken != 0 && percentTaken < 30) {
    return  "bad";
  }
  else if(percentTaken >= 30 && percentTaken < 70) {
    return "ok";
  }
  else if(percentTaken >= 70) {
    return "good";
  }
}

function deleteFeed(id) {
  $.ajax({
           url: "/app/feed?id="+id,
           type: "delete",
           contentType: "application/json",
           success: function () {
             getDailySummary();
           }
         }
  );
}

function submitBulkFeeds () {
  var count = $("#numberOfFeeds").val();
  var feedArray = [];
  for (var index = 0; index < count; index ++) {
    var date = $("#date").val();
    feedArray[index] = {
      "cavagedAmount": $("#tubeFed" + index).val(),
      "totalAmount": $("#totalAmount" + index).val(),
      "date": date,
      "number": $("#bulkNumber" + index).val()
    };
  }
  $.ajax({
           url: "/app/feed/batch",
           type: "POST",
           contentType: "application/json",
           data: JSON.stringify(feedArray),
           success: function () {
           }
         })
}

function getDailySummary() {
  var dateInputValue = $("#feedDate").val();
  if (dateInputValue == null || dateInputValue == "") {
    dateInputValue =convertDate(new Date());
  }
  $.getJSON("/app/feed/"+dateInputValue, null, function updateDailySummary(data, status, xhr){
    var tableHtml = "<tr><th class='feed'>Number:</th><th  class='feed'>Amount Cavaged:</th><th  class='feed'></th><th  class='feed'></th></tr>";
    var totalPercent = 0;
    var arrayLength = data.length;
    for (var i = 0; i < arrayLength; i++) {
      var feed = data[i];
      var percentTaken = (feed.totalAmount - feed.cavagedAmount)/feed.totalAmount;
      totalPercent += percentTaken;

      percentTaken *= 100;
      tableHtml += "<tr><td class='feed'>"+feed.number+"</td><td class='feed'>"+feed.cavagedAmount+"</td><td class='feed " +getPecentageClass(percentTaken) + "'>" +
        percentTaken.toFixed(2) +"%</td><td class='feed'><img src='red-delete-button.jpg' width='25px' onclick='deleteFeed("+feed.id+")' /></td></tr>";
    }
    var displayPercent = totalPercent/data.length * 100;

    $("#dailyTable").html(tableHtml);
    $("#dailySummary").html("Total percent for the day: " + displayPercent.toFixed(2) + "%");
  });
}

function convertDate(date) {
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

function clearFields() {
  $("#feedNumber").val("");
  $("#cavagedAmount").val("");
}

function addFeed() {
  var feed = {
    "cavagedAmount": $("#cavagedAmount").val(),
    "totalAmount": $("#totalAmount").val(),
    "date": $("#feedDate").val(),
    "number": $("#feedNumber").val()
  };

  $.ajax({
           url: "/app/feed",
           type: "POST",
           contentType: "application/json",
           data: JSON.stringify(feed),
           success: function () {
             getDailySummary();
             clearFields();
           }
         }
  );
}

function getDefaultAmount(setDefault) {
  $.getJSON("/app/properties?key=defaultAmount", null, function updateDailySummary(data, status, xhr) {
    setDefault(data);
  });
}

function setDefaultValueAmount () {
  getDefaultAmount(function(data) {
    $("#totalAmount").val(data);
  });
}

function updateProperty() {

  var key = "defaultAmount";
  var value = $("#defaultAmountVal").val();

  var url = "/app/properties?key="+key+"&value="+value;

  $.ajax({
           url: url,
           type: "POST",
           contentType: "application/json",
           success: function() {
             $("#result").html("Mission Completed");
             $("#defaultAmountVal").val("");
           }
         }
  );
}

function calculateFeedingAmount() {
  var weight = $("#weightInput").val()/10;
  var caloricInput = $("#caloricInput").val();
  var numberOfFeeds = $("#numFeedsInput").val();
  var ounceToMillsConversion = 29.5735;

  var dailyTotal = weight / caloricInput * ounceToMillsConversion;
  var amount = dailyTotal / numberOfFeeds;

  $("#result").html(Math.round(amount) + "ml per bottle.<br />" + Math.round(dailyTotal) + "ml per day.");
}

function fixEntries() {
  var tableHtml = "<thead><tr><th>Number:</th><th>Amount Cavaged:</th><th>total Amount:</th></tr></thead>";
  var numEntries = $("#numberOfFeeds").val();
  for (var index =0; index < numEntries; index ++) {

    tableHtml += "<tr><td><input id='bulkNumber"+ index +"' type='number' value='"+(index +1)+"'/></td><td><input id='tubeFed"
      + index + "' type='number' /></td><td><input id='totalAmount" + index + "' class='totalAmount' type='number' /></td></tr>";

    var id = "totalAmount"+index;
  }
  $("#feedInputs").html(tableHtml);
  getDefaultAmount(function (data) {
    $(".totalAmount").val(data);
  })
}