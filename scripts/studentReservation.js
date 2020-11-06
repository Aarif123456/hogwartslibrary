//Abdullah Arif
//Handle student reservation
'use strict';
var reservationList = {};
function loadReserveList(getList, listName) {
    //use Ajax to create needed list
    var xmlhttp = new XMLHttpRequest();
    var courseID = document.getElementById('courseSelection').value.trim();
    //use to work with librarian reservation

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                if (this.responseText.trim() == 'No rows') {
                    getList(this.responseText.trim());
                } else {
                    getList(JSON.parse(this.responseText));
                }
            } catch (e) {
                console.log(this.responseText);
                console.log(e);
                console.log(listName);
            }
        }
    };
    xmlhttp.open(
        'POST',
        'https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/reservation/reservationList',
        true
    );
    xmlhttp.withCredentials = true;
    xmlhttp.setRequestHeader(
        'Content-type',
        'application/x-www-form-urlencoded'
    );
    xmlhttp.send('listType=' + listName + '&courseID=' + courseID);
}
function getStudentCourses(courseJSON) {
    if (courseJSON == 'No rows') {
        courseListText = `This student is not enrolled in any courses
    <input type="hidden" id="courseSelection" value="-1" >`;
        document.getElementById('holdButton').style.display = 'none'; // Hide the hold button if there are no courses
    } else {
        var courseListText = `<select id='courseSelection' form='reservationForm' 
    onchange="renderCurrentReservation(false);">`;
        for (let course of courseJSON) {
            //set course's ID as value
            courseListText += "<option value = '" + course['courseID'] + "'>";
            //display Id and Name in selection
            courseListText +=
                course['courseID'] + ':     ' + course['courseName'];
            courseListText += '</option> ';
        }
        courseListText += '</select> <br> </div>';
    }
    document.getElementById('courseMenu').innerHTML = courseListText;
    renderCurrentReservation(false);
}

function getCurrentReservation(bookJSON) {
    var courseID = document.getElementById('courseSelection').value.trim();
    if (bookJSON == 'No rows') {
        //don't let user try delete if there are no books reserved
        reservationList[
            courseID
        ] = `This course does not have any books reserved`;
    } else {
        var bookISBNText = `<label for="bookISBNSelection" >Books reserved for course: </label>
    <select id='bookISBNSelection' form = 'reservationForm'>`;
        for (let book of bookJSON) {
            bookISBNText += "<option value = '" + book['bookISBN'] + "'>";
            //display Id and Name in selection
            bookISBNText += book['bookName'];
            if (book['author'] != 'Unknown') {
                //if author is Unknown then we don't need display it
                bookISBNText += ' by ' + book['author'];
            }
            bookISBNText += ' -  reserved ' + book['numCopies'] + ' copies';
            bookISBNText += '</option> ';
        }
        bookISBNText += '</select> <br> </div>';
        reservationList[courseID] = bookISBNText;
    }
    renderCurrentReservation(false);
}

function renderCurrentReservation(update) {
    var courseID = document.getElementById('courseSelection').value.trim();
    if (courseID == -1) {
        return;
    }
    if (update || reservationList[courseID] == undefined) {
        loadReserveList(getCurrentReservation, 'loadReservedBooks');
    } else {
        var holdButton = document.getElementById('holdButton');
        try {
            if (
                reservationList[courseID] == 'This course has no books reserved'
            ) {
                holdButton.style.display = 'none';
            } else {
                holdButton.style.display = 'inline';
            }
            document.getElementById('bookISBNMenu').innerHTML =
                reservationList[courseID];
        } catch (e) {
            //if menu is gone
            console.log(e);
            //console.log(reservationList[courseID]);
        }
    }
}
window.addEventListener('DOMContentLoaded', (event) => {
    loadReserveList(getStudentCourses, 'loadCourses');
});
function holdReservation() {
    //var userID=document.getElementById("borrowedBy").value.trim();
    //create parameter to send to server side
    var bookISBN = document.getElementById('bookISBNSelection').value.trim();
    var courseID = document.getElementById('courseSelection').value.trim();
    var par = 'courseID' + courseID + '&bookISBN=' + bookISBN;

    //Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url =
        'https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/library/holdBooks';
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            document.getElementById('hint').innerHTML = this.responseText;
            //loadPotentialBorrower();
        }
    };
    xmlhttp.setRequestHeader(
        'Content-type',
        'application/x-www-form-urlencoded'
    );
    xmlhttp.withCredentials = true;

    xmlhttp.send(par);
    //clear fields
}
