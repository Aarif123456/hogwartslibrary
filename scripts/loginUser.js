
function verifyUser() {
  	var username =document.getElementById("username").value.trim();
  	var password =document.getElementById("password").value;//spaces count on passwords
  	var userType= (document.getElementsByName("userType")[0].checked)?"user":"librarian";
    if(password=="" || username==""){
        console.log( "fill out all fields");
        return;
    }
  	//create parameter to send to server side
  	var par = "username="+username+"&password="+password+"&userType="+userType;  	

  	//Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/verifyUser.php";
    
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      	console.log( this.responseText);
      }
    }
    xmlhttp.open('POST', url , true);
    xmlhttp.withCredentials = true;
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(par); 

    //clear fields
    document.getElementById("signIn").reset();
}
