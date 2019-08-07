function createUser(valid) {
  	var fname =document.getElementById("fname").value.trim();
  	var lname =document.getElementById("lname").value.trim();
  	var username =document.getElementById("username").value.trim();
  	var password =document.getElementById("password").value;//spaces count on passwords
  	var userCategory=document.getElementById("userCategory").value.trim();
  	var userType=displayFields();
  	if(valid==false){
  		if(userType=="none"){
	  		console.log( "Please select user type");
	  		return;
	  	}
	  	if(fname =="" || lname=="" || password=="" || username==""|| userCategory==""){
	  		console.log( "fill out all fields");
	  		return;
	  	}
	  	if(!checkPassword()) { //make sure password matches
	  		return;
	  	}
	  	checkUsername(createUser); //using a callback function to synchronize ajax call 
  	}
  	else{ 
	  	//create parameter to send to server side
	  	var par = "fname="+fname+"&lname="+lname+"&password="+password+"&username="+username+"&add=yes"+"&userType="+userType+"&userCategory="+userCategory;

	  	if(userType=="student"){
			par+="&house="+document.getElementById("house").value.trim();
	  	}
	  	

	  	//Ajax insert
	    var xmlhttp = new XMLHttpRequest();
	    var url="http://hogwartslibrary.000webhostapp.com/manageUser.php";
	    xmlhttp.open('POST', url, true);
	    xmlhttp.onreadystatechange = function() {
	      if (this.readyState == 4 && this.status == 200) {
	      	console.log( this.responseText);
	      }
	    }
	    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    xmlhttp.send(par); 

	    //clear fields
	    document.getElementById("addForm").reset();
	    displayFields();
	}

}

function checkUsername(callback){
	var username =document.getElementById("username").value.trim();
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      	if(this.responseText.trim() == "Username not taken"){  
      	//clear field username becomes valid but don't clear out any other error
      		console.log("Username is not taken");
      		if(callback!=undefined){
      			callback(true);
      		}
      		return true;
      	}
      	else if(this.responseText.trim() == "Username is taken"){
      		console.log("Username is taken");
      		return false;
      	}
      }
    }
    //search using given username
    var url="http://hogwartslibrary.000webhostapp.com/verifyUser.php";
    var par ="username=" + username + "&userType=user";
    xmlhttp.open('POST', url , true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(par); 
}

function checkPassword(){
	var password =document.getElementById("password").value;
	var passwordCheck =document.getElementById("confirmPassword").value;
	if(password!=passwordCheck){
		console.log("Passwords do not match");
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
		userCategoryText.innerHTML = "Major<br>";
		house.style.display = "inline";
		houseText.innerHTML="House<br>";
		return userType[0].value; //return student
	}
	if(userType[1].checked){ //code if professor is selected
		userCategoryText.innerHTML="Department<br>";
		house.style.display = "none";
		houseText.innerHTML="";
		return userType[1].value; //return professor
	}
	userCategory.style.display = "none";
	house.style.display = "none";
	userCategoryText.innerHTML="";
	houseText.innerHTML="";
	return "none";
}