//Abdullah Arif 
//Js files handles adding and deleting courses for headmaster
//load after page loads
"use strict";
window.addEventListener('DOMContentLoaded', (event) => {
  displayForm();
  loadList( getProfessorList,"loadProfessor");
});
function deleteCourses(){
  var courseID=document.getElementById("courseSelection").value.trim();
  var par = "courseID="+courseID +"&delete=yes";
  var xmlhttp = new XMLHttpRequest();
  var url="https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/deleteCourses.php";
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
  document.getElementById("deleteCoursesForm").reset();//clear fields
}
 function addCourse() {
  //need to get course name, professor ID, term offered
  var professorID=document.getElementById("professorSelection").value.trim();
  var courseName=document.getElementById("courseText").value.trim();
  var termOffered=document.getElementById("termOffered").value.trim();
  if(courseName ==""){
    console.log( "Enter course Name");
    return;
  }
  //create parameter to send to server side
  var par = "professorID="+professorID+"&courseName="+courseName+"&termOffered="+termOffered+"&add=yes";

  //Ajax insert
  var xmlhttp = new XMLHttpRequest();
  var url="https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/addCourses.php";
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
  document.getElementById("addCoursesForm").reset();
}

function displayForm(){
    //Set variables needed
    var mode=document.getElementsByName("mode");
    var courseForm=document.getElementById("coursesForm"); //holds the entire html for both forms
          
    if(mode[0].checked){ //check if added
      courseForm.innerHTML = `<form name="addCoursesForm" id="addCoursesForm" onsubmit="return false;">
  <label for="courseText" >Course Name:   </label>
  <input type='text' id='courseText' name='courseText'>
  <br>
  <label for="termOffered" >Term Offered:   </label>
   <input type='text' id='termOffered' name='termOffered'>
   <br>
    <label for="professorSelection" >Professors:   </label>
    <div id="professorMenu"> 
       <select id="professorSelection" form = "addCoursesForm">
       </select>
    </div>
     <button type="button" onclick="addCourses();">Create course!</button>
   </form>`;
      loadList( getProfessorList,"loadProfessor"); //load list of professor  
    }
    if(mode[1].checked){ //if delete form
       courseForm.innerHTML =`<form name="deleteCoursesForm" id="deleteCoursesForm" onsubmit="return false;">
       <label for="courseSelection" >Courses: </label>
         <div id="courseMenu"> 
           <select id="courseSelection" form = "deleteCoursesForm">
           </select></div>
        <button type="button" onclick="deleteCourses();">Delete course</button>
      </form>`;
       loadList(getCourseList,"loadCourses");       //load courses  
    }
}
function getProfessorList(professorJSON){ //display list of professors in drop-down box
  var professorListText = `<select id="professorSelection" form = "addCoursesForm"> `;
  for (let professor of professorJSON){
    //set professor's ID as value
    professorListText +="<option value = '" + professor['professorID'] + "'>" ;
    //display Id and Name in selection
    professorListText +=  professor['professorID']+":     " + professor["fname"] +" " +professor["lname"];
    professorListText += "</option> ";
  }
  
  professorListText += "</select> <br> </div>";
  document.getElementById("professorMenu").innerHTML = professorListText;

}

function getCourseList(courseJSON){ //display list of courses in drop-down box
  var courseListText = `<select id='courseSelection' form = 'deleteCoursesForm'>`;
  for (let course of courseJSON){
    //set course's ID as value
    courseListText +="<option value = '" + course['courseID'] + "'>" ;
    //display Id and Name in selection
    courseListText +=  course['courseID']+":     " + course["courseName"] +" - " +course["TermOffered"];
    courseListText += "</option> ";
  }
  
  courseListText += "</select> <br> </div>";
  document.getElementById("courseMenu").innerHTML = courseListText;

}



function loadList(getList,listName){ //use Ajax to create needed list
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          try {
        getList(JSON.parse(this.responseText));}
        catch (e) {
          console.log(this.responseText);
        }
      }
    }
    xmlhttp.open('POST',"https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/loadList", true);
    xmlhttp.withCredentials = true;
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("listType="+listName);
}
 