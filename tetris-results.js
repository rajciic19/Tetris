$(document).ready(function() {
    showResults();
    showLastResult();
  });

  function showResults() {
    var results = JSON.parse(localStorage.getItem("tetrisResults")) || [];
    var tableBody = $("#resultTable");
    tableBody.empty();
    for (var i = 0; i < Math.min(results.length, 5); i++) {
      var result = results[i];
      var row = "<tr><td>" + result.name + "</td><td>" + result.score + "</td></tr>";
      tableBody.append(row);
    }
  }

  function showLastResult() {
    var urlParams = new URLSearchParams(window.location.search);
    var playerName = urlParams.get("name");
    var score = urlParams.get("score");

    var lastResultTableBody = $("#lastResultTable");
    lastResultTableBody.empty();
    if (playerName && score) {
      var row = "<tr><td>" + decodeURIComponent(playerName) + "</td><td>" + score + "</td></tr>";
      lastResultTableBody.append(row);
    }
  }