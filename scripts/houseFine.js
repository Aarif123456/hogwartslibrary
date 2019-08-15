//Abdullah Arif
//Show cumulative fine for each house
function drawChart(houseJSON) {
  var houseArray = [['Category', 'Number of Books in Category']];
  var tmpArr;
  for(var house in houseJSON  ){
      tmpArr = [house.house,house.total];
      houseArray.push(tmpArr);
  }
  var data = google.visualization.arrayToDataTable(houseArray);

  var options = {
    title: 'Cumulative Fine of Hogwart houses'
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));
  chart.draw(data, options);
}
//load after page loads
window.addEventListener('DOMContentLoaded', (event) => {
    //Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/guestCharts";
    var par = "chartType=houseFine";
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          drawChart(JSON.parse(this.responseText));
      }
    }
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.withCredentials = true; 
    xmlhttp.send(par); 

});

