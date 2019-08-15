//Abdullah Arif
//Create more librarian
function createLibrarian() {
  	var userID=document.getElementById("librarianSelection").value.trim();
  	//create parameter to send to server side
  	var active =(document.getElementById("activeBox").checked)?"1":"0";
  	var par = "userID="+userID+"&add=yes"+"&active="+active;

  	//Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/manageLibrarian.php";
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      	console.log( this.responseText);
        loadPotentialLibrarian();
      }
    }
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.withCredentials = true;
    xmlhttp.send(par); 

    //clear fields
    document.getElementById("addLibrarian").reset();
}


//load after page loads
window.addEventListener('DOMContentLoaded', (event) => {
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
    xmlhttp.open('GET',"https://arif115.myweb.cs.uwindsor.ca/60334/projects/loadPotentialLibrarian.php", true);
    xmlhttp.withCredentials = true;
    xmlhttp.send();
};

function showAvailableUser(userJSON){ //find potential librarian from json file
	var potentialLibrarianText = "<select id='librarianSelection' form = 'addLibrarian'>";
	for (user of userJSON){
		//set user's ID as value
		potentialLibrarianText +="<option value = '" + user['memberID'] + "'>" ;
		//display Id and Name in selection
		potentialLibrarianText +=  user['memberID']+":     " + user["fname"] +" " +user["lname"];
		potentialLibrarianText += "</option> ";
	}
	
	potentialLibrarianText += "</select> <br> </div>";
	document.getElementById("librarianMenu").innerHTML = potentialLibrarianText;

	
}