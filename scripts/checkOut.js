//Abdullah Arif
//Handle librarian signing books out to user

function checkOutBook() {
  	var borrowedBy=document.getElementById("borrowedBy").value.trim();
  	//create parameter to send to server side
  	var bookBarcode =document.getElementById("bookBarcode").value;
  	var par = "borrowedBy="+borrowedBy+"&bookBarcode="+bookBarcode;

  	//Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/checkOut";
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      	console.log( this.responseText);
        document.getElementById("hint").innerHTML = this.responseText;
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
window.addEventListener('DOMContentLoaded', (event) => {
    loadPotentialBorrower();
});

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
    xmlhttp.open('POST',"https://arif115.myweb.cs.uwindsor.ca/60334/projects/loadList", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.withCredentials = true;
    xmlhttp.send("listType=loadPotentialBorrower");
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