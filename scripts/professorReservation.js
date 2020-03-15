//Abdullah Arif
//handle reservation for professors
"use strict";
var reservationList={};
var courseList={};
//add reservation 
function addReservation(){
	var courseID=document.getElementById("courseSelection").value.trim();
	var profID=document.getElementById("professorSelection").value.trim();
	var bookISBN=document.getElementById("bookISBN").value.trim();
	var numCopies=document.getElementById("numCopies").value.trim();
  //create parameter to send to server side
  var par = "courseID="+courseID+"&bookISBN="+bookISBN+"&numCopies="
  +numCopies+"&add=yes"+"&userID="+profID;

  //Ajax insert
  var xmlhttp = new XMLHttpRequest();
  var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/manageReservation.php";
  xmlhttp.open('POST', url, true);
  xmlhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) {
  		document.getElementById("hint").innerHTML=this.responseText;
  		renderCurrentReservation(true);
      	displayForm(); //clear form
  }
}
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.withCredentials = true;
xmlhttp.send(par); 

  //clear fields
  //document.getElementById("reservationForm").reset();
}
//delete reservation 
function deleteReservation(){
	var courseID=document.getElementById("courseSelection").value.trim();
	var profID=document.getElementById("professorSelection").value.trim();
	var bookISBN=document.getElementById("bookISBNSelection").value.trim();
  //create parameter to send to server side
  var par = "courseID="+courseID+"&bookISBN="+bookISBN+"&delete=yes"+"&userID="+profID;;

  //Ajax insert
  var xmlhttp = new XMLHttpRequest();
  var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/manageReservation.php";
  xmlhttp.open('POST', url, true);
  xmlhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) {
  		document.getElementById("hint").innerHTML=this.responseText;
  		renderCurrentReservation(true);
      displayForm(); //clear field while staying on same course
  }
}
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.withCredentials = true;
xmlhttp.send(par); 

  //clear fields
  //document.getElementById("reservationForm").reset();
}

//load up the add reservation form when page loads up
window.addEventListener('DOMContentLoaded', (event) => {
  /*load courses for both add and delete forms because the 
  courses profs teach will not change by modifying reservation*/
  displayForm();
  var profID=document.getElementById("professorSelection").value.trim();
  if(profID !=-1){ //if you are a librarian
  	loadReserveList(getProfessors,"loadProfessor");
  }
  renderProfessorCourses();
});
//if you change professor reload courses
function changeProfessor(){
	renderProfessorCourses();
}
//toggling add and delete form
function displayForm(){
  //Get mode - either adding or subtracting and the div of the form
  var mode=document.getElementsByName("mode");
  var reservationForm=document.getElementById("reservationMenu");
  var courseID=document.getElementById("courseSelection").value.trim();
  var profID=document.getElementById("professorSelection").value.trim();
  reservationForm.innerHTML =  `<form autocomplete="off" name="reservationForm" 
  id="reservationForm" onsubmit="return false;">`;
  if(mode[0].checked){ //check if added

  	if(profID!=0 && courseID!=-1){
  		reservationForm.innerHTML+=`<label for="numCopies" >Number of copy to reserve (Max 10): </label>
  		<input type='text' id='numCopies' name='numCopies' onchange="setNumberCopies();">
  		<div class="autocomplete" style="width:700px;">
  		<label for="bookISBN" >ISBN of book to reserve: </label>
  		<input id="bookISBN" type="text" name="bookISBN" placeholder="978-0-0953-8960-0">
  		</div>
  		<button type="button"  onclick="addReservation();">Reserve book for course!</button>`;
  	}
  	reservationForm.innerHTML+=`</form> <div id="hint"></div>`;
    //get bookISBN from text-box
    //loadReserveList(getBookISBN,"loadAvailableBooks");
}
  if(mode[1].checked){ //if delete form
  	reservationForm.innerHTML +=
  	`<div id="bookISBNMenu">
  	</div>
  	<br>`;
  	if(profID!=0 && courseID!=-1 ){
		reservationForm.innerHTML+=`<button type="button" id="deleteButton" onclick="deleteReservation();
		">Delete reservation</button>`;
		renderCurrentReservation(false);
  	}
    //getCurrentely reserved books that looks at the currently chosen course in the drop-down
 }
 reservationForm.innerHTML+=`</form> <div id="hint"></div>`;
}
function loadReserveList(getList,listName){ //use Ajax to create needed list
	var xmlhttp = new XMLHttpRequest();
	var courseID=document.getElementById("courseSelection").value.trim();
  //use to work with librarian reservation
  var profID=document.getElementById("professorSelection").value.trim();
  xmlhttp.onreadystatechange = function() {
  	if (this.readyState == 4 && this.status == 200) {
  		try {
  			if(this.responseText.trim()=="No rows"){
  				getList(this.responseText.trim());
  			}
  			else{
  				getList(JSON.parse(this.responseText));
  			}
  		}
  		catch (e) {
  			console.log(this.responseText);
  			console.log(e);
  			console.log(listName);
  		}
  	}
  }
  xmlhttp.open('POST',"https://arif115.myweb.cs.uwindsor.ca/60334/projects/reservationList", true);
  xmlhttp.withCredentials = true;
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("listType="+listName+"&courseID="+courseID+"&userID="+profID);
}


function getProfessorCourses(courseJSON){
	var profID=document.getElementById("professorSelection").value.trim();
	if(courseJSON=="No rows"){
		courseList[profID]=`This professor is not teaching any courses
		<input type="hidden" id="courseSelection" value="-1" >`;
	}
	else{ 
		var courseListText=`<select id='courseSelection' form='reservationForm' 
		onchange="displayForm();">`;
		for (let course of courseJSON){
	    //set course's ID as value
	    courseListText +="<option value = '" + course['courseID'] + "'>" ;
	    //display Id and Name in selection
	    courseListText +=  course['courseID']+":     " + course["courseName"];
	    courseListText += "</option> ";
	}
	courseListText += "</select> <br> </div>";
	courseList[profID] =courseListText;
	}
	renderProfessorCourses(false);
}
//courses by prof drop-down 
function renderProfessorCourses(update){
	var profID=document.getElementById("professorSelection").value.trim();
	if(profID==0){
		return;
	}
	if(update || courseList[profID]==undefined ){
		loadReserveList(getProfessorCourses,"loadCourses");
	}
	else{
		try {
			document.getElementById("courseMenu").innerHTML = courseList[profID];
			displayForm(); //display form after courses have loaded
		}
		catch(e){ //if course menu is gone
		  	console.log(e);
		  	//console.log(courseListText);
		}
	}
}
/////////////////for librarians/////////////////////
function getProfessors(professorJSON){
	if(professorJSON=="No rows"){
		document.getElementById("professorMenu").innerHTML = `This library system has no professor:(
		<input type="hidden" id="professorSelection" value="0" >`;
		document.getElementById("reservationMenu").innerHTML="";
	}
	else{ 
		var professorListText =`<select id='professorSelection' form='reservationForm' 
		onchange="changeProfessor();">`;
		for (let professor of professorJSON){
		  //set professor's ID as value
		  professorListText +="<option value = '" + professor['professorID'] + "'>" ;
		  //display Id and Name in selection
		  professorListText +=  professor['professorID']+":     " + professor["fname"] +
		  " " +professor["lname"];
		  professorListText += "</option> ";
		}
		professorListText += "</select> </div>";
		try {
			document.getElementById("professorMenu").innerHTML = professorListText;}
	  catch(e){ //if menu is gone
	  	console.log(e);
	  	//console.log(professorListText);
	  }
	}
}
/////////////////for add form ///////////////////////
//number of copies prof wants to reserve force stay between 1 and 10
function setNumberCopies(){
	var numCopies = parseInt(document.getElementById("numCopies").value.trim(),10);
	if(isNaN(numCopies)){
		numCopies=0;
	}
	if(numCopies<0){
		numCopies=0;
	}
	if(numCopies>10){
		numCopies=10;
	}
	try {
		document.getElementById("numCopies").value = String(numCopies);
	}catch(e){
		console.log(e);
		//console.log(numCopies);
	}

}
/*book ISBN drop for now will later turn to text field **
function getBookISBN(bookJSON){
  var bookISBNText = `<select id='bookISBN' form = 'reservationForm'>`;
  for (let book of bookJSON){
    bookISBNText +="<option value = '" + book['bookISBN'] + "'>" ;
    //display Id and Name in selection
    bookISBNText +=  book["bookName"]+" - " + book["author"];
    bookISBNText += "</option> ";
  }
  
  bookISBNText += "</select> <br> </div>";
  document.getElementById("bookMenu").innerHTML = bookISBNText;
}*/

//////////////for delete form///////////////////
function getCurrentReservation(bookJSON){
	var courseID=document.getElementById("courseSelection").value.trim();
	if(bookJSON=="No rows"){
		//don't let user try delete if there are no books reserved
		reservationList[courseID] = `This course has no books reserved`;
	}
	else{
		var bookISBNText = `<label for="bookISBNSelection" >Books reserved for course </label>
		<select id='bookISBNSelection' form = 'reservationForm'>`;
		for (let book of bookJSON){
			bookISBNText +="<option value = '" + book['bookISBN'] + "'>" ;
	  		//display Id and Name in selection
	  		bookISBNText +=  book["bookName"];
	  		if(book["author"]!="Unknown"){ //if author is Unknown then we don't need display it
	  			bookISBNText += " by " + book["author"];
	  		}
	  		bookISBNText += " -  reserved "+	book["numCopies"] +" copies";
	  		bookISBNText += "</option> ";
	  	}
  		bookISBNText += "</select> <br> </div>";
  		reservationList[courseID] = bookISBNText;
  	}
  	renderCurrentReservation(false);
}

function renderCurrentReservation(update){
	var courseID=document.getElementById("courseSelection").value.trim();
	if(courseID==-1){
		return;
	}
	if(update || reservationList[courseID]==undefined ){
		loadReserveList(getCurrentReservation,"loadReservedBooks");
	}
	else{
		var deleteButton=document.getElementById("deleteButton");
		try {
			if(reservationList[courseID]=="This course has no books reserved"){
				deleteButton.style.display = "none";
			}
			else{
				deleteButton.style.display = "inline";
			}
			document.getElementById("bookISBNMenu").innerHTML =reservationList[courseID] ;
		}
	  	catch(e){ //if menu is gone
	  		console.log(e);
	  	//console.log(reservationList[courseID]);
	  	}
	}
}