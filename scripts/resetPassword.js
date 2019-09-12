//Abdullah Arif 
//Allows headmaster to reset user password

window.addEventListener('DOMContentLoaded', (event) => {
 loadList(getUserList,"loadUsers");
});
function checkPassword(){
 var password =document.getElementById("userPassword").value;
 var passwordCheck =document.getElementById("confirmUserPassword").value;
 if(password!=passwordCheck){
   console.log("Passwords do not match");
   return false;
 }
 return true;
}

function resetPassword() {
 //select user
 var uID=document.getElementById("userSelection").value.trim();
 //set new password
 var uPassword=document.getElementById("userPassword").value;
 //get password again for added security -> in case developer steps away from computer
 var developerPassword= document.getElementById("developerPassword").value;
 //create parameter to send to server side
 var par ="uID="+uID+"&uPassword="+uPassword +"&developerPassword="+developerPassword;
 if(uID =="" || uPassword=="" || developerPassword==""){
   console.log( "fill out all fields");
   return;
 }
 if(!checkPassword()) { //make sure password matches
   return;
 }

 //Ajax to reset
 var xmlhttp = new XMLHttpRequest();
 var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/resetPassword";
 xmlhttp.open('POST', url, true);
 xmlhttp.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) {
     console.log( this.responseText);
     document.getElementById("resetForm").reset(); //clear fields
   }
 }
 xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 xmlhttp.withCredentials = true;
 xmlhttp.send(par); 
}

function getUserList(userJSON){ //display list of users in drop-down box
 var userListText = `<label for="userSelection" >Active Users:   </label>
<select id="userSelection" form = "resetForm">`;
 for (user of userJSON){
   userListText +="<option value = '" + user['userID'] + "'>" ;
   //display Id and Name in selection
   userListText +=  user["userName"] ;
   userListText += "</option> ";
 }
 
 userListText += "</select> <br> </div>";
 document.getElementById("userMenu").innerHTML = userListText;

}

//will use to get list of user **will use this to bring up suggestion
function loadList(getList,listName){ //use Ajax to create needed list
   var xmlhttp = new XMLHttpRequest();
   xmlhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
         try {
       getList(JSON.parse(this.responseText));
     }
     catch (e) {
       console.log(this.responseText);
     }
       }
     }
     xmlhttp.open('POST',"https://arif115.myweb.cs.uwindsor.ca/60334/projects/loadList", true);
     xmlhttp.withCredentials = true;
     xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
     xmlhttp.send("listType="+listName);
}