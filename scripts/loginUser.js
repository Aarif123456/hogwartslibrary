//Abdullah Arif
//Verify user login
'use strict';
function verifyUser() {
    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value; //spaces count on passwords
    var userType = document.getElementsByName('userType')[0].checked
        ? 'user'
        : 'librarian';
    if (password == '' || username == '') {
        document.getElementById('hint').innerHTML =
            'please fill out all fields';
        return;
    }
    //create parameter to send to server side
    var par =
        'username=' +
        username +
        '&password=' +
        password +
        '&userType=' +
        userType;
    var loginAttempt = 0;
    //Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url =
        'https://arif115.myweb.cs.uwindsor.ca/hogwartslibrary/api/verifyUser?username=' +
        username;

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try{
                var data = JSON.parse(this.responseText);
                console.log(data);
                if(data.success){
                    var d = new Date(); // date is used store the direct login attempt
                    document.cookie = 'username=' + username + '_' + d.getTime();
                    window.location =
                        'https://abdullaharif.tech/hogwartslibrary/docs/catalogue/userDashboard';
                    //redirect to dashboard
                }
            } catch (e) {
                console.log(this.responseText);
                console.log(e);
                //clear fields on error
                document.getElementById('signIn').reset();
                console.log(this.responseText);
                //if username not taken substring then the may have mistyped or meant to sign up
                if (
                    this.responseText.trim().indexOf('Username not taken') !== -1
                ) {
                    document.getElementById('hint').innerHTML =
                        "This user name is not taken<br> <a href='../catalogue/register'>Click here</a> "+
                        " if you meant to sign up"; 
                } else if (
                    this.responseText
                        .trim()
                        .indexOf('ERROR: database failure') !== -1
                ) {
                    document.getElementById('hint').innerHTML =
                        'Sorry the login server is down. <br>Please try again at a later time';
                } else if (
                    this.responseText
                        .trim()
                        .indexOf('ERROR: Invalid user type') !== -1
                ) {
                    document.getElementById('hint').innerHTML =
                        'According to our server you are not an active librarian';
                } else {
                    document.getElementById('hint').innerHTML = 'Something went wrong:(';
                }
            } 
        } else if(this.status == 403) {
                document.getElementById('hint').innerHTML = 'Incorrect password';;
            }
    };
    xmlhttp.open('POST', url, true);
    xmlhttp.withCredentials = true;
    xmlhttp.setRequestHeader(
        'Content-type',
        'application/x-www-form-urlencoded'
    );
    xmlhttp.send(par);
}
