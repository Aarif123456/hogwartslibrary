//Abdullah Arif
//Handle librarian taking user payment

function payFine() {
  	var userID=document.getElementById("userID").value.trim();
  	//create parameter to send to server side
  	var amountPaid =document.getElementById("amountPaid").value.trim();
  	var par = "userID="+userID+"&pay="+amountPaid;

  	//Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/payFine";
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      	//console.log( this.responseText);
        var response="The fine is paid";
        if(this.responseText>0){
          response+="<br>The change is $"+this.responseText.toFixed(2);
        }
        document.getElementById("hint").innerHTML = response;
        loadFinedUsers();
      }
    }
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.withCredentials = true;
    
    xmlhttp.send(par); 
    //clear fields
    document.getElementById("fineForm").reset();
}

//load after page loads
window.addEventListener('DOMContentLoaded', (event) => {
  loadFinedUsers();
});

function loadFinedUsers(){
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
    xmlhttp.send("listType=loadFinedMember");
}
function showAvailableUser(userJSON){ //show all users with fines from json file
	var potentialUserText = "<select id='userID' form = 'fineForm'>";
	for (user of userJSON){
		//set user's ID as value
		potentialUserText +="<option value = '" + user['memberID'] + "'>" ;
		//display Id and Name in selection
		potentialUserText +=  user['memberID']+":   " + user["fname"] +" " +user["lname"] +" - " +user['fines'];
		potentialUserText += "</option> ";
	}
	
	potentialUserText += "</select> <br> </div>";
	document.getElementById("userList").innerHTML = potentialUserText;

	
}