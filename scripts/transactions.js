//Abdullah Arif
//Handle librarian signing books out to user
"use strict";
function checkOutBook() {
  	var borrowedBy=document.getElementById("borrowedBy").value.trim();
  	//create parameter to send to server side
  	var bookBarcode =document.getElementById("bookBarcode").value.trim();
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

function holdBook(){
    var userID=document.getElementById("borrowedBy").value.trim();
    //create parameter to send to server side
    var bookISBN =document.getElementById("bookISBN").value.trim();
    var par = "userID="+userID+"&bookISBN="+bookISBN;

    //Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/holdBooks";
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log( this.responseText);
        document.getElementById("hint").innerHTML = this.responseText;
        //loadPotentialBorrower();
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
function showAvailableUser(userJSON){ //find potential user from json file
	var potentialUserText = "<select id='borrowedBy' form = 'checkOut'>";
	for (user of userJSON){
		//set user's ID as value
    //**create on-change event that runs when drop-down is changed and if student if it gets the 
		potentialUserText +="<option value = '" + user['memberID'] + "'>" ; 
		//display Id and Name in selection
		potentialUserText +=  user['memberID']+":     " + user["fname"] +" " +user["lname"];
		potentialUserText += "</option> ";
	}	
	potentialUserText += "</select> <br> </div>";
	document.getElementById("userList").innerHTML = potentialUserText;

  //** if in hold menu check to see if user is student if they are create a check box that will trigger a another drop-down with their courses when clicked

	
}