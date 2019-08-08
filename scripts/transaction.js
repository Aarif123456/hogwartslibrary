
function checkOutBook() {
  	var borrowedBy=document.getElementById("borrowedBy").value.trim();
  	//create parameter to send to server side
  	var bookBarcode =(document.getElementById("bookBarcode").checked)?"1":"0";
  	var par = "borrowedBy="+borrowedBy+"&bookBarcode="+bookBarcode;

  	//Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/checkout.php";
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      	console.log( this.responseText);
        loadPotentialBorrower();
      }
    }
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.withCredentials = true;
    
    xmlhttp.send(par); 
    //clear fields
    document.getElementById("checkOut").reset();
}

//load after page loads
window.onload =loadPotentialBorrower();

function loadPotentialBorrower(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      	try {
			showAvailableUser(JSON.parse(this.responseText));
		}
		catch (e) {
			console.log(this.responseText);
		}
      }
  	}
    xmlhttp.open('GET',"https://arif115.myweb.cs.uwindsor.ca/60334/projects/loadPotentialBorrower.php", true);
    //**load potential borrower will read session and check which user to not display
    xmlhttp.withCredentials = true;
    xmlhttp.send();
}
function showAvailableUser(userJSON){ //find potential librarian from json file
	var potentialUserText = "<select id='borrowedBy' form = 'checkOut'>";
	for (user of userJSON){
		//set user's ID as value
		potentialUserText +="<option value = '" + user['memberID'] + "'>" ;
		//display Id and Name in selection
		potentialUserText +=  user['memberID']+":     " + user["fname"] +" " +user["lname"];
		potentialUserText += "</option> ";
	}
	
	potentialUserText += "</select> <br> </div>";
	document.getElementById("userList").innerHTML = potentialUserText;

	
}