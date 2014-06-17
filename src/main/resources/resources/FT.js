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

function updateDailySummary(result) {
  var dailySummaryTable = document.getElementById("dailyTable");
  //var dailySummaryTable = $("#dailyTable");
  dailySummaryTable.innerHTML = "<tr><th>Number:</th><th>Amount Cavaged:</th><th></th><th></th></tr>";

  var totalPercent = 0;
  var arrayLength = result.length;
  for (var i = 0; i < arrayLength; i++) {
    var feed = result[i];
    var percentTaken = (feed.totalAmount - feed.cavagedAmount)/feed.totalAmount;
    totalPercent += percentTaken;

    percentTaken *= 100;
    dailySummaryTable.innerHTML = dailySummaryTable.innerHTML +
      "<tr><td>"+feed.number+"</td><td>"+feed.cavagedAmount+"</td><td class='" +getPecentageClass(percentTaken) + "'>" +
      percentTaken.toFixed(2) +"%</td><td><img src='red-delete-button.jpg' width='25px' onclick='deleteFeed("+feed.id+")' /></td></tr>";
  }
  var displayPercent = totalPercent/result.length * 100;
  document.getElementById("dailySummary").innerHTML = "Total percent for the day: " + displayPercent.toFixed(2) + "%";
}

function deleteFeed(id) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)            {
      getDailySummary();
    }
  };
  xmlhttp.open("DELETE", "/feed?id="+id, true);
  xmlhttp.send();
}

function getDailySummary() {
  var dateInputValue = document.getElementById("feedDate").value;
  if (dateInputValue == null || dateInputValue == "") {
    dateInputValue =convertDate(new Date());
  }
  sendGetXmlHttpRequest("/feed/"+dateInputValue, updateDailySummary)
}

function convertDate(date) {
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

function clearFields() {
  document.getElementById("feedNumber").value = "";
  document.getElementById("cavagedAmount").value = "";
}

function addFeed() {
  var feed = {
    "cavagedAmount": document.getElementById("cavagedAmount").value,
    "totalAmount": document.getElementById("totalAmount").value,
    "date": document.getElementById("feedDate").value,
    "number": document.getElementById("feedNumber").value
  };

  sendPostXmlHttpRequest("/feed",
                         feed,
                         function() {
                           clearFields();
                           getDailySummary();
                         }
  );
}

function sendPostXmlHttpRequest(url, data, whenDone) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)            {
      whenDone();
    }
  };
  xmlhttp.open("POST", url, true);
  xmlhttp.setRequestHeader("Content-Type","application/json");
  xmlhttp.send(JSON.stringify(data));
}

function sendGetXmlHttpRequest(url, funForResult) {
  var xmlhttp = new XMLHttpRequest();
  var result;
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)            {
      result = JSON.parse(xmlhttp.responseText);
      funForResult(result);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

window.onload = function () {
  getDailySummary();
  document.getElementById("feedDate").value = convertDate(new Date());
}