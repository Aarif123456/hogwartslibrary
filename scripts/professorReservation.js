//Abdullah Arif
//handle reservation for professors
var reservationList={};
//add reservation 
function addReservation(){
  var courseID=document.getElementById("courseSelection").value.trim();
  var bookISBN=document.getElementById("bookISBN").value.trim();
  var numCopies=document.getElementById("numCopies").value.trim();
  //create parameter to send to server side
  var par = "courseID="+courseID+"&bookISBN="+bookISBN+"&numCopies="+numCopies+"&add=yes";

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
  var bookISBN=document.getElementById("bookISBNSelection").value.trim();
  //create parameter to send to server side
  var par = "courseID="+courseID+"&bookISBN="+bookISBN+"&delete=yes";

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
  loadReserveList(getProfessorCourses,"loadCourses");
  var profID=document.getElementById("professorSelection").value.trim();
  if(profID !=-1){ //if you are a librarian
  	loadReserveList(getProfessors,"loadProfessor");
  }
});
//toggling add and delete form
function displayForm(){
  //Get mode - either adding or subtracting and the div of the form
  var mode=document.getElementsByName("mode");
  var reservationForm=document.getElementById("reservationMenu");

  if(mode[0].checked){ //check if added
    reservationForm.innerHTML = 
    `<form autocomplete="off" name="reservationForm" id="reservationForm" onsubmit="return false;">
<label for="numCopies" >Number of copy to reserve (Max 10): </label>
<input type='text' id='numCopies' name='numCopies' onchange="setNumberCopies();">
<div class="autocomplete" style="width:700px;">
<label for="bookISBN" >ISBN of book to reserve: </label>
<input id="bookISBN" type="text" name="bookISBN" placeholder="978-0-0953-8960-0">
</div>
<button type="button" onclick="addReservation();">Reserve book for course!</button>
</form> 
<div id="hint"></div>`;
    //get bookISBN from text-box
    //loadReserveList(getBookISBN,"loadAvailableBooks");
  }
  if(mode[1].checked){ //if delete form
   reservationForm.innerHTML =
   `<form autocomplete="off" name="reservationForm" id="reservationForm" onsubmit="return false;"> 
<div id="bookISBNMenu">
</div>
<br>
<button type="button" onclick="deleteReservation();">Delete reservation</button>
</form>
<div id="hint"></div>`;
     //getCurrentely reserved books that looks at the currently chosen course in the drop-down
     renderCurrentReservation(false);
   }
 }
function loadReserveList(getList,listName){ //use Ajax to create needed list
  var xmlhttp = new XMLHttpRequest();
  var courseID=document.getElementById("courseSelection").value.trim();
  //use to work with librarian reservation
  var profID=document.getElementById("professorSelection").value.trim();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      try {
      	if(this.responseText.trim()=="No rows" && listName=="loadReservedBooks"){
      		reservationList[courseID] = "This course has no books reserved";
      		renderCurrentReservation(false);
      	}
      	else{
      		getList(JSON.parse(this.responseText));
      	}
      }
      catch (e) {
        console.log(this.responseText);
    	console.log(e);
      }
    }
  }
  xmlhttp.open('POST',"https://arif115.myweb.cs.uwindsor.ca/60334/projects/reservationList", true);
  xmlhttp.withCredentials = true;
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("listType="+listName+"&courseID="+courseID+"&userID="+profID);
}
//courses by prof drop-down 
function getProfessorCourses(courseJSON){
  var courseListText =`<select id='courseSelection' form='reservationForm' onchange="displayForm();">`;
  for (course of courseJSON){
    //set course's ID as value
    courseListText +="<option value = '" + course['courseID'] + "'>" ;
    //display Id and Name in selection
    courseListText +=  course['courseID']+":     " + course["courseName"];
    courseListText += "</option> ";
    reservationList[course['courseID']] = "";
  }
  
  courseListText += "</select> <br> </div>";
  document.getElementById("courseMenu").innerHTML = courseListText;
}
/////////////////for librarians/////////////////////
function getProfessorCourses(professorJSON){
  var professorListText =`<select id='courseSelection' form='reservationForm' onchange="displayForm();">`;
  for (professor of professorJSON){
    //set professor's ID as value
    professorListText +="<option value = '" + professor['professorID'] + "'>" ;
    //display Id and Name in selection
    professorListText +=  professor['professorID']+":     " + professor["fname"] +" " +professor["lname"];
    professorListText += "</option> ";
  }
  
  professorListText += "</select> <br> </div>";
  document.getElementById("professorMenu").innerHTML = professorListText;
}
/////////////////for add form ///////////////////////
//number of copies prof wants to reserve force stay between 1 and 10
function setNumberCopies(){
  numCopies = parseInt(document.getElementById("numCopies").value.trim(),10);
  if(isNaN(numCopies)){
    numCopies=0;
  }
  if(numCopies<0){
    numCopies=0;
  }
  if(numCopies>10){
    numCopies=10;
  }
  document.getElementById("numCopies").value = String(numCopies);
}
/*book ISBN drop for now will later turn to text field **
function getBookISBN(bookJSON){
  var bookISBNText = `<select id='bookISBN' form = 'reservationForm'>`;
  for (book of bookJSON){
    bookISBNText +="<option value = '" + book['bookISBN'] + "'>" ;
    //display Id and Name in selection
    bookISBNText +=  book["bookName"]+" - " + book["author"];
    bookISBNText += "</option> ";
  }
  
  bookISBNText += "</select> <br> </div>";
  document.getElementById("bookMenu").innerHTML = bookISBNText;
}*/

//////////////for delete form///////////////////
function getCurrentReservation(bookJSON,update){
  var courseID=document.getElementById("courseSelection").value.trim();
  var bookISBNText = `<label for="bookISBNSelection" >Books reserved for course </label>
  <select id='bookISBNSelection' form = 'reservationForm'>`;
  for (book of bookJSON){
    bookISBNText +="<option value = '" + book['bookISBN'] + "'>" ;
    //display Id and Name in selection
    bookISBNText +=  book["bookName"]+" - " + book["author"] +"-  reserved "+
    book["numCopies"];
    bookISBNText += "</option> ";
  }
  
  bookISBNText += "</select> <br> </div>";
  reservationList[courseID] = bookISBNText;
  renderCurrentReservation(false);
}

function renderCurrentReservation(update){
	var courseID=document.getElementById("courseSelection").value.trim();
	if(update || reservationList[courseID]=="" ){
		loadReserveList(getCurrentReservation,"loadReservedBooks");
	}
	document.getElementById("bookISBNMenu").innerHTML =reservationList[courseID] ;
}