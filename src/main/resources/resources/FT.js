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
      "tubeFedAmount": $("#tubeFed" + index).val(),
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
    var tableHtml = "<tr><th class='feed'>Number:</th><th  class='feed'>Amount Tube Fed:</th><th  class='feed'></th><th  class='feed'></th></tr>";
    var totalPercent = 0;
    var arrayLength = data.length;
    document.getElementById("feedNumber").value = arrayLength + 1;
    for (var i = 0; i < arrayLength; i++) {
      var feed = data[i];
      var percentTaken = (feed.totalAmount - feed.tubeFedAmount)/feed.totalAmount;
      totalPercent += percentTaken;

      percentTaken *= 100;
      tableHtml += "<tr><td class='feed'>"+feed.number+"</td><td class='feed'>"+feed.tubeFedAmount+"</td><td class='feed " +getPecentageClass(percentTaken) + "'>" +
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
  $("#tubeFedAmount").val("");
}

function addFeed() {
  var feed = {
    "tubeFedAmount": $("#tubeFedAmount").val(),
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

function calculateHydrationNeed(weight) {
  var firstBlock = weight;
  var secondBlock = 0;
  var thirdBlock = 0;
  if(weight > 10) {
    firstBlock = 10;
    if(weight < 20) {
      secondBlock = weight - 10;
    }
  }
  if(weight > 20) {
    secondBlock = 10;
    thirdBlock = weight - 20;
  }

  return 100 * firstBlock + 50 * secondBlock + 20 * thirdBlock;
}
function calculateContinuousFeedingAmount() {
  var percentTakenAtNight = $("#nightFeedPercentInput").val()/100;
  var caloriesPerKG = $("#cCaloriesPerKGInput").val();
  var weight = $("#cWeightInput").val();
  var caloriesNeed = weight * caloriesPerKG;
  var caloricInput = $("#cCaloricInput").val();
  var numberOfFeeds = $("#cNumFeedsInput").val();
  var hoursOfContinuous = $("#cHoursContinuous").val();
  var ounceToMillsConversion = 29.5735;

  var dailyTotal = caloriesNeed / caloricInput * ounceToMillsConversion;
  var nightAmount = dailyTotal * percentTakenAtNight;
  var amount = (dailyTotal-nightAmount) / numberOfFeeds;
  var rate = nightAmount/hoursOfContinuous;
  var hydrationNeed = calculateHydrationNeed(weight);
  var hNightAmount = hydrationNeed * percentTakenAtNight;
  var hAmount =  (hydrationNeed - hNightAmount ) / numberOfFeeds;
  var hRate = hNightAmount / hoursOfContinuous;


  $("#cResult").html("Target Calories per day: " + Math.round(caloriesNeed) +
    "<table>"+
    "<tr>"+
      "<th></th>"+
      "<th>Caloric Calculations</th>"+
      "<th>Hydration Calculations</th>"+
    "</tr>"+
    "<tr>"+
        "<th>Total Daily Volume:</th>" +
      "<td>" + Math.round(dailyTotal) + "ml </td>"+
      "<td>" + Math.round(hydrationNeed) + "ml </td>"+
    "</tr>"+
    "<tr>"+
        "<th>Milliliters per bottle:</th>"+
      "<td>" + Math.round(amount) + "</td>"+
      "<td>" + Math.round(hAmount) + "</td>"+
    "</tr>"+
    "<tr>"+
      "<th>Night Feed:</th>"+
      "<td>" + Math.round(nightAmount) + "(" + Math.round(rate) + " ml/hr)</td>"+
      "<td>"  + Math.round(hNightAmount) + "(" + Math.round(hRate) + " ml/hr)</td>"+
    "</tr>"+
  "</table>");

}

function calculateTotalCalories() {
  var caloricContent = Number($("#caloricContent").val());
  var numberOfFeeds = Number($("#numberOfFeeds").val());
  var feedAmount = Number($("#bottleAmount").val());
  var nightFeedAmount = Number($("#nightFeedAmount").val());
  var ounceToMillsConversion = 29.5735;

  var dailyTotal = (numberOfFeeds*feedAmount) + nightFeedAmount;
  var totalOunces = dailyTotal/ounceToMillsConversion;
  var totalCalories = totalOunces * caloricContent;

  $("#result2").html("Total calories fed:" + Math.round(totalCalories));

}

function fixEntries() {
  var tableHtml = "<thead><tr><th>Number:</th><th>Amount Tube Fed:</th><th>total Amount:</th></tr></thead>";
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

function setupFiveDayTrend() {
  $.getJSON("/app/feed/fiveDay", function (sets) {
    var labelArray = [];
    var dataPoints = [];

    for(var index = 0; index < sets.length; index++) {
      labelArray[index] = sets[index].date;
      dataPoints[index] = sets[index].percentByMouth;
    }

    var data = {
      labels: labelArray,
      datasets: [
        {
          label: "Percent Taken Orally",
          fillColor: "rgba(102, 194, 133, 0.2)",
          strokeColor: "rgba(102, 194, 133, 1.0)",
          pointColor: "rgba(102, 194, 133, 1.0)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: dataPoints
        }
      ]
    };

    var ctx = $("#fiveDayTrend").get(0).getContext("2d");
    new Chart(ctx).Line(data);

  });
}


function getReport() {
  var url = "/app/feed/report?";
  url += "startDate=" + $("#startDate").val() + "&";
  url += "endDate=" + $("#endDate").val();
  $.getJSON(url, function (sets) {
    var labelArray = [];
    var dataPoints = [];

    for(var index = 0; index < sets.length; index++) {
      labelArray[index] = sets[index].date;
      dataPoints[index] = sets[index].percentByMouth;
    }

    var data = {
      labels: labelArray,
      datasets: [
        {
          label: "Percent Taken Orally",
          fillColor: "rgba(102, 194, 133, 0.2)",
          strokeColor: "rgba(102, 194, 133, 1.0)",
          pointColor: "rgba(102, 194, 133, 1.0)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: dataPoints
        }
      ]
    };

    var ctx = $("#reportGraph").get(0).getContext("2d");
    new Chart(ctx).Line(data);

  });
}

