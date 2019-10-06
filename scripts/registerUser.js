//Abdullah Arif 
//Create user from scratch
function registerUser(valid) {
  	var fname =document.getElementById("fname").value.trim();
  	var lname =document.getElementById("lname").value.trim();
  	var username =document.getElementById("username").value.trim();
  	var password =document.getElementById("password").value;//spaces count on passwords
  	var userCategory=document.getElementById("userCategory").value.trim();
  	var passcode=document.getElementById("passcode").value.trim();
  	//get userID as well when registering 
  	var userType=displayFields();
  	if(valid===false){
  		if(userType=== "none"){
	  		document.getElementById("hint").innerHTML = "Please select user type";
	  		return;
	  	}
	  	if(fname === "" || lname=== "" || password=== "" || username=== ""|| userCategory=== "" || passcode === ""){
	  		document.getElementById("hint").innerHTML = "Please fill out all fields";
	  		return;
	  	}
	  	if(!checkPassword()) { //make sure password matches
	  		return;
	  	}
	  	checkUsername(registerUser); //using a callback function to synchronize ajax call 
  	}
  	else{ 
	  	//create parameter to send to server side
	  	var par = "fname= "+fname+"&lname= "+lname+"&password= "+password+"&username= "+username+"&add=yes"+"&userType= "+userType+"&userCategory= "+userCategory+"&passcode= "+passcode;
	  	if(userType== "student"){
			par+= "&house= "+document.getElementById("house").value.trim();
	  	}
	  	//Ajax insert
	    var xmlhttp = new XMLHttpRequest();
	    var url= "https://arif115.myweb.cs.uwindsor.ca/60334/projects/manageUser.php";
	    xmlhttp.open('POST', url, true);
	    xmlhttp.onreadystatechange = function() {
	      if (this.readyState == 4 && this.status == 200) {
	      	document.getElementById("hint").innerHTML = this.responseText;
	      }
	    }
	    xmlhttp.withCredentials = true;
	    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xmlhttp.send(par); 

	    //clear fields
	    document.getElementById("addForm").reset();
	    displayFields();
	}

}

function checkUsername(callback){
	var username =document.getElementById("username").value.trim();
	console.log(username);
	var xmlhttp = new XMLHttpRequest();
	if(username== ""){
		document.getElementById("hint").innerHTML = "Please fill out all fields";
		return false;
	}
	if(!(/^[a-zA-Z0-9_]+$/.test(username))) {
		document.getElementById("hint").innerHTML = "Username can only be alphabets, numbers or underscores";
		return false;
	}
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      	if(this.responseText.trim() === "Username not taken"){  
      	//clear field username becomes valid but don't clear out any other error
      		console.log(this.responseText);
      		document.getElementById("hint").innerHTML = "Username is not taken";
      		if(callback!=undefined){
      			callback(true);
      		}
      		return true;
      	}
      	else if(this.responseText.trim() === "Username is taken"){
      		document.getElementById("hint").innerHTML = "Username is taken";
      		return false;
      	}
      }
    }
    //search using given username
    var url= "https://arif115.myweb.cs.uwindsor.ca/60334/projects/verifyUser.php";
    var par = "username= " + username + "&userType=user";
    xmlhttp.open('POST', url , true);
    xmlhttp.withCredentials = true;
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(par); 
}

function checkPassword(){
	var password =document.getElementById("password").value;
	var passwordCheck =document.getElementById("confirmPassword").value;
	if(password!=passwordCheck){
		document.getElementById("hint").innerHTML = "Passwords do not match";
		return false;
	}
	return true;
}

function displayFields(){
   //Set variables needed
 var userCategory=document.getElementById("userCategory");
 var userCategoryText=document.getElementById("userCategoryText");
 var house = document.getElementById("house");
 var houseText = document.getElementById("houseText");
 var userType= document.getElementsByName("userType");
 userCategory.style.display = "inline";
 if(userType[0].checked){ //run if student selected 

   userCategoryText.innerHTML = "<label for='userCategoryText' >Major </label><br>";
   house.style.display = "inline";
   houseText.innerHTML= "<label for='house' >House </label><br>";
   return userType[0].value; //return student
 }
 if(userType[1].checked){ //code if professor is selected
   userCategoryText.innerHTML= "<label for='userCategoryText' >Department </label><br>";
   house.style.display = "none";
   houseText.innerHTML= "";
   return userType[1].value; //return professor
 }
 userCategory.style.display = "none";
 house.style.display = "none";
 userCategoryText.innerHTML= "";
 houseText.innerHTML= "";
 return "none";
}

