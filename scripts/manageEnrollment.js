//Abdullah Arif
'use strict';
window.addEventListener('DOMContentLoaded', (event) => {
    displayForm();
});
function deleteEnrollment() {
    //get enrollmentID for drop down
    var enrollmentID = document
        .getElementById('enrollmentSelection')
        .value.trim();

    //create parameter to send to server side
    var par = 'enrollmentNumber=' + enrollmentID + '&delete=yes';

    //Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url =
        'https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/headmaster/deleteEnrollment';
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            displayForm(this.responseText);
        }
    };
    xmlhttp.setRequestHeader(
        'Content-type',
        'application/x-www-form-urlencoded'
    );
    xmlhttp.withCredentials = true;
    xmlhttp.send(par);

    //clear fields
    document.getElementById('deleteForm').reset();
}
function enrollStudent() {
    //get variable needed to enroll students
    var studentID = document.getElementById('studentSelection').value.trim();
    var courseID = document.getElementById('courseSelection').value.trim();

    //create parameter to send to server side
    var par = 'studentID=' + studentID + '&courseID=' + courseID + '&add=yes';

    //Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url =
        'https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/headmaster/addEnrollment';
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            displayForm(this.responseText);
        }
    };
    xmlhttp.setRequestHeader(
        'Content-type',
        'application/x-www-form-urlencoded'
    );
    xmlhttp.withCredentials = true;
    xmlhttp.send(par);

    //clear fields
    document.getElementById('addForm').reset();
}
function displayForm(prompt) {
    //Set variables needed
    var mode = document.getElementsByName('mode');
    var enrollmentForm = document.getElementById('enrollmentForm'); //holds the entire html for both forms

    if (mode[0].checked) {
        //check if added
        enrollmentForm.innerHTML = `
      <form name="addForm" id="addForm" onsubmit="return false;">
      <label for="courseSelection" >Courses: </label>
        <div id="courseMenu"> 
           <select id="courseSelection" form = "addForm">
           </select></div>
         <br>
        <label for="studentSelection" >Students:   </label>
         <div id="studentMenu"> 
           <select id="studentSelection" form = "addForm">
           </select></div>

           <button type="button" onclick="enrollStudent();">Enroll student!</button>
         </form>`;
        loadList(getStudentList, 'loadStudents'); //load list of student
        loadList(getCourseList, 'loadCourses'); //load courses
    }
    if (mode[1].checked) {
        //if delete form
        enrollmentForm.innerHTML = `
      <form name="deleteForm" id="deleteForm" onsubmit="return false;">
       <label for="enrollmentSelection" >Enrollment: </label>
        <div id="enrollmentMenu"> 
           <select id="enrollmentSelection" form = "deleteForm">
           </select></div>
         <br>
           <button type="button" onclick="deleteEnrollment();">Delete Enrollment</button>
         </form>`;
        loadList(getEnrollmentList, 'loadEnrollment'); //load list of current enrollment
    }
    if (prompt == undefined) {
        document.getElementById('enrollmentHint').innerHTML = '';
    } else {
        document.getElementById('enrollmentHint').innerHTML = prompt;
    }
}
function getStudentList(studentJSON) {
    //display list of students in drop-down box
    var studentListText = ` <select id="studentSelection" form = "addForm"> `;

    for (let student of studentJSON) {
        //set student's ID as value
        studentListText += "<option value = '" + student['studentID'] + "'>";
        //display Id and Name in selection
        studentListText +=
            student['studentID'] +
            ':     ' +
            student['fname'] +
            ' ' +
            student['lname'];
        studentListText += '</option> ';
    }

    studentListText += '</select> <br> </div>';
    document.getElementById('studentMenu').innerHTML = studentListText;
}

function getCourseList(courseJSON) {
    //display list of courses in drop-down box
    var courseListText = `<select id='courseSelection' form = 'addForm'>`;
    for (let course of courseJSON) {
        //set course's ID as value
        courseListText += "<option value = '" + course['courseID'] + "'>";
        //display Id and Name in selection
        courseListText +=
            course['courseID'] +
            ':     ' +
            course['courseName'] +
            ' - ' +
            course['TermOffered'];
        courseListText += '</option> ';
    }

    courseListText += '</select> <br> </div>';
    document.getElementById('courseMenu').innerHTML = courseListText;
}

function getEnrollmentList(enrollmentJSON) {
    //display list of enrollments in drop-down box
    var enrollmentListText = ` <select id='enrollmentSelection' form = 'deleteForm'>`;
    for (let enrollment of enrollmentJSON) {
        //set enrollment's ID as value
        enrollmentListText +=
            "<option value = '" + enrollment['enrollmentID'] + "'>";
        //display Id and Name in selection
        enrollmentListText +=
            'Student ID:' +
            enrollment['studentID'] +
            ' - ' +
            enrollment['fname'] +
            ' ' +
            enrollment['lname'] +
            ' is in Course: ' +
            enrollment['courseID'] +
            ' - ' +
            enrollment['courseName'];
        enrollmentListText += '</option> ';
    }

    enrollmentListText += '</select> <br> </div>';
    document.getElementById('enrollmentMenu').innerHTML = enrollmentListText;
}

function loadList(getList, listName) {
    //use Ajax to create needed list
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                getList(JSON.parse(this.responseText));
            } catch (e) {
                console.log(e);
                console.log(this.responseText);
            }
        }
    };
    xmlhttp.open(
        'POST',
        'https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/loadList',
        true
    );
    xmlhttp.withCredentials = true;
    xmlhttp.setRequestHeader(
        'Content-type',
        'application/x-www-form-urlencoded'
    );
    xmlhttp.send('listType=' + listName);
}
