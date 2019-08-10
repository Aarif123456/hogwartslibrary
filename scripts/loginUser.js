
function verifyUser() {
  	var username =document.getElementById("username").value.trim();
  	var password =document.getElementById("password").value;//spaces count on passwords
  	var userType= (document.getElementsByName("userType")[0].checked)?"user":"librarian";
    if(password=="" || username==""){
        document.getElementById("hint").innerHTML= "please fill out all fields";
        return;
    }
  	//create parameter to send to server side
  	var par = "username="+username+"&password="+password+"&userType="+userType;  	
    var loginAttempt=0;
  	//Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/verifyUser.php";
    
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //if username not taken substring then the may have mistyped or meant to sign up
        if(this.responseText.trim().indexOf("Username not taken")!==-1){ 
          document.getElementById("hint").innerHTML ="This user name is not taken<br> <a href='/signUp'>Click here</a> if you meant to sign up"; //**add in page
        }
        else if(this.responseText.trim().indexOf("ERROR: database failure")!==-1){
          document.getElementById("hint").innerHTML= "Sorry the login server is down. <br>Please try again at a later time";
        }
        else if(this.responseText.trim().indexOf("ERROR: Invalid user type")!==-1){
          document.getElementById("hint").innerHTML= "According to our server you are not an active librarian<br>If this is an error please contact your administrator<br>Otherwise please try to login in as a user";
        }
        else if(this.responseText.trim().indexOf("Invalid password.")!==-1){
          document.getElementById("hint").innerHTML="Incorrect password";
          loginAttempt+=1;
          if(loginAttempt>=3){
            document.getElementById("hint").innerHTML+="<br>If you have forgotten your password. You may reset with your email by<a href='/resetPassword'>clicking here.</a> <br>Otherwise you can contact your administrator to reset your password.";
          }

        }
        else if(this.responseText.trim().indexOf("Password is valid!")!==-1){
           window.location = "https://aarif123456.github.io/HogwartsLibrary/docs/catalogue/userDashboard";
          //redirect to dashboard
        }
        else{
          document.getElementById("hint").innerHTML = "Something went wrong:(";
        }
       


      }
      else{

      }
    }
    xmlhttp.open('POST', url , true);
    xmlhttp.withCredentials = true;
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(par); 

    //clear fields
    document.getElementById("signIn").reset();
}
