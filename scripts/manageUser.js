function registerUser() {
 var fname =document.getElementById("fname").value.trim();
   var lname =document.getElementById("lname").value.trim();
   var userCategory=document.getElementById("userCategory").value.trim();
   var userType=displayFields();

 if(userType=="none"){
   console.log( "Please select user type");
   return;
 }
 if(fname =="" || lname=="" || userCategory==""){
   console.log( "fill out all fields");
   return;
 }

   //create parameter to send to server side
   var par = "fname="+fname+"&lname="+lname+"&add=yes"+"&userType="+userType+"&userCategory="+userCategory;
   if(userType=="student"){
   par+="&house="+document.getElementById("house").value.trim();
   }
   

   //Ajax insert
    var xmlhttp = new XMLHttpRequest();
    var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/manageUser.php";
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       console.log( this.responseText);
      }
    }
    xmlhttp.withCredentials = true;
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(par); 

    //clear fields
    document.getElementById("addForm").reset();
    displayFields();

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