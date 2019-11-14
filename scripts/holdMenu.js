//Abdullah Arif
//Handles creating the hold menu for users
"use strict";
var holdStatus=[];
var holdCount=0;
var holdSuccess=0
var holdFail=0;
function cancelHold(holdID){
  var xmlhttps = new XMLHttpRequest(); 
  xmlhttps.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	if(this.responseText.trim().includes("Hold cancelled.")){
    		holdSuccess++;
    	}
    	else{
    		holdStatus.push(this.responseText.trim()+'<br>');
    		holdFail++;
    	}
    	
    	if(holdCount=== holdSuccess+holdFail && holdCount !=0){
    		renderHoldStatus();
    	}
    }
  };
  xmlhttps.open("POST","https://arif115.myweb.cs.uwindsor.ca/60334/projects/cancelHoldBooks", true);
  xmlhttps.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttps.withCredentials = true;
  xmlhttps.send("userID="+holdID); 
}
function renderHoldStatus(){
	holdStatusText="";
	if (holdSuccess>0){ 
		holdStatusText +="You have successfully cancelled " +holdSuccess +" book";
		if(holdSuccess>1){ //if more that one book make it plural
			holdStatusText+='s';
		}
		holdStatusText+="!<br>";
	}
	if(holdFail>0){
		for(let h of holdStatus){
			holdStatusText +=h;
		}
	}
	loadCheckOutMenu();
	document.getElementByID("hold_status")=holdStatusText;
	holdStatus=[];
	holdCount=0;
	holdSuccess=0;
	holdFail=0;
}
function cancelAllHold(){
  var checkedBoxes = document.getElementsByName("boxes[]");
  var i; 
  for (i = 0; i < checkedBoxes.length; i++){  
    if(checkedBoxes[i].checked){
    	holdCount++;
      	cancelHold(checkedBoxes[i].value);
    }
  }
}
//load up all books on hold for user
window.addEventListener('DOMContentLoaded', (event) => {
    loadHoldMenu();
});

function loadHoldMenu(){
  var xmlhttps = new XMLHttpRequest();
  xmlhttps.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //create table using info from JSON file 
      try {
        if(this.responseText.trim()=="No rows"){
          document.getElementById("hold_table").innerHTML = "You have no holds right now";
          document.getElementById("cancelButton").style.display ="none";
        }
        else{
          createHoldTable(JSON.parse(this.responseText));
          document.getElementById("cancelButton").style.display ="inline";
        } 
      }catch (e) {
        console.log(this.responseText);
        console.log(e);
      }
    }
  };
  var url="https://arif115.myweb.cs.uwindsor.ca/60334/projects/loadHoldMenu.php";
  xmlhttps.open("GET", url, true); //Set get request with given parameter
  xmlhttps.withCredentials = true;
  xmlhttps.send(); 
}
function createHoldTable(holdJSON){
  var tableText = "<table><thead><tr>";
  tableText+=`<td><input type="checkbox" id='allBox' onclick=
  "check_all('boxes[]','allBox' )"></td>`; //check box that lets you check all the other check boxes
  tableText+=`<td>Title</td><td>Author</td><td>Expiry date</td><td>Available for pick up</td><td>Number in Queue </td>`;
  tableText+=`</tr></thead>`;//end the head of the table
  tableText+="<tbody>"; //Start table body 
  for (var hold of holdJSON){
    tableText += "<tr>"; //one row per hold
    tableText += `<td><input type="checkbox" name='boxes[]' value ='`+hold['holdID']+`'></td>`;
    tableText +="<td>"+ hold['bookName'] +"</td>";
    tableText +="<td>"+ hold['author'] +"</td>";
    tableText +="<td>"+ hold['holdExpiryDate'] +"</td>";
    if(hold['reservedCopy']!=null || hold['queueNumber']===0){
      tableText +="<td>"+ 'Available' +"</td>";
    }
    else{
      tableText +="<td>"+ 'Unavailable' +"</td>";
    }
    tableText +="<td>"+ hold['queueNumber'] +"</td>";
    tableText += "<tr>"; //end the row
  }
  tableText+= "</tbody> </table>";//close table
  document.getElementById("hold_table").innerHTML = tableText;  
}

function check_all(boxName,allboxname){
  var checkedBoxes = document.getElementsByName(boxName); 
  var i; 
  if (document.getElementById(allboxname).checked) 
    for (i = 0; i < checkedBoxes.length; i++) 
      checkedBoxes[i].checked=true; 
  else 
    for (i = 0; i < checkedBoxes.length; i++) 
      checkedBoxes[i].checked=false; 
}