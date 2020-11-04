//Abdullah Arif
//Create more librarian
"use strict";
function deleteLibrarian() {
  	var userID=document.getElementById("librarianSelection").value.trim();
  	//create parameter to send to server side
  	var par = "userID="+userID;

  	//Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url="https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/headmaster/deleteLibrarian";
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      	console.log( this.responseText);
        displayForm();
      }
    }
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.withCredentials = true;
    xmlhttp.send(par); 

    //clear fields
    document.getElementById("updateLibrarian").reset();
}

function addLibrarian() {
    var userID=document.getElementById("librarianSelection").value.trim();
    //create parameter to send to server side
    var par = "userID="+userID;

    //Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url="https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/headmaster/addLibrarian";
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log( this.responseText);
        displayForm();
      }
    }
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.withCredentials = true;
    xmlhttp.send(par); 

    //clear fields
    document.getElementById("updateLibrarian").reset();
}
function displayForm(){
      //Set variables needed
      var mode=document.getElementsByName("mode");
      var librarianForm=document.getElementById("librarianForm");
            
      if(mode[0].checked){ //check if added
        librarianForm.innerHTML = 
        `<form name="updateLibrarian" id="updateLibrarian" onsubmit="return false;">
          <label for="librarianSelection" >Potential Librarian:</label>
          <div id="librarianMenu"> 
        <select id="librarianSelection" form = "updateLibrarian">
        </select><br></div>
        <button type="button" onclick="addLibrarian();">Create librarian!</button>
      </form> `;
        loadLibrarianList("loadPotentialLibrarian"); //load the list of potential Librarian
      }
      if(mode[1].checked){ //if delete form
         librarianForm.innerHTML =
         `<form name="updateLibrarian" id="updateLibrarian" onsubmit="return false;">
    <label for="librarianSelection" >Librarian:</label>
    <div id="librarianMenu"> 
      <select id="librarianSelection" form = "updateLibrarian">
      </select><br></div> 
    <button type="button" onclick="deleteLibrarian();">Inactivate librarian</button>
  </form>`;
  loadLibrarianList("loadLibrarian");
      }
  }

function loadLibrarianList(listName){ //use Ajax to get list of librarian or potential librarian
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        try {
          getUserList(JSON.parse(this.responseText));
        }catch (e) {
          console.log(e);
          console.log(this.responseText);
        }
      }
    }
    xmlhttp.open('POST',"https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/loadList", true);
    xmlhttp.withCredentials = true;
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("listType="+listName);
}
//load after page loads
window.addEventListener('DOMContentLoaded', (event) => {
  displayForm();
});

function getUserList(userJSON){ //find potential librarian from json file
	var userListText = "<select id='librarianSelection' form = 'updateLibrarian'>";
	for (let user of userJSON){
		//set user's ID as value
		userListText +="<option value = '" + user['memberID'] + "'>" ;
		//display Id and Name in selection
		userListText +=  user['memberID']+":     " + user["fname"] +" " +user["lname"];
		userListText += "</option> ";
	}
	
	userListText += "</select> <br> </div>";
	document.getElementById("librarianMenu").innerHTML = userListText;

}

